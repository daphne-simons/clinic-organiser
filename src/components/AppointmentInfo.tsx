import { Typography } from "@mui/material"
import type { IAppointmentInfo } from "./AppointmentCalendar"

interface IProps {
  appointment: IAppointmentInfo
}

const AppointmentInfo = ({ appointment }: IProps) => {
  console.log(appointment);

  return (
    <>
      <Typography>{appointment.description}</Typography>
    </>
  )
}

export default AppointmentInfo