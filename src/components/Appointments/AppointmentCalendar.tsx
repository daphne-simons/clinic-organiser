import { useAuth0 } from "@auth0/auth0-react"

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
import type { IAppointmentInfo, AppointmentFormData } from "../../models"

import "react-big-calendar/lib/css/react-big-calendar.css"

import AppointmentInfo from "./AppointmentInfo"
import AppointmentInfoModal from "./AppointmentInfoModal"
import { AddCategoryModal } from "./AddCategoryModal"
import AddAppointmentModal from "./AddAppointmentModal"
// import { localizer, transformAppointmentsForCalendar } from "../localizer"
import type { View } from "../Layout"
import { localizer } from "../../localizer"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCategories } from "../../apis/categories"
import { getAppointments, addAppointment } from "../../apis/appointments"

interface Props {
  setView: Dispatch<SetStateAction<View>>
}
/////////////////////////////////////////////////////////////////////////////
export function AppointmentCalendar({ setView }: Props) {
  const { getAccessTokenSilently } = useAuth0()
  const initialAppointmentFormData: AppointmentFormData = {
    clientId: undefined,
    categoryId: undefined,
    startTime: undefined,
    endTime: undefined,
    notes: "",
  }

  // --- STATES ---
  const [date, setDate] = useState(new Date())
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false)
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [appointmentInfoModal, setAppointmentInfoModal] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState<
    Event | IAppointmentInfo | null
  >(null)

  const [appointmentFormData, setAppointmentFormData] =
    useState<AppointmentFormData>(initialAppointmentFormData)

  // --- QUERIES ---

  // Categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      return getCategories(accessToken)
    },
  })

  // Appointments
  const { data: appointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      return getAppointments(accessToken)
    },
  })

  // --- MUTATIONS ---

  const queryClient = useQueryClient()
  const addAppointmentMutation = useMutation({
    mutationFn: async (form: IAppointmentInfo) => {
      const accessToken = await getAccessTokenSilently()
      return addAppointment(form, accessToken)
    }, //addAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    },
  })

  // TODO: update appointment mutation

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
    setAppointmentFormData(initialAppointmentFormData)
    setOpenAppointmentModal(false)
  }

  function onAddAppointmentFromDatePicker(appointment: IAppointmentInfo) {
    addAppointmentMutation.mutate(appointment)
  }

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
              setAppointmentFormData={setAppointmentFormData}
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
