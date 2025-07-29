import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import * as Path from 'node:path'
import clientsRoutes from './routes/clients'

// routes go here
const server = express()

server.use(express.json())

// connect to routes clients file" 
server.use('/api/v1/clients', clientsRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server