// App initialization
import { HeaderView } from './views/HeaderView.js';
import { TaskView } from './views/TaskView.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  
  // Re-initialize after HTMX loads content
  document.body.addEventListener('htmx:afterSwap', () => {
    initializeApp();
  });
});

function initializeApp() {
  // Initialize header if quote elements exist
  if (document.getElementById('quote-text')) {
    new HeaderView();
  }
  
  // Initialize tasks if task list exists
  if (document.getElementById('task-list')) {
    new TaskView();
  }
}
