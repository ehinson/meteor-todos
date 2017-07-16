import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false
    };
  }
  getTasks = () => {
    return [{ _id: 1, text: 'This is task 1' }, { _id: 2, text: 'This is task 2' }, { _id: 3, text: 'This is task 3' }];
  };

  renderTasks = () => {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map(task => <Task key={task._id} task={task} />);
  };
  handleSubmit = e => {
    e.preventDefault();
    const text = ReactDOM.findDOMNode(this.textInput).value.trim();

    Tasks.insert({
      text,
      createdAt: new Date() // current time
    });

    // Clear form
    ReactDOM.findDOMNode(this.textInput).value = '';
  };
  toggleHideCompleted = () => {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    });
  };

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted} />
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper />

          <form className="new-task" onSubmit={this.handleSubmit}>
            <input
              type="text"
              ref={input => {
                this.textInput = input;
              }}
              placeholder="Type to add new tasks"
            />
          </form>
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count()
  };
}, App);
