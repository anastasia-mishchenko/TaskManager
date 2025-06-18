import { taskManager } from '../models/TaskManager.js';
import { TaskFilters } from '../components/taskFilters.js';
import { TaskModal } from '../components/taskModal.js';
import { TaskRenderer } from '../components/taskRenderer.js';
import { TaskActions } from '../components/taskActions.js';

export class TaskView {
  constructor() {
    this.taskList = document.getElementById('task-list');
    this.emptyState = document.getElementById('empty-state');
    this.taskCount = document.getElementById('task-count');

    if (!this.taskList || !this.taskCount) return;

    this.filters = new TaskFilters();
    this.renderer = new TaskRenderer(this.taskList, this.emptyState);
    this.modal = new TaskModal();
    this.actions = new TaskActions(this.modal, document.getElementById('confirm-modal'));

    this.init();
    this.renderTasks();

    // Listen for task changes
    taskManager.on('tasksChanged', (tasks) => {
      console.debug('TaskView: tasksChanged event received', tasks);
      this.renderTasks();
    });
  }

  init() {
    document.getElementById('new-task-btn')?.addEventListener('click', () => this.modal.open());

    const searchInput = document.getElementById('search-input');
    searchInput?.addEventListener('input', (e) => {
      this.filters.updateSearchTerm(e.target.value);
      this.updateClearButtons();
      this.renderTasks();
    });

    document.getElementById('clear-search-btn')?.addEventListener('click', () => {
      searchInput.value = '';
      this.filters.updateSearchTerm('');
      this.updateClearButtons();
      this.renderTasks();
    });

    document.querySelectorAll('[data-priority]').forEach(button => {
      button.addEventListener('click', () => {
        const priority = button.dataset.priority;
        
        if (this.filters.activeFilters.priority === priority) {
          this.filters.updatePriority(null);
          button.classList.remove('active');
        } else {
          document.querySelectorAll('[data-priority]').forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          this.filters.updatePriority(priority);
        }
        
        this.updateClearButtons();
        this.renderTasks();
      });
    });

    document.querySelectorAll('[data-completed]').forEach(button => {
      button.addEventListener('click', () => {
        const completed = button.dataset.completed === 'true';
        
        if (this.filters.activeFilters.completed === completed) {
          this.filters.updateCompleted(null);
          button.classList.remove('active');
        } else {
          document.querySelectorAll('[data-completed]').forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          this.filters.updateCompleted(completed);
        }
        
        this.updateClearButtons();
        this.renderTasks();
      });
    });

    document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
      this.clearAllFilters();
    });

    this.taskList?.addEventListener('click', (e) => {
      const taskElement = e.target.closest('[data-id]');
      if (!taskElement) return;
      
      const taskId = taskElement.dataset.id;
      console.debug('TaskView: Click event on task element:', taskId);
      
      if (e.target.closest('.task-action-btn.edit')) {
        this.actions.editTask(taskId);
      } else if (e.target.closest('.task-action-btn.delete')) {
        this.actions.confirmDeleteTask(taskId);
      }
    });
  }

  renderTasks() {
    console.debug('TaskView: Rendering tasks');
    const filteredTasks = this.filters.getFilteredTasks();
    console.debug('TaskView: Filtered tasks:', filteredTasks);
    this.taskCount.textContent = filteredTasks.length.toString();
    this.renderer.renderTasks(filteredTasks);
  }

  updateClearButtons() {
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    
    if (clearFiltersBtn) {
      clearFiltersBtn.classList.toggle('hidden', !this.filters.hasActiveFilters());
    }
    
    if (clearSearchBtn) {
      clearSearchBtn.classList.toggle('hidden', !this.filters.activeFilters.searchTerm);
    }
  }

  clearAllFilters() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    this.filters.updateSearchTerm('');

    document.querySelectorAll('[data-priority], [data-completed]').forEach(btn => {
      btn.classList.remove('active');
    });
    this.filters.updatePriority(null);
    this.filters.updateCompleted(null);

    this.updateClearButtons();
    this.renderTasks();
  }
}