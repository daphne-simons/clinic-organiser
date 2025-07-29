// TODO: Create new clients 

// Seed includes these fake names: 
// Ron Zertnert
// Destroy Orbison
// Gertrude Diamond
// Mary Jane


// TODO: Get only name and id from clients:

import express from 'express'
import pool from '../database/config/connection'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, first_name, last_name FROM clients')
    res.status(200).json(result.rows)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id])
    res.status(200).json(result.rows)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


export default router

