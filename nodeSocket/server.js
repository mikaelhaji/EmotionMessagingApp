// const io = require('socket.io')(3000)
// io.set('origins', 'http://127.0.0.1:5500/Realtime-Simple-Chat-App-master');
// const httpServer = require("http").createServer();

const io = require("socket.io")(3000, {
    rejectUnauthorized: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    allowEIO3: true
  });
  
  const users = {}
  
  io.on('connection', socket => {
    socket.on('new-user', name => {
      console.log(name)
      users[socket.id] = name
      socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
      console.log(message)
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
    })
  })
  
  // httpServer.listen(3000);