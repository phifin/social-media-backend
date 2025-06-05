// index.js
import app from './src/app.js'
import databaseService from './src/services/database.services.js'
import app from './src/app.js'
import http from 'http'
import { Server } from 'socket.io'
import chatSocket from './src/Sockets/chatSocket.js'
import { config } from 'dotenv'

config()

const PORT = process.env.PORT || 3000

databaseService.connect()

app.listen(PORT, () => {
  console.log('hello world~~ !')
  console.log(`Server is listening on port ${PORT}`)
})
const PORT = process.env.PORT || 3000

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

chatSocket(io)

server.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`)
})
