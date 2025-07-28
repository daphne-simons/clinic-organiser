import type { SetStateAction, MouseEvent, Dispatch } from "react"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography,
} from "@mui/material"
import type { IAppointmentInfo } from "../models"
import type { View } from "./Layout"

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  onDeleteAppointment: (e: MouseEvent<HTMLButtonElement>) => void
  currentAppointment: IAppointmentInfo | null
  setView: Dispatch<SetStateAction<View>>
}

function AppointmentInfoModal({
  open,
  handleClose,
  onDeleteAppointment,
  currentAppointment,
  setView,
}: IProps) {
  // TODO: Add an update functionality in this
  function onClose() {
    handleClose()
  }
  console.log("ca:", setView)
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Appointment Info</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography
            sx={{ fontSize: 14, marginTop: 3 }}
            color="text.secondary"
            gutterBottom
          ></Typography>
        </DialogContentText>
        <Box component="form"></Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() =>
            setView(() => ({
              component: "clients",
              props: {
                innerComponent: "Appointments",
                text: "hi Daph",
              },
            }))
          }
        >
          Go to Appointment
        </Button>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button color="info" onClick={onDeleteAppointment}>
          Delete Appointment
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AppointmentInfoModal
