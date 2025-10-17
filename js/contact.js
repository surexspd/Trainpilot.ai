// contact.js - contact/help page interactions
document.addEventListener('DOMContentLoaded', () => {
  console.log('contact.js loaded');
  const submitBtn = document.querySelector('.Submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = document.querySelector('.contact-us-input');
      const val = input ? input.value.trim() : '';
      if (val) {
        alert('Thanks for contacting us. We received: ' + val);
        if (input) input.value = '';
      } else {
        alert('Please enter a message before submitting.');
      }
    });
  }
});
