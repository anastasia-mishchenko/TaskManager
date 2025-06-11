import { createTask } from './taskManager.js';

function showModal() {
  const modal = document.getElementById('task-modal');
  if (!modal) return;
  modal.classList.add('modal--visible');
  document.body.style.overflow = 'hidden';
}

// Function to hide modal
function hideModal() {
  const modal = document.getElementById('task-modal');
  if (!modal) return;
  modal.classList.remove('modal--visible');
  document.body.style.overflow = '';
}

// Function to initialize modal
function initModal() {
  const modal = document.getElementById('task-modal');
  const newTaskBtn = document.getElementById('new-task-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelTaskBtn = document.getElementById('cancel-task-btn');
  const taskForm = document.getElementById('task-form');
  
  if (!modal || !newTaskBtn || !closeModalBtn || !cancelTaskBtn || !taskForm) {
    console.log('Modal elements not found, will retry after HTMX load');
    return;
  }

  // Event listeners
  newTaskBtn.addEventListener('click', showModal);
  closeModalBtn.addEventListener('click', hideModal);
  cancelTaskBtn.addEventListener('click', hideModal);
  
  // Handle form submission
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const priority = document.getElementById('task-priority').value;
    const dueDate = document.getElementById('task-due-date').value;
    
    // Create new task
    createTask({ title, description, priority, dueDate });
    
    // Reset form and hide modal
    taskForm.reset();
    hideModal();
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    const modalContent = modal.querySelector('.modal__container');
    if (modalContent && !modalContent.contains(e.target) && modal.classList.contains('modal--visible')) {
      hideModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal--visible')) {
      hideModal();
    }
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initModal);

// Initialize after HTMX content swap
document.body.addEventListener('htmx:afterSwap', (event) => {
  if (event.detail.target.matches('.task-modal')) {
    initModal();
  }
}); 