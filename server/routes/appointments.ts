import express from "express"
const router = express.Router()
import checkJwt from "../auth"

import {
  getAllAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../database/dbFunctions/appointments"

// GET `api/v1/appointments/`
router.get("/", checkJwt, async (req, res) => {
  try {
    const result = await getAllAppointments()
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// POST `api/v1/appointments/`
router.post("/", checkJwt, async (req, res) => {
  const { clientId, startTime, endTime, appointmentType, notes } = req.body

  // Convert timestamp to UTC before storing in database
  const startTimeUTC = new Date(startTime).toISOString()
  const endTimeUTC = new Date(endTime).toISOString()

  try {
    await addAppointment(
      clientId,
      startTimeUTC,
      endTimeUTC,
      appointmentType,
      notes
    )
    res.sendStatus(201)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// PATCH `api/v1/appointments/4`
router.patch("/:id", checkJwt, async (req, res) => {
  const id = Number(req.params.id)
  const { clientId, startTime, endTime, appointmentType, notes } = req.body

  // Convert timestamp to UTC before storing in database
  const startTimeUTC = new Date(startTime).toISOString()
  const endTimeUTC = new Date(endTime).toISOString()

  try {
    await updateAppointment(
      clientId,
      startTimeUTC,
      endTimeUTC,
      appointmentType,
      notes,
      id
    )
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// DELETE `api/v1/appointments/4`
router.delete("/:id", checkJwt, async (req, res) => {
  const id = Number(req.params.id)
  try {
    await deleteAppointment(id)
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router
