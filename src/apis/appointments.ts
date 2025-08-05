import request from "superagent"
import type { IAppointmentAPI, IAppointmentDraft, IAppointmentInfo } from "../models"

export async function getAppointments() {
  const data = await request.get("http://localhost:3000/api/v1/appointments/")

  const result = data.body.map((appointment: IAppointmentAPI) => ({
    ...appointment,
    // NOTE: had to transform the ISO strings to Date objects to make them compatible with 'react-big-calendar'. 
    startTime: new Date(appointment.startTime),
    endTime: new Date(appointment.endTime),
  }))
  return result as IAppointmentInfo[]
}

export async function addAppointment(appointment: IAppointmentInfo) {
  // NOTE: needed to massage the data to work with the backend route. 
  const massagedAppointment = {
    // TODO: get client id from name
    clientId: 1,
    startTime: appointment.start,
    endTime: appointment.end,
    // TODO: get category description from categoryId
    appointmentType: "ACC",
    notes: appointment.notes,
    customFields: appointment.customFields
  }
  await request.post("http://localhost:3000/api/v1/appointments/").send(massagedAppointment)
}

export async function updateAppointment(appointment: IAppointmentInfo) {
  await request.patch(`http://localhost:3000/api/v1/appointments/${appointment.id}`).send(appointment)
}
export async function deleteAppointment(id: number) {
  await request.delete(`http://localhost:3000/api/v1/appointments/${id}`)
}
