import { apiService } from '../services/api.js';

export class HeaderView {
  constructor() {
    this.quoteText = document.getElementById('quote-text');
    this.quoteAuthor = document.getElementById('quote-author');
    
    if (this.quoteText && this.quoteAuthor) {
      this.loadQuote();
    }
  }

  async loadQuote() {
    try {
      this.displayQuote('Loading quote...', '');
      
      const quote = await apiService.getRandomQuote();
      this.displayQuote(quote.content, quote.author);
    } catch (error) {
      console.error('Quote error:', error);
      this.displayQuote('Focus on your goals, not obstacles.', 'Unknown');
    }
  }

  displayQuote(content, author) {
    if (this.quoteText) {
      this.quoteText.textContent = `"${content}"`;
    }
    
    if (this.quoteAuthor) {
      this.quoteAuthor.textContent = author ? `— ${author}` : '';
    }
  }
}