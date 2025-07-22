import server from './server.ts'

const PORT = process.env.PORT || 3000
const db = process.env.DATABASE_URL

server.listen(PORT, () => {
  console.log('server db url:', db)
  console.log('Server listening on port', PORT)
})