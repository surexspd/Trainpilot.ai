// Employee.js - interactions for employee dashboard
document.addEventListener('DOMContentLoaded', () => {
  console.log('Employee.js loaded');

  const checkBtn = document.querySelector('.container-btn');
  const numberInput = document.querySelector('.number-input');
  if (checkBtn && numberInput) {
    checkBtn.addEventListener('click', () => {
      const num = numberInput.value.trim();
      if (!num) return alert('Please enter a train number');
      // Demo: populate report area
      alert('Fetching report for train: ' + num + ' (demo)');
    });
  }

  // Simple popup show
  function showPopup(msg) {
    const popup = document.getElementById('popupNotification');
    if (!popup) return;
    popup.textContent = msg;
    popup.style.transform = 'translateX(0)';
    setTimeout(() => { popup.style.transform = 'translateX(-100%)'; }, 3000);
  }
  setTimeout(() => showPopup('Demo: Employee dashboard loaded'), 1200);
});
