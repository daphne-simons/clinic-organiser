import {
  useCallback,
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
import type { IAppointmentInfo } from "../../models"

import "react-big-calendar/lib/css/react-big-calendar.css"

import AppointmentInfo from "./AppointmentInfo"
import AppointmentInfoModal from "./AppointmentInfoModal"
import AddCategoryModal from "./AddCategoryModal"
import AddAppointmentModal from "./AddAppointmentModal"
import type { View } from "../Layout"
import { localizer } from "../../localizer"
import { useGetAppointments } from "../../hooks/appointments"
import { useGetCategories } from "../../hooks/categories"

interface Props {
  setView: Dispatch<SetStateAction<View>>
}

/////////////////////////////////////////////////////////////////////////////
export function AppointmentCalendar({ setView }: Props) {
  // --- STATES ---
  const [date, setDate] = useState(new Date())
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false)
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [appointmentInfoModal, setAppointmentInfoModal] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState<
    Event | IAppointmentInfo | null
  >(null)

  // --- QUERIES ---

  const { data: categories } = useGetCategories()
  const { data: appointments } = useGetAppointments()

  // --- HANDLER FUNCTIONS ---
  function handleSelectSlot(appointment: Event) {
    setOpenAppointmentModal(true)
    setCurrentAppointment(appointment)
  }

  function handleSelectAppointment(appointment: IAppointmentInfo) {
    setCurrentAppointment(appointment)
    setAppointmentInfoModal(true)
  }

  function handleDatePickerClose() {
    setOpenAppointmentModal(false)
  }

  function onDeleteAppointment() {
    // TODO - replace with useMutation
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
