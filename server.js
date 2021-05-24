const express = require('express');
const socket = require('socket.io');
const cors = require('cors');

const tasks = [];

const app = express();
app.use(cors());

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});  

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.emit('updateData', tasks);
  
  socket.on('addTask', (task) => {
    console.log('Oh, I\'ve got task ' + task + ' from ' + socket.id);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (i) => {
    console.log(socket.id + ' removes task ' + i);
    tasks.splice(i,1);
    socket.broadcast.emit('removeTask', i);
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left')
  });
  
});
