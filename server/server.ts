import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import * as Path from 'node:path'

// routes go here
const server = express()

server.use(express.json())

// give server routes to use!

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server