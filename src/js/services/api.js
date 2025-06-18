class ApiService {
  constructor() {
    this.baseUrl = '/api';
  }

  async getRandomQuote() {
    try {
      const response = await fetch(`${this.baseUrl}/quotes/random`);
      const data = await response.json();
      return data.success ? data.quote : this.getFallbackQuote();
    } catch (error) {
      console.error('API error:', error);
      return this.getFallbackQuote();
    }
  }

  getFallbackQuote() {
    return {
      content: 'The key to success is to focus on goals, not obstacles.',
      author: 'Unknown'
    };
  }
}

export const apiService = new ApiService();