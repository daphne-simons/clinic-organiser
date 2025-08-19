import pool from "../config/connection.ts"
import { IAppointmentInfo } from "../../../src/models.ts"

export async function getAllAppointments(): Promise<IAppointmentInfo[]> {
  // NOTE: postgreSQL automatically lowercases aliases, so to retain camelCase, double quotes are used.
  const result = await pool.query(
    'SELECT id, client_id AS "clientId", start_time AS "startTime", end_time AS "endTime", appointment_type AS "appointmentType", notes FROM appointments'
  )
  return result.rows
}

export async function addAppointment(
  clientId: string,
  startTimeUTC: string,
  endTimeUTC: string,
  appointmentType: string,
  notes: string
): Promise<void> {
  await pool.query(
    "INSERT INTO appointments (client_id, start_time, end_time, appointment_type, notes) VALUES ($1, $2, $3, $4, $5)",
    [clientId, startTimeUTC, endTimeUTC, appointmentType, notes]
  )
}

export async function updateAppointment(
  clientId: string,
  startTimeUTC: string,
  endTimeUTC: string,
  appointmentType: string,
  notes: string,
  id: number
): Promise<void> {
  await pool.query(
    "UPDATE appointments SET client_id = $1, start_time = $2, end_time = $3, appointment_type = $4, notes = $5 WHERE id = $6",
    [clientId, startTimeUTC, endTimeUTC, appointmentType, notes, id]
  )
}
export async function deleteAppointment(id: number): Promise<void> {
  await pool.query("DELETE FROM appointments WHERE id = ($1)", [id])
}
