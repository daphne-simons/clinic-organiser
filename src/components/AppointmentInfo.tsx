import { Typography } from "@mui/material";
import type { IAppointmentInfo } from "../models";
import type { EventProps } from "react-big-calendar";

// interface IProps extends EventProps<IAppointmentInfo> {
//   appointment: IAppointmentInfo
// }

const AppointmentInfo = ({ event }: EventProps<IAppointmentInfo>) => {
  console.log(event);

  return (
    <>
      <Typography>{event.notes}</Typography>
    </>
  );
};

export default AppointmentInfo;
