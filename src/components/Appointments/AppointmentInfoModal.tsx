import type { SetStateAction, Dispatch } from "react"
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
import type { IAppointmentInfo } from "../../models"
import type { View } from "../Layout"
import { useDeleteAppointment } from "../../hooks/appointments"

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  currentAppointment: IAppointmentInfo | null
  setView: Dispatch<SetStateAction<View>>
}

function AppointmentInfoModal({
  open,
  handleClose,
  currentAppointment,
  setView,
}: IProps) {
  // TODO: Add an update functionality in this

  // --- QUERIES & MUTATIONS---
  const deleteAppointment = useDeleteAppointment()

  // --- HANDLER FUNCTIONS ---
  function handleDelete(id: number) {
    deleteAppointment.mutate(id)
    handleClose()
  }

  return (
    <Dialog open={open}>
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
              mainTab: "clients",
              subTab: "treatments",
              props: {
                text: "hi Daph", //TODO: change to something useful, like the treatment id
              },
            }))
          }
        >
          Go to Appointment
        </Button>
        <Button color="error" onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button
          color="info"
          onClick={() => handleDelete(currentAppointment?.id || -1)}
        >
          Delete Appointment
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AppointmentInfoModal
