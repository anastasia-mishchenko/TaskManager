class StorageService {
  constructor() {
    this.key = 'tasks';
    console.debug('StorageService initialized with key:', this.key);
  }

  getTasks() {
    try {
      const data = localStorage.getItem(this.key);
      const tasks = data ? JSON.parse(data) : [];
      console.debug('Retrieved tasks from storage:', tasks);
      return tasks;
    } catch (error) {
      console.error('Storage error:', error);
      return [];
    }
  }

  saveTasks(tasks) {
    try {
      console.debug('Saving tasks to storage:', tasks);
      localStorage.setItem(this.key, JSON.stringify(tasks));
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
}

export const storageService = new StorageService();