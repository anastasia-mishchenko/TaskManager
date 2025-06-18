import { formatDate, isDueSoon, isOverdue } from '../utils/dateUtils.js';
import { taskManager } from '../models/TaskManager.js';

export class TaskRenderer {
  constructor(taskList, emptyState) {
    this.taskList = taskList;
    this.emptyState = emptyState;
  }

  renderTasks(tasks) {
    const taskItems = this.taskList?.querySelectorAll('.task-item');
    taskItems?.forEach(item => item.remove());

    if (tasks.length === 0) {
      this.emptyState?.classList.remove('hidden');
      return;
    }

    this.emptyState?.classList.add('hidden');

    const sortedTasks = this.sortTasks(tasks);
    sortedTasks.forEach(task => {
      const taskElement = this.createTaskElement(task);
      this.taskList?.appendChild(taskElement);
      
      // Add checkbox event listener
      const checkbox = taskElement.querySelector('.task-checkbox');
      if (checkbox) {
        checkbox.addEventListener('click', () => {
          console.debug('Checkbox clicked for task:', task.id);
          taskManager.toggleTaskCompletion(task.id);
        });
      }
    });
  }

  sortTasks(tasks) {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;

      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskElement.dataset.id = task.id;

    const priorityClass = `priority-${task.priority}`;
    const dueDateBadge = this.createDueDateBadge(task.dueDate);

    taskElement.innerHTML = `
      <div class="task-header">
        <div class="task-content">
          <div class="task-title-container">
            <button class="task-checkbox ${task.completed ? 'completed' : ''}" data-id="${task.id}" type="button">
              ${task.completed ? `
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ` : ''}
            </button>
            <h3 class="task-title ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.title)}</h3>
          </div>
          
          ${task.description ? `
            <p class="task-description ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.description)}</p>
          ` : ''}
          
          <div class="task-meta">
            <div class="task-badge priority-badge ${priorityClass}">
              ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </div>
            ${dueDateBadge}
          </div>
        </div>
        
        <div class="task-actions">
          <button class="task-action-btn edit" data-id="${task.id}" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="task-action-btn delete" data-id="${task.id}" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    `;

    return taskElement;
  }

  createDueDateBadge(dueDate) {
    if (!dueDate) return '';

    let dueDateClass = '';
    let prefix = 'Due: ';

    if (isOverdue(dueDate)) {
      dueDateClass = 'due-date-overdue';
      prefix = 'Overdue: ';
    } else if (isDueSoon(dueDate)) {
      dueDateClass = 'due-date-soon';
      prefix = 'Due soon: ';
    }

    return `
      <div class="task-badge due-date-badge ${dueDateClass}">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        ${prefix}${formatDate(dueDate)}
      </div>
    `;
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}