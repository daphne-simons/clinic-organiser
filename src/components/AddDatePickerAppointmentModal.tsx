import type { Dispatch, MouseEvent, SetStateAction, ChangeEvent } from "react"
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
  Checkbox,
  Typography,
} from "@mui/material"
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import type { DatePickerAppointmentFormData, ICategory } from "./AppointmentCalendar"

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  datePickerAppointmentFormData: DatePickerAppointmentFormData
  setDatePickerAppointmentFormData: Dispatch<SetStateAction<DatePickerAppointmentFormData>>
  onAddAppointment: (e: MouseEvent<HTMLButtonElement>) => void
  categories: ICategory[]
}

const AddDatePickerAppointmentModal = ({
  open,
  handleClose,
  datePickerAppointmentFormData,
  setDatePickerAppointmentFormData,
  onAddAppointment,
  categories,
}: IProps) => {
  const { description, start, end, allDay } = datePickerAppointmentFormData
  const clients = [ //TODO API
    {
      id: 1,
      label: "Jared Pinfold",
    },
    { id: 2, label: "Daph Simons" },
  ];
  const onClose = () => {
    handleClose()
  }

  // const onChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setDatePickerAppointmentFormData((prevState) => ({
  //     ...prevState,
  //     [e.target.name]: e.target.value,
  //   }))
  // }

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDatePickerAppointmentFormData((prevState) => ({
      ...prevState,
      allDay: e.target.checked,
    }))
  }

  const handleCategoryChange = (e: React.SyntheticEvent, value: ICategory | null) => {
    setDatePickerAppointmentFormData((prevState) => ({
      ...prevState,
      categoryId: value?._id,
    }))
  }

  const isDisabled = () => {
    const checkend = () => {
      if (!allDay && end === null) {
        return true
      }
    }
    if (description === "" || start === null || checkend()) {
      return true
    }
    return false
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add appointment</DialogTitle>
      <DialogContent>
        <DialogContentText>To add a appointment, please fill in the information below.</DialogContentText>
        <Box component="form">
          {/* <TextField
            name="description"
            value={description}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            onChange={onChange}
          /> */}
          <Autocomplete
  disablePortal
  options={clients}
  sx={{ width: 300 }}
  renderInput={(params) => <TextField {...params} label="Client" />}
/>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box mb={2} mt={5}>
              <DateTimePicker
                label="Start date"
                value={start}
                ampm={true}
                minutesStep={30}
                onChange={(newValue) =>
                  setDatePickerAppointmentFormData((prevState) => ({
                    ...prevState,
                    start: new Date(newValue!),
                  }))
                }
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>

            <Box>
              <Typography variant="caption" color="text" component={"span"}>
                All day?
              </Typography>
              <Checkbox onChange={handleCheckboxChange} value={allDay} />
            </Box>

            <DateTimePicker
              label="End date"
              disabled={allDay}
              minDate={start}
              minutesStep={30}
              ampm={true}
              value={allDay ? null : end}
              onChange={(newValue) =>
                setDatePickerAppointmentFormData((prevState) => ({
                  ...prevState,
                  end: new Date(newValue!),
                }))
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Autocomplete
            onChange={handleCategoryChange}
            disablePortal
            id="combo-box-demo"
            options={categories}
            sx={{ marginTop: 4 }}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Category" />}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isDisabled()} color="success" onClick={onAddAppointment}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddDatePickerAppointmentModal