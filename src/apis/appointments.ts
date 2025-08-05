import request from "superagent"
import type { IAppointmentAPI, IAppointmentDraft } from "../models"

export async function getAppointments() {
  const data = await request.get("http://localhost:3000/api/v1/appointments/")
  return data.body as IAppointmentAPI[]
}

export async function addAppointment(appointment: IAppointmentDraft) {
  await request.post("http://localhost:3000/api/v1/appointments/").send(appointment)
}

export async function updateAppointment(appointment: IAppointmentAPI) {
  await request.patch(`http://localhost:3000/api/v1/appointments/${appointment.id}`).send(appointment)
}
export async function deleteAppointment(id: number) {
  await request.delete(`http://localhost:3000/api/v1/appointments/${id}`)
}
