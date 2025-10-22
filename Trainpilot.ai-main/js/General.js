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
    sendBtn.addEventListener('click', () => {
      const msg = input.value.trim();
      if (msg) {
        const userMsg = document.createElement('p');
        userMsg.textContent = 'You: ' + msg;
        body.appendChild(userMsg);
        input.value = '';
        setTimeout(() => {
          const botMsg = document.createElement('p');
          botMsg.textContent = 'Pilot: This is a demo reply.';
          body.appendChild(botMsg);
          body.scrollTop = body.scrollHeight;
        }, 600);
      }
    });
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
