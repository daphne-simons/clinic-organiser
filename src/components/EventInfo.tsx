import { Typography } from "@mui/material"
import type { IEventInfo } from "./EventCalendar"

interface IProps {
  event: IEventInfo
}

const EventInfo = ({ event }: IProps) => {
  return (
    <>
      <Typography>{event.description}</Typography>
    </>
  )
}

export default EventInfo