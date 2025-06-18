import { taskManager } from '../models/TaskManager.js';

export class TaskActions {
  constructor(taskModal, confirmDialog) {
    this.taskModal = taskModal;
    this.confirmDialog = confirmDialog;
    this.taskToDeleteId = null;
    this.init();
  }

  init() {
    // Confirm dialog events
    document.getElementById('close-confirm-btn')?.addEventListener('click', () => this.closeConfirmDialog());
    document.getElementById('cancel-delete-btn')?.addEventListener('click', () => this.closeConfirmDialog());
    document.getElementById('confirm-delete-btn')?.addEventListener('click', () => {
      if (this.taskToDeleteId) {
        this.deleteTask(this.taskToDeleteId);
        this.closeConfirmDialog();
      }
    });
  }

  toggleTaskCompletion(taskId) {
    console.debug('TaskActions: Toggling task completion for id:', taskId);
    const result = taskManager.toggleTaskCompletion(taskId);
    console.debug('TaskActions: Toggle result:', result);
    return result;
  }

  editTask(taskId) {
    this.taskModal.open(taskId);
  }

  confirmDeleteTask(taskId) {
    this.taskToDeleteId = taskId;
    this.confirmDialog?.classList.add('modal--visible');
  }

  deleteTask(taskId) {
    taskManager.deleteTask(taskId);
  }

  closeConfirmDialog() {
    this.confirmDialog?.classList.remove('modal--visible');
    this.taskToDeleteId = null;
  }
}