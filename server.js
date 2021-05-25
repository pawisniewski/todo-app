const express = require('express');
const socket = require('socket.io');

const tasks = [];

const app = express();

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
    console.log('Oh, I\'ve got task ' + task.id + ' from ' + socket.id);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
    console.log('All tasks', tasks);
  });

  socket.on('removeTask', (id) => {
    console.log(socket.id + ' removes task ' + id);
    tasks.splice(tasks.findIndex(task => task.id === id),1);
    socket.broadcast.emit('removeTask', id);
    console.log('All tasks', tasks);
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left')
  });

});
