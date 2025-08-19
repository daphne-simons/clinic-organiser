import express from "express"
const router = express.Router()

import {
  getAllCategories,
  addCategory,
  deleteCategory,
} from "../database/dbFunctions/categories"

router.get("/", async (req, res) => {
  try {
    const result = await getAllCategories()
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.post("/", async (req, res) => {
  const { title, color } = req.body
  try {
    await addCategory(title, color)
    res.sendStatus(201)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.delete("/:id", async (req, res) => {
  const id = Number(req.params)
  try {
    await deleteCategory(id)
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router
