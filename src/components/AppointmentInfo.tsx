import { Typography } from "@mui/material";
import type { IAppointmentInfo } from "../models";
import type { EventProps } from "react-big-calendar";

// interface IProps extends EventProps<IAppointmentInfo> {
//   appointment: IAppointmentInfo
// }

const AppointmentInfo = ({ event }: EventProps<IAppointmentInfo>) => {

  return (
    <>
      {/* TODO: replace with client name once got db join */}
      <Typography>{event.clientId}</Typography>
      <Typography>{event.notes}</Typography>

    </>
  );
};

export default AppointmentInfo;
