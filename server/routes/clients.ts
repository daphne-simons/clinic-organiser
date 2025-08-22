import express from "express"
const router = express.Router()
import checkJwt from "../auth"

import {
  addClient,
  addClientFromAppointment,
  getAllClientsNames,
  getClientById,
  updateClient
} from "../database/dbFunctions/clients"

router.get("/", checkJwt, async (req, res) => {
  try {
    const result = await getAllClientsNames()
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/:id", checkJwt, async (req, res) => {
  try {
    const { id } = req.params
    const result = await getClientById(id)
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.post("/", checkJwt, async (req, res) => {
  const { formSource } = req.body
  try {
    if (formSource === "appointments") {
      const { firstName, lastName } = req.body
      await addClientFromAppointment(firstName, lastName)
    }
    if (formSource === "clients") {
      const { firstName, lastName, dob, mobile, email, customFields } = req.body
      await addClient(firstName, lastName, dob, mobile, email, customFields)
    }

    res.sendStatus(201)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.patch("/:id", checkJwt, async (req, res) => {
  const id = Number(req.params.id)
  const { firstName, lastName, dob, mobile, email, customFields } = req.body
  try {
    await updateClient(id, firstName, lastName, dob, mobile, email, customFields)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router
