import { useCallback, useState } from "react";
import type { MouseEvent } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
} from "@mui/material";

import { Calendar } from "react-big-calendar";

import type { Event } from "react-big-calendar";
import type {
  ICategory,
  IAppointmentInfo,
  DatePickerAppointmentFormData,
} from "../models";

import "react-big-calendar/lib/css/react-big-calendar.css";

import AppointmentInfo from "./AppointmentInfo";
import AppointmentInfoModal from "./AppointmentInfoModal";
import { AddCategoryModal } from "./AddCategoryModal";
import AddDatePickerAppointmentModal from "./AddDatePickerAppointmentModal";
import { generateId } from "../utils";
import { localizer } from "../localizer";

export function AppointmentCalendar() {
  const [date, setDate] = useState(new Date());
  const initialDatePickerAppointmentFormData: DatePickerAppointmentFormData = {
    client: "",
    categoryId: undefined,
    allDay: false,
    start: undefined,
    end: undefined,
    notes: "",
  };

  const categoriesTemp = [
    //TODO API
    {
      _id: "1",
      title: "ACC",
      color: "blue",
    },
    {
      _id: "2",
      title: "Private",
      color: "green",
    },
  ];
  // States
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [appointmentInfoModal, setAppointmentInfoModal] = useState(false);

  const [currentAppointment, setCurrentAppointment] = useState<
    Event | IAppointmentInfo | null
  >(null);
  const [datePickerAppointmentFormData, setDatePickerAppointmentFormData] =
    useState<DatePickerAppointmentFormData>(
      initialDatePickerAppointmentFormData
    );
  const [appointments, setAppointments] = useState<IAppointmentInfo[]>([]);
  const [categories, setCategories] = useState<ICategory[]>(categoriesTemp);

  // Form Data

  function handleSelectSlot(appointment: Event) {
    setOpenDatepickerModal(true);
    setCurrentAppointment(appointment);
  }

  function handleSelectAppointment(appointment: IAppointmentInfo) {
    setCurrentAppointment(appointment);
    setAppointmentInfoModal(true);
  }

  function handleDatePickerClose() {
    setDatePickerAppointmentFormData(initialDatePickerAppointmentFormData);
    setOpenDatepickerModal(false);
  }

  function onAddAppointmentFromDatePicker(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const addHours = (date: Date | undefined, hours: number) => {
      return date ? date.setHours(date.getHours() + hours) : undefined;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setMinToZero = (date: any) => {
      date.setSeconds(0);

      return date;
    };

    const data: IAppointmentInfo = {
      ...datePickerAppointmentFormData,
      _id: generateId(),
      start: setMinToZero(datePickerAppointmentFormData.start),
      end: datePickerAppointmentFormData.allDay
        ? addHours(datePickerAppointmentFormData.start, 12)
        : setMinToZero(datePickerAppointmentFormData.end),
      notes: datePickerAppointmentFormData.notes,
    };

    const newAppointments = [...appointments, data];

    setAppointments(newAppointments);
    setDatePickerAppointmentFormData(initialDatePickerAppointmentFormData);
  }

  function onDeleteAppointment() {
    setAppointments(() =>
      [...appointments].filter(
        (e) => e._id !== (currentAppointment as IAppointmentInfo)._id!
      )
    );
    setAppointmentInfoModal(false);
  }

  const onNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  return (
    <Box
      mt={2}
      mb={2}
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <Card>
          <CardHeader title="Appointments" subheader="" />
          <Divider />
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <ButtonGroup
                size="large"
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button
                  onClick={() => setOpenDatepickerModal(true)}
                  size="small"
                  variant="contained"
                >
                  Add appointment
                </Button>
                <Button
                  onClick={() => setOpenCategoryModal(true)}
                  size="small"
                  variant="contained"
                >
                  Create category
                </Button>
              </ButtonGroup>
            </Box>
            <Divider style={{ margin: 10 }} />

            <AddDatePickerAppointmentModal
              open={openDatepickerModal}
              handleClose={handleDatePickerClose}
              datePickerAppointmentFormData={datePickerAppointmentFormData}
              setDatePickerAppointmentFormData={
                setDatePickerAppointmentFormData
              }
              onAddAppointment={onAddAppointmentFromDatePicker}
              categories={categories}
            />
            <AppointmentInfoModal
              open={appointmentInfoModal}
              handleClose={() => setAppointmentInfoModal(false)}
              onDeleteAppointment={onDeleteAppointment}
              currentAppointment={currentAppointment as IAppointmentInfo}
            />
            <AddCategoryModal
              open={openCategoryModal}
              handleClose={() => setOpenCategoryModal(false)}
              categories={categories}
              setCategories={setCategories}
            />
            <Calendar
              date={date}
              onNavigate={onNavigate}
              localizer={localizer}
              events={appointments}
              onSelectEvent={handleSelectAppointment}
              onSelectSlot={handleSelectSlot}
              selectable
              startAccessor="start"
              components={{ event: AppointmentInfo }}
              endAccessor="end"
              defaultView="week"
              views={["week"]}
              eventPropGetter={(appointment) => {
                const hasCategory = categories.find(
                  (category) => category._id === appointment.categoryId
                );
                return {
                  style: {
                    backgroundColor: hasCategory
                      ? hasCategory.color
                      : "#b64fc8",
                    borderColor: hasCategory ? hasCategory.color : "#b64fc8",
                  },
                };
              }}
              style={{
                height: 900,
              }}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
