import type { Dispatch, MouseEvent, SetStateAction, ChangeEvent } from "react";
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
} from "@mui/material";
// import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  LocalizationProvider,
  DatePicker,
  MultiSectionDigitalClock,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import type { DatePickerAppointmentFormData, ICategory } from "../models";
import { getAllClientNames } from "../apis/clients";
import { useQuery } from "@tanstack/react-query";

interface IProps {
  open: boolean;
  handleClose: Dispatch<SetStateAction<void>>;
  datePickerAppointmentFormData: DatePickerAppointmentFormData;
  setDatePickerAppointmentFormData: Dispatch<
    SetStateAction<DatePickerAppointmentFormData>
  >;
  onAddAppointment: (e: MouseEvent<HTMLButtonElement>) => void;
  categories: ICategory[];
}

/////////////////////////////////////////////////////////////////////////////
export default function AddDatePickerAppointmentModal({
  open,
  handleClose,
  datePickerAppointmentFormData,
  setDatePickerAppointmentFormData,
  onAddAppointment,
  categories,
}: IProps) {
  const { client, start, end, allDay, notes } = datePickerAppointmentFormData;

  const { data: clients } = useQuery({
    queryKey: ["clientNamesForDropdown"],
    queryFn: () => getAllClientNames(),
  });
  function onClose() {
    handleClose();
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setDatePickerAppointmentFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  function handleCategoryChange(
    _e: React.SyntheticEvent,
    value: ICategory | null
  ) {
    setDatePickerAppointmentFormData((prevState) => ({
      ...prevState,
      categoryId: value?._id,
    }));
  }

  // Handle Date change
  function handleDateChange(newValue: Date | null) {
    setDatePickerAppointmentFormData((prevState) => ({
      ...prevState,
      // Update both start and end dates to maintain the same date
      start: newValue ? new Date(newValue) : undefined,
      end:
        newValue && prevState.end
          ? new Date(
              newValue.getFullYear(),
              newValue.getMonth(),
              newValue.getDate(),
              prevState.end.getHours(),
              prevState.end.getMinutes()
            )
          : undefined,
    }));
  }
  // Handle start time change
  function handleStartTimeChange(newValue: Date | null) {
    if (newValue && start) {
      // Combine the existing date with the new time
      const updatedStart = new Date(start);
      updatedStart.setHours(newValue.getHours());
      updatedStart.setMinutes(newValue.getMinutes());

      setDatePickerAppointmentFormData((prevState) => ({
        ...prevState,
        start: updatedStart,
      }));
    }
  }

  // Handle end time change
  function handleEndTimeChange(newValue: Date | null) {
    if (newValue && start) {
      // Combine the existing date with the new time
      const updatedEnd = new Date(start); // Use start date as base
      updatedEnd.setHours(newValue.getHours());
      updatedEnd.setMinutes(newValue.getMinutes());

      setDatePickerAppointmentFormData((prevState) => ({
        ...prevState,
        end: updatedEnd,
      }));
    }
  }

  // STRETCH: handle both start and end time in a single input and handler function
  // const handleTimeChange = (newValue: Date | null) => {
  //   if (newValue) {
  //     setDatePickerAppointmentFormData((prevState) => ({
  //       ...prevState,
  //       start: newValue,
  //       end: newValue,
  //     }))
  //   }
  // }
  function isDisabled() {
    const checkend = () => {
      if (!allDay && end === null) {
        return true;
      }
    };
    if (client === "" || start === null || checkend()) {
      return true;
    }
    return false;
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
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            Client
          </Typography>
          <Autocomplete
            disablePortal
            options={clients || []}
            sx={{ width: 300, mb: 2, mt: 1 }}
            onChange={(_, newValue) =>
              setDatePickerAppointmentFormData((prevState) => ({
                ...prevState,
                client: newValue?.label ?? "", // Default value if newValue is null
              }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Enter client name" />
            )}
          />

          {/* Date: */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }} color="primary">
                Date
              </Typography>
              <DatePicker
                label="Select date"
                value={start}
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
              {/* // STRETCH: handle both start and end time in a single input and handler function */}
              {/* <TimeRangePicker
                value={value}
                onChange={handleTimeChange}
              /> */}
              {/* Start Time */}
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Start Time
                </Typography>
                <MultiSectionDigitalClock
                  value={start}
                  onChange={handleStartTimeChange}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    maxHeight: 50,
                    overflow: "auto",
                  }}
                />
              </Box>

              {/* "to" separator */}
              <Typography variant="h6" sx={{ mt: 3 }}>
                to
              </Typography>

              {/* End Time */}
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  End Time
                </Typography>
                <MultiSectionDigitalClock
                  value={end}
                  onChange={handleEndTimeChange}
                  minTime={start ? dayjs(start).toDate() : undefined}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    maxHeight: 50,
                    overflow: "auto",
                  }}
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
              options={categories}
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
              value={notes}
              margin="dense"
              id="notes"
              label="Optional notes"
              type="text"
              fullWidth
              variant="outlined"
              onChange={onChange}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={isDisabled()}
          color="success"
          onClick={onAddAppointment}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
