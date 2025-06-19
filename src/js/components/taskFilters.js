import { taskManager } from "../models/TaskManager.js";

export class TaskFilters {
  constructor() {
    this.filters = {
      searchTerm: "",
      priority: null,
      completed: null,
    };
  }

  updateSearchTerm(term) {
    this.filters.searchTerm = term;
  }

  updatePriority(priority) {
    this.filters.priority = priority;
  }

  updateCompleted(completed) {
    this.filters.completed = completed;
  }

  clearAll() {
    this.filters = {
      searchTerm: "",
      priority: null,
      completed: null,
    };
  }

  getFilteredTasks() {
    return taskManager.filterTasks(this.filters);
  }

  hasActiveFilters() {
    return (
      this.filters.searchTerm ||
      this.filters.priority !== null ||
      this.filters.completed !== null
    );
  }

  get activeFilters() {
    return this.filters;
  }
}
