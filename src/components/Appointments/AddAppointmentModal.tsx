import {
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
  type ChangeEvent,
  useState,
} from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Autocomplete,
  Box,
  Typography,
} from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers"

import type {
  AppointmentFormData,
  IAppointmentInfo,
  ICategory,
} from "../../models"
import { useGetAllClientNames } from "../../hooks/clients"
import { getDefaultEndDate, getDefaultStartDate } from "./utils"
import { useAddAppointment } from "../../hooks/appointments"

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
}

/////////////////////////////////////////////////////////////////////////////
export default function AddAppointmentModal({ open, handleClose }: IProps) {
  const queryClient = useQueryClient()

  const initialAppointmentFormData = {
    clientId: undefined,
    firstName: "", // Changed from undefined
    lastName: "", // Changed from undefined
    appointmentType: "",
    startTime: getDefaultStartDate(), // Use default date instead of null
    endTime: getDefaultEndDate(), // Use default end date
    notes: "",
  }

  // --- STATE ---
  const [appointmentFormData, setAppointmentFormData] =
    useState<AppointmentFormData>(initialAppointmentFormData)
  const [newClient, setNewClient] = useState(false)

  // --- QUERIES & MUTATIONS---
  const categories = queryClient.getQueryData(["categories"])
  const { data: clients } = useGetAllClientNames()
  const addAppointment = useAddAppointment()

  // --- HANDLER FUNCTIONS ---
  function onClose() {
    setNewClient(false)
    handleClose()
  }

  function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
    setAppointmentFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  function handleCategoryChange(
    _e: React.SyntheticEvent,
    value: ICategory | null
  ) {
    setAppointmentFormData((prevState) => ({
      ...prevState,
      appointmentType: value?.title,
    }))
  }

  function handleClientChange(
    _e: React.SyntheticEvent,
    value: { id: number; label: string } | null
  ) {
    setAppointmentFormData((prevState) => ({
      ...prevState,
      client: value?.label ?? "",
      clientId: value?.id ?? undefined,
    }))
  }

  // Handle Date change
  function handleDateChange(newValue: Date | null) {
    setAppointmentFormData((prevState) => ({
      ...prevState,
      // Update both start and end dates to maintain the same date
      startTime: newValue ? new Date(newValue) : undefined,
      endTime:
        newValue && prevState.endTime
          ? new Date(
              newValue.getFullYear(),
              newValue.getMonth(),
              newValue.getDate(),
              prevState.endTime.getHours(),
              prevState.endTime.getMinutes()
            )
          : undefined,
    }))
  }
  // Handle start time change
  function handleStartTimeChange(newValue: Date | null) {
    if (newValue && appointmentFormData.startTime) {
      // Combine the existing date with the new time
      const updatedStart = new Date(appointmentFormData.startTime)
      updatedStart.setHours(newValue.getHours())
      updatedStart.setMinutes(newValue.getMinutes())

      setAppointmentFormData((prevState) => ({
        ...prevState,
        startTime: updatedStart,
      }))
    }
  }

  // Handle end time change
  function handleEndTimeChange(newValue: Date | null) {
    if (newValue && appointmentFormData.startTime) {
      // Combine the existing date with the new time
      const updatedEnd = new Date(appointmentFormData.startTime) // Use start date as base
      updatedEnd.setHours(newValue.getHours())
      updatedEnd.setMinutes(newValue.getMinutes())

      setAppointmentFormData((prevState) => ({
        ...prevState,
        endTime: updatedEnd,
      }))
    }
  }

  function isDisabled() {
    // If creating a new client, check firstName and lastName
    if (newClient) {
      return (
        !appointmentFormData.firstName?.trim() ||
        !appointmentFormData.lastName?.trim() ||
        !appointmentFormData.startTime ||
        !appointmentFormData.endTime
      )
    }
    // If selecting existing client, check clientId
    return (
      !appointmentFormData.clientId ||
      !appointmentFormData.startTime ||
      !appointmentFormData.endTime
    )
  }

  function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    const newAppointment: IAppointmentInfo = {
      ...appointmentFormData,
      clientId: appointmentFormData.clientId,
      startTime: appointmentFormData.startTime,
      endTime: appointmentFormData.endTime,
      notes: appointmentFormData.notes,
    }

    addAppointment.mutate(newAppointment)
    setAppointmentFormData(initialAppointmentFormData)
    setNewClient(false)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h5">Add appointment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a appointment, please fill in the information below.
        </DialogContentText>
        <Box component="form">
          {/* Client Name: */}
          {!newClient && (
            <>
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                Client
              </Typography>
              <Autocomplete
                disablePortal
                options={clients || []}
                sx={{ width: 300, mb: 2, mt: 1 }}
                value={
                  clients?.find(
                    (client) => client.id === appointmentFormData.clientId
                  ) || null
                }
                onChange={handleClientChange}
                renderInput={(params) => (
                  <TextField {...params} label="Enter client name" />
                )}
              />
              <p>
                You can also{" "}
                <span
                  tabIndex={0}
                  onClick={() => setNewClient(true)}
                  role="button"
                >
                  create a new client
                </span>
              </p>
            </>
          )}
          {newClient && (
            <>
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                New Client Details
              </Typography>
              <Box sx={{ mb: 2, mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 0 }} color="primary">
                  First Name
                </Typography>
                <TextField
                  name="firstName"
                  margin="dense"
                  id="firstName"
                  label="First Name"
                  type="text"
                  fullWidth
                  // variant="outlined"
                  value={appointmentFormData.firstName}
                  onChange={handleTextChange}
                />
                <Typography variant="h6" sx={{ mb: 0 }} color="primary">
                  Last Name
                </Typography>
                <TextField
                  name="lastName"
                  margin="dense"
                  id="lastName"
                  label="Last Name"
                  type="text"
                  fullWidth
                  // variant="outlined"
                  value={appointmentFormData.lastName}
                  onChange={handleTextChange}
                />
              </Box>
            </>
          )}
          {/* Date: */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }} color="primary">
                Date
              </Typography>
              <DatePicker
                label="Select date"
                value={appointmentFormData.startTime}
                onChange={handleDateChange}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renderInput={(params: any) => (
                  <TextField {...params} halfWidth />
                )}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ mb: 0 }} color="primary">
                Time
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {/* Start Time */}
              <Box>
                <TimePicker
                  label="Start Time"
                  value={appointmentFormData.startTime}
                  onChange={handleStartTimeChange}
                />
              </Box>
              {/* "to" separator */}
              <Typography variant="h6" sx={{ mt: 3 }}>
                to
              </Typography>
              {/* End Time */}
              <Box>
                <TimePicker
                  label="End Time"
                  value={appointmentFormData.endTime}
                  onChange={handleEndTimeChange}
                />
              </Box>
            </Box>
          </LocalizationProvider>
          {/* Category: */}
          <Box sx={{ mb: 2, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 0 }} color="primary">
              Category
            </Typography>
            <Autocomplete
              onChange={handleCategoryChange}
              disablePortal
              id="combo-box-demo"
              options={categories as ICategory[]}
              sx={{ mt: 1 }}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} label="Select a category" />
              )}
            />
          </Box>
          {/* Notes:  */}
          <Box sx={{ mb: 2, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 0 }} color="primary">
              Notes
            </Typography>
            <TextField
              name="notes"
              margin="dense"
              id="notes"
              label="Optional notes"
              type="text"
              fullWidth
              variant="outlined"
              value={appointmentFormData.notes}
              onChange={handleTextChange}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isDisabled()} color="success" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
