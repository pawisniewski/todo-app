import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() { 
    this.socket = io('ws://localhost:8000', { transports: ["websocket"] });
    this.socket.on('updateData', (data) => this.updateTasks(data));
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (id) => this.removeTask(id));
  };

  updateTasks = (newTasks) => {
    this.setState({tasks: newTasks});
  };

  addTask = (task) => {
    this.setState({
      tasks: [...this.state.tasks, task],
    });
  };

  removeTask = (id, localRemove = false) => {
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== id),
    });
    if (localRemove) {
      this.socket.emit('removeTask', id);
    };
  };

  submitForm = (event) => {
    event.preventDefault();
    
    if (this.state.taskName) {
      const id = uuidv4(); 
      const newTask = {id, name: this.state.taskName};
      this.addTask(newTask);
      this.socket.emit('addTask', newTask);
      this.setState({taskName: ''});
    }
  };

  render() {
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(({ id, name }) => (
              <li key={id} className="task">
                {name}
                <button onClick={() => this.removeTask(id, true)} className="btn btn--red">
                  Remove
                </button>
              </li>))}
          </ul>
    
          <form id="add-task-form" onSubmit={event => this.submitForm(event)}>
            <input 
              className="text-input" 
              autoComplete="off" 
              type="text" 
              placeholder="Type your description" 
              id="task-name" 
              value={this.state.taskName}
              onChange={event => this.setState({ taskName: event.target.value })}
            />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;
