// async function fetchQuote() {
//   try {
//     const response = await fetch('https://api.quotable.io/random');
//     const data = await response.json();

//     document.getElementById('quote-text').textContent = data.content;
//     document.getElementById('quote-author').textContent = `— ${data.author}`;
//   } catch (error) {
//     console.error('Error fetching quote:', error);
//     document.getElementById('quote-text').textContent = 'The best way to get things done is to simply begin.';
//     document.getElementById('quote-author').textContent = '— Anonymous';
//   }
// }

const quotes = [
  { text: "The best way to get things done is to simply begin.", author: "Anonymous" },
  { text: "Do or do not. There is no try.", author: "Yoda" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
];

function fetchQuote() {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quote-text').textContent = random.text;
  document.getElementById('quote-author').textContent = `— ${random.author}`;
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {

  document.body.addEventListener('htmx:afterSwap', (event) => {
    if (event.detail.target.matches('.header__container')) {
      fetchQuote();
    }
  });
}); 