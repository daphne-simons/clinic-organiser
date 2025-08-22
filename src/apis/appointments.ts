import request from "superagent"
import type { IAppointmentAPI, IAppointmentInfo } from "../models"

export async function getAppointments(token: string) {
  const data = await request
    .get("/api/v1/appointments/")
    .set("Authorization", `Bearer ${token}`)

  const result = data.body.map((appointment: IAppointmentAPI) => ({
    ...appointment,
    //  Converts UTC time to local time
    startTime: new Date(appointment.startTime),
    endTime: new Date(appointment.endTime),
  }))

  return result as IAppointmentInfo[]
}

export async function addAppointment(
  appointment: IAppointmentInfo,
  token: string
) {
  const { firstName, lastName, ...rest } = appointment
  let clientId = appointment.clientId
  if (!clientId) {
    const response = await request
      .post("/api/v1/clients/")
      .send({
        first_name: firstName,
        last_name: lastName,
        formSource: "appointments",
      })
      .set("Authorization", `Bearer ${token}`)
    clientId = response.body.id
  }
  await request
    .post("/api/v1/appointments/")
    .send({
      ...rest,
      clientId,
    })
    .set("Authorization", `Bearer ${token}`)
}

export async function updateAppointment(
  appointment: IAppointmentInfo,
  token: string
) {
  await request
    .patch(`/api/v1/appointments/${appointment.id}`)
    .send(appointment)
    .set("Authorization", `Bearer ${token}`)
}
export async function deleteAppointment(id: number, token: string) {
  await request
    .delete(`/api/v1/appointments/${id}`)
    .set("Authorization", `Bearer ${token}`)
}
