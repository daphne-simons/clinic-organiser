import request from "superagent"
import type { IAppointmentAPI, IAppointmentInfo } from "../models"

export async function getAppointments() {
  const data = await request.get("http://localhost:3000/api/v1/appointments/")

  const result = data.body.map((appointment: IAppointmentAPI) => ({
    ...appointment,
    // NOTE: had to transform the ISO strings to Date objects to make them compatible with 'react-big-calendar'. 
    //  BUG: could be here - need to convert to NZ time?
    startTime: new Date(appointment.startTime),
    endTime: new Date(appointment.endTime),
  }))
  return result as IAppointmentInfo[]
}

export async function addAppointment(appointment: IAppointmentInfo) {

  await request.post("http://localhost:3000/api/v1/appointments/").send(appointment)
}

export async function updateAppointment(appointment: IAppointmentInfo) {
  await request.patch(`http://localhost:3000/api/v1/appointments/${appointment.id}`).send(appointment)
}
export async function deleteAppointment(id: number) {
  await request.delete(`http://localhost:3000/api/v1/appointments/${id}`)
}
