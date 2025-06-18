import { storageService } from '../services/storage.js';
import { EventEmitter } from '../utils/EventEmitter.js';

export class TaskManager extends EventEmitter {
  constructor() {
    super();
    this.tasks = storageService.getTasks();
    console.debug('TaskManager initialized with tasks:', this.tasks);
  }

  getTasks() {
    console.debug('Getting all tasks:', this.tasks);
    return this.tasks;
  }

  getTaskById(id) {
    const task = this.tasks.find(task => task.id === id);
    console.debug('Getting task by id:', id, 'Result:', task);
    return task;
  }

  addTask(taskData) {
    const newTask = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
      ...taskData
    };
    
    console.debug('Adding new task:', newTask);
    this.tasks.push(newTask);
    this.save();
    return newTask;
  }

  updateTask(id, updates) {
    console.debug('updateTask called with id:', id, 'updates:', updates);
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    console.debug('Found task at index:', taskIndex);
    
    if (taskIndex === -1) {
      console.warn('Task not found for update:', id);
      return null;
    }
    
    const oldTask = this.tasks[taskIndex];
    this.tasks[taskIndex] = { ...oldTask, ...updates };
    console.debug('Task updated:', {
      before: oldTask,
      after: this.tasks[taskIndex]
    });
    
    this.save();
    return this.tasks[taskIndex];
  }

  deleteTask(id) {
    console.debug('Deleting task:', id);
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    
    if (this.tasks.length !== initialLength) {
      this.save();
      return true;
    }
    console.warn('Task not found for deletion:', id);
    return false;
  }

  toggleTaskCompletion(id) {
    console.debug('toggleTaskCompletion called with id:', id);
    const task = this.getTaskById(id);
    console.debug('Found task:', task);
    
    if (!task) {
      console.warn('Task not found for toggle:', id);
      return null;
    }
    
    const newCompletedState = !task.completed;
    console.debug('Toggling completion from', task.completed, 'to', newCompletedState);
    return this.updateTask(id, { completed: newCompletedState });
  }

  filterTasks(filters) {
    console.debug('Filtering tasks with:', filters);
    return this.tasks.filter(task => {
      if (filters.searchTerm && !task.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      if (filters.priority !== null && task.priority !== filters.priority) {
        return false;
      }
      
      if (filters.completed !== null && task.completed !== filters.completed) {
        return false;
      }
      
      return true;
    });
  }

  save() {
    console.debug('Saving tasks:', this.tasks);
    storageService.saveTasks(this.tasks);
    this.emit('tasksChanged', this.tasks);
  }
}

export const taskManager = new TaskManager();