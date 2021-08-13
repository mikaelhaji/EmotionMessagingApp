const path = require('path')
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app);

const io = require("socket.io")(server, {
    rejectUnauthorized: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    allowEIO3: true
  });
  
// app.set("views", "./views")
console.log(path.join(__dirname, 'emotidetection'))
app.use(express.static('emotidetection'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('roomselection', { rooms: rooms })
})

// app.post('/room', (req, res) => {
//   if (rooms[req.body.room] != null) {
//     return res.redirect('/')
//   }
//   rooms[req.body.room] = { users: {} }
//   res.redirect(req.body.room)
//   // Send message that new room was created
//   io.emit('room-created', req.body.room)
// })

app.get('/:room', (req, res) => {
  // if (rooms[req.params.room] == null) {
  //   return res.redirect('/')
  // }
  res.render('index', { roomName: req.params.room })
})

server.listen(3000)
  
const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    // console.log(name)
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', (data) => {
    console.log(data)
    socket.broadcast.emit('chat-message', { message: data.message, name: users[socket.id], color: data.color})
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

  // httpServer.listen(3000);