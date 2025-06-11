// Task management functionality
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function createTask(taskData) {
  const task = {
    id: Date.now(),
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    dueDate: taskData.dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(task);
  saveTasks();
  renderTasks();
  return task;
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  
  if (!taskList) return;
  
  // Clear existing tasks
  taskList.innerHTML = '';
  
  if (tasks.length === 0) {
    // Clone the empty state 
    const emptyStateClone = emptyState.cloneNode(true);
    taskList.appendChild(emptyStateClone);
    return;
  }
  
  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });
  
  updateTaskCount();
}

function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.className = `task-item task-item--${task.priority}`;
  taskElement.dataset.id = task.id;
  
  taskElement.innerHTML = `
    <div class="task-item__content">
      <div class="task-item__header">
        <h3 class="task-item__title">${task.title}</h3>
        <span class="task-item__priority">${task.priority}</span>
      </div>
      <p class="task-item__description">${task.description || ''}</p>
      ${task.dueDate ? `<p class="task-item__due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
    </div>
    <div class="task-item__actions">
      <button class="task-item__complete-btn" onclick="toggleTaskComplete(${task.id})">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
      <button class="task-item__delete-btn" onclick="deleteTask(${task.id})">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;
  
  return taskElement;
}

function updateTaskCount() {
  const taskCount = document.getElementById('task-count');
  if (taskCount) {
    taskCount.textContent = tasks.length;
  }
}

function toggleTaskComplete(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasks();
  renderTasks();
}

// Make functions globally accessible
window.deleteTask = deleteTask;
window.toggleTaskComplete = toggleTaskComplete;

// Initialize tasks on load
document.addEventListener('DOMContentLoaded', renderTasks);

// Re-render after HTMX content swap
document.body.addEventListener('htmx:afterSwap', (event) => {
  if (event.detail.target.matches('.main__tasks-list')) {
    // Only render if the task list is empty
    const taskList = document.getElementById('task-list');
    if (taskList && taskList.children.length === 0) {
      renderTasks();
    }
  }
}); 

export { createTask, renderTasks, toggleTaskComplete, deleteTask };