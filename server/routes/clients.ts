import express from "express"
const router = express.Router()

import {
  getAllClientsNames,
  getClientById,
} from "../database/dbFunctions/clients"

router.get("/", async (req, res) => {
  try {
    const result = await getAllClientsNames()
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const result = await getClientById(id)
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router
