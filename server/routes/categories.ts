import express from 'express'
import pool from '../database/config/connection'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id AS _id, title, color FROM categories')
    res.status(200).json(result.rows)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/', async (req, res) => {
  const {title, color} = req.body
  try {
    await pool.query('INSERT INTO categories (title, color) VALUES ($1, $2)', [title, color])
    res.sendStatus(201)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.delete('/:id', async (req, res) => {
  const {id} = req.params
  try {
    await pool.query('DELETE FROM categories WHERE id = ($1)', [id])
    res.sendStatus(204)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


export default router

