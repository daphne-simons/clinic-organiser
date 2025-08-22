import express from "express"
const router = express.Router()
import checkJwt from "../auth"

import {
  addClient,
  addClientFromAppointment,
  getAllClientsNames,
  getClientById,
  updateClient,
  deleteClient
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
  let id
  try {
    if (formSource === "appointments") {
      const { firstName, lastName } = req.body
      id = await addClientFromAppointment(firstName, lastName)
    }
    else if (formSource === "clients") {
      const { firstName, lastName, dob, mobile, email, customFields } = req.body
      id = await addClient(firstName, lastName, dob, mobile, email, customFields)
    }
    else {
      throw new Error("Invalid form source")
    }
    console.log('id route', id)
    res.status(201).json(id)
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

router.delete("/:id", checkJwt, async (req, res) => {
  const id = Number(req.params.id)
  try {
    await deleteClient(id)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router
