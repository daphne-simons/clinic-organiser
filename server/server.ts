import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import * as Path from 'node:path'
import cors from 'cors' // Import the cors middleware
import clientsRoutes from './routes/clients'
import categoriesRoutes from './routes/categories'
import appointmentsRoutes from './routes/appointments'

const server = express()

server.use(express.json())

server.use(cors({
  origin: 'http://localhost:5173' // Allow requests from your Vite development server
}))
// connect to routes clients file" 
server.use('/api/v1/clients', clientsRoutes)
server.use('/api/v1/categories', categoriesRoutes)
server.use('/api/v1/appointments', appointmentsRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server