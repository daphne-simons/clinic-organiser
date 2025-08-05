import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
} from "@mui/material"

import { Calendar } from "react-big-calendar"

import type { Event } from "react-big-calendar"
import type {
  IAppointmentInfo,
  AppointmentFormData,
} from "../models"

import "react-big-calendar/lib/css/react-big-calendar.css"

import AppointmentInfo from "./AppointmentInfo"
import AppointmentInfoModal from "./AppointmentInfoModal"
import { AddCategoryModal } from "./AddCategoryModal"
import AddAppointmentModal from "./AddAppointmentModal"
import { localizer, transformAppointmentsForCalendar } from "../localizer"
import type { View } from "./Layout"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCategories } from "../apis/categories"
import { getAppointments, updateAppointment, deleteAppointment, addAppointment } from "../apis/appointments"
import { fromZonedTime } from "date-fns-tz"

interface Props {
  setView: Dispatch<SetStateAction<View>>
}

export function AppointmentCalendar({ setView }: Props) {
  const [date, setDate] = useState(new Date())
  const initialAppointmentFormData: AppointmentFormData = {
    clientId: undefined,
    categoryId: undefined,
    startTime: undefined,
    endTime: undefined,
    notes: "",
  }

  // States
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false)
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [appointmentInfoModal, setAppointmentInfoModal] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState<
    Event | IAppointmentInfo | null
  >(null)
  // TODO - update for appointments useQuery

  const [appointmentFormData, setAppointmentFormData] =
    useState<AppointmentFormData>(
      initialAppointmentFormData
    )

  // --- QUERIES
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  })

  // useQuery for appointments
  const { data: appointmentsData } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => getAppointments(),
  })

  // Transform appointments with proper timezone handling
  const appointments = useMemo(() => {
    return transformAppointmentsForCalendar(appointmentsData || [])
  }, [appointmentsData])

  // --- MUTATIONS

  const queryClient = useQueryClient()
  const addAppointmentMutation = useMutation({
    mutationFn: addAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    }
  })

  // Form Data
  function handleSelectSlot(appointment: Event) {
    setOpenAppointmentModal(true)
    setCurrentAppointment(appointment)
  }

  function handleSelectAppointment(appointment: IAppointmentInfo) {
    // TODO - update
    setCurrentAppointment(appointment)
    setAppointmentInfoModal(true)
  }

  function handleDatePickerClose() {
    // TODO - update
    setAppointmentFormData(initialAppointmentFormData)
    setOpenAppointmentModal(false)
  }

  // TODO - replace with useMutation
  function onAddAppointmentFromDatePicker(appointment: IAppointmentInfo) {
    console.log('=== STEP BY STEP DEBUG ===')
    console.log('1. Original appointment:', appointment)
    console.log('2. Start time type:', typeof appointment.startTime)
    console.log('3. Start time value:', appointment.startTime)
    console.log('4. Start time toString():', appointment.startTime.toString())
    console.log('5. Start time toISOString():', appointment.startTime.toISOString())

    // Test the conversion function directly
    const testConversion = (date: Date): Date => {
      console.log('--- CONVERSION FUNCTION START ---')
      console.log('Input date:', date)
      console.log('Input toString:', date.toString())
      console.log('Input toISOString:', date.toISOString())

      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()

      console.log(`Extracted: ${year}-${month}-${day} ${hour}:${minute}`)

      const nzISOString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+12:00`
      console.log('Created NZ ISO string:', nzISOString)

      const result = new Date(nzISOString)
      console.log('Result date:', result)
      console.log('Result toString:', result.toString())
      console.log('Result toISOString:', result.toISOString())
      console.log('--- CONVERSION FUNCTION END ---')

      return result
    }

    console.log('6. Testing conversion on start time:')
    const convertedStart = testConversion(appointment.startTime as Date)

    console.log('7. Testing conversion on end time:')
    const convertedEnd = testConversion(appointment.endTime as Date)

    const appointmentUTC = {
      ...appointment,
      startTime: convertedStart,
      endTime: convertedEnd,
    }

    console.log('8. Final appointment object:', appointmentUTC)
    console.log('9. Final start ISO:', appointmentUTC.startTime.toISOString())
    console.log('10. Final end ISO:', appointmentUTC.endTime.toISOString())
    console.log('=== END DEBUG ===')

    // Don't actually mutate yet, just debug
    // addAppointmentMutation.mutate(appointmentUTC)
  }



  console.log({ appointments });
  function onDeleteAppointment() {
    // TODO - replace with useMutation
    // setAppointments(() =>
    //   [...appointments].filter(
    //     (e) => e.id !== (currentAppointment as IAppointmentInfo).id!
    //   )
    // )
    setAppointmentInfoModal(false)
  }

  const onNavigate = useCallback((newDate: Date) => {
    setDate(newDate)
  }, [])

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
                  onClick={() => setOpenAppointmentModal(true)}
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

            <AddAppointmentModal
              open={openAppointmentModal}
              handleClose={handleDatePickerClose}
              appointmentFormData={appointmentFormData}
              setAppointmentFormData={
                setAppointmentFormData
              }
              onAddAppointment={onAddAppointmentFromDatePicker}
              categories={categories || []}
            />
            <AppointmentInfoModal
              open={appointmentInfoModal}
              handleClose={() => setAppointmentInfoModal(false)}
              onDeleteAppointment={onDeleteAppointment}
              currentAppointment={currentAppointment as IAppointmentInfo}
              setView={setView}
            />
            <AddCategoryModal
              open={openCategoryModal}
              handleClose={() => setOpenCategoryModal(false)}
              categories={categories || []}
            />
            <Calendar
              date={date}
              onNavigate={onNavigate}
              localizer={localizer}
              events={appointments}
              onSelectEvent={handleSelectAppointment}
              onSelectSlot={handleSelectSlot}
              selectable
              startAccessor="startTime"
              endAccessor="endTime"
              components={{ event: AppointmentInfo }}
              defaultView="week"
              views={["week"]}
              eventPropGetter={(appointment) => {
                const hasCategory = categories?.find(
                  (category) => category._id === appointment.categoryId
                )
                return {
                  style: {
                    backgroundColor: hasCategory
                      ? hasCategory.color
                      : "#b64fc8",
                    borderColor: hasCategory ? hasCategory.color : "#b64fc8",
                  },
                }
              }}
              style={{
                height: 900,
              }}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
