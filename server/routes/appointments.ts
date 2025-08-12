import express from 'express'
import pool from '../database/config/connection'
const router = express.Router()

// GET `api/v1/appointments/`
router.get('/', async (req, res) => {
  try {
    // NOTE: postgreSQL automatically lowercases aliases, so to retain camelCase, double quotes are used. 
    const result = await pool.query('SELECT id, client_id AS "clientId", start_time AS "startTime", end_time AS "endTime", appointment_type AS "appointmentType", notes FROM appointments')
    res.status(200).json(result.rows)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// POST `api/v1/appointments/`
router.post('/', async (req, res) => {
  const { clientId, startTime, endTime, appointmentType, notes } = req.body

  // Convert timestamp to UTC before storing in database
  const startTimeUTC = new Date(startTime).toISOString();
  const endTimeUTC = new Date(endTime).toISOString();

  try {
    await pool.query('INSERT INTO appointments (client_id, start_time, end_time, appointment_type, notes) VALUES ($1, $2, $3, $4, $5)', [clientId, startTimeUTC, endTimeUTC, appointmentType, notes])

    res.sendStatus(201)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// PATCH `api/v1/appointments/4` 
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { clientId, startTime, endTime, appointmentType, notes } = req.body

  // Convert timestamp to UTC before storing in database
  const startTimeUTC = new Date(startTime).toISOString();
  const endTimeUTC = new Date(endTime).toISOString();

  try {
    await pool.query('UPDATE appointments SET client_id = $1, start_time = $2, end_time = $3, appointment_type = $4, notes = $5 WHERE id = $6', [clientId, startTimeUTC, endTimeUTC, appointmentType, notes, id])
    res.sendStatus(204)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// DELETE `api/v1/appointments/4`
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM appointments WHERE id = ($1)', [id])
    res.sendStatus(204)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


export default router

