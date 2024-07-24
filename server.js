const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', socket => {
  console.log('A user connected', socket.id);
socket.emit('client-id', socket.id);
  socket.on('offer', (data) => {
    socket.to(data.to).emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.to(data.to).emit('answer', data);
  });

  socket.on('candidate', (data) => {
    socket.to(data.to).emit('candidate', data);
  });

  socket.on('join', room => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Signaling server is running on port 5000');
});
