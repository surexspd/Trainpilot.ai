// General.js - interactions for General/Service pages
document.addEventListener('DOMContentLoaded', () => {
  console.log('General.js loaded');

  // Booking form
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const from = bookingForm.querySelector('#from').value;
      const to = bookingForm.querySelector('#to').value;
      const date = bookingForm.querySelector('#date').value;
      alert(`Searching trains from ${from} to ${to} on ${date} (demo)`);
    });
  }

  // Food ordering form
  const foodForm = document.querySelector('.food-form');
  if (foodForm) {
    foodForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const item = foodForm.querySelector('#foodItem').value;
      const qty = foodForm.querySelector('#quantity').value;
      alert(`Order placed: ${qty} x ${item} (demo)`);
      foodForm.reset();
    });
  }

  // Chatbot
  const sendBtn = document.querySelector('.chatbot-send-btn');
  const input = document.querySelector('.chatbot-input');
  const body = document.querySelector('.chatbot-body');
  if (sendBtn && input && body) {
    async function sendMessage() {
      const msg = input.value.trim();
      if (!msg) return;
      const userMsg = document.createElement('p');
      userMsg.textContent = 'You: ' + msg;
      body.appendChild(userMsg);
      input.value = '';
      body.scrollTop = body.scrollHeight;

      // Try calling local API endpoint
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        });
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const botMsg = document.createElement('p');
        botMsg.textContent = 'Pilot: ' + (data.reply || 'No reply');
        body.appendChild(botMsg);
        body.scrollTop = body.scrollHeight;
      } catch (err) {
        // Fallback local echo if server not available
        const botMsg = document.createElement('p');
        botMsg.textContent = 'Pilot (offline): ' + msg;
        body.appendChild(botMsg);
        body.scrollTop = body.scrollHeight;
      }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
  }

  // Notification helper
  window.showNotification = (message) => {
    const popup = document.getElementById('popupNotification');
    if (!popup) return;
    popup.textContent = message;
    popup.style.transform = 'translateX(0)';
    setTimeout(() => { popup.style.transform = 'translateX(-100%)'; }, 3500);
  };
});
