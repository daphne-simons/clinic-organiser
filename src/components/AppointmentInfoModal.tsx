import type { SetStateAction, MouseEvent, Dispatch } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography,
} from "@mui/material";
import type { IAppointmentInfo } from "../models";

interface IProps {
  open: boolean;
  handleClose: Dispatch<SetStateAction<void>>;
  onDeleteAppointment: (e: MouseEvent<HTMLButtonElement>) => void;
  currentAppointment: IAppointmentInfo | null;
}

function AppointmentInfoModal({
  open,
  handleClose,
  onDeleteAppointment,
  currentAppointment,
}: IProps) {
  // TODO: Add an update functionality in this
  function onClose() {
    handleClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Appointment Info</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography
            sx={{ fontSize: 14, marginTop: 3 }}
            color="text.secondary"
            gutterBottom
          >
            {currentAppointment?.description}
          </Typography>
        </DialogContentText>
        <Box component="form"></Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button color="info" onClick={onDeleteAppointment}>
          Delete Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AppointmentInfoModal;
