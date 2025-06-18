import { taskManager } from '../models/TaskManager.js';

export class TaskModal {
  constructor() {
    this.modal = document.getElementById('task-modal');
    this.form = document.getElementById('task-form');
    this.editingTaskId = null;
    this.init();
  }

  init() {
    const newForm = this.form.cloneNode(true);
    this.form.parentNode.replaceChild(newForm, this.form);
    this.form = newForm;

    this.form?.addEventListener('submit', (e) => {
      console.debug('Form submit event triggered');
      e.preventDefault();
      this.handleSubmit();
    });

    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-task-btn');
    
    if (closeBtn) {
      closeBtn.removeEventListener('click', this.close);
      closeBtn.addEventListener('click', () => this.close());
    }
    
    if (cancelBtn) {
      cancelBtn.removeEventListener('click', this.close);
      cancelBtn.addEventListener('click', () => this.close());
    }
  }

  open(taskId = null) {
    console.debug('Opening modal with taskId:', taskId);
    this.editingTaskId = taskId;
    this.modal?.classList.add('modal--visible');
    
    if (taskId) {
      const task = taskManager.getTaskById(taskId);
      console.debug('Editing existing task:', task);
      if (task) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-priority').value = task.priority || 'medium';
        document.getElementById('task-due-date').value = task.dueDate || '';
        document.getElementById('title-error').textContent = '';
      }
    } else {
      console.debug('Creating new task');
      this.form?.reset();
      document.getElementById('title-error').textContent = '';
    }
  }

  close() {
    console.debug('Closing modal');
    this.modal?.classList.remove('modal--visible');
    this.editingTaskId = null;
  }

  handleSubmit() {
    console.debug('Handling form submit');
    const title = document.getElementById('task-title').value.trim();
    
    if (!title) {
      console.warn('Form submission failed: title is empty');
      document.getElementById('title-error').textContent = 'Title is required';
      return;
    }

    const taskData = {
      title: title,
      description: document.getElementById('task-description').value.trim(),
      priority: document.getElementById('task-priority').value,
      dueDate: document.getElementById('task-due-date').value || null
    };

    console.debug('Submitting task data:', taskData);

    if (this.editingTaskId) {
      console.debug('Updating existing task:', this.editingTaskId);
      taskManager.updateTask(this.editingTaskId, taskData);
    } else {
      console.debug('Creating new task');
      taskManager.addTask(taskData);
    }

    this.close();
  }
}