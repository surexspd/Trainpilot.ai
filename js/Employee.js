// Employee.js - interactions for employee dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('Employee.js loaded');

    const checkBtn = document.querySelector('.container-btn');
    const numberInput = document.querySelector('.number-input');
    
    if (checkBtn && numberInput) {
        checkBtn.addEventListener('click', fetchTrainData);
        
        // Also allow Enter key to trigger search
        numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                fetchTrainData();
            }
        });
    }

    async function fetchTrainData() {
        const trainNumber = numberInput.value.trim();
        
        if (!trainNumber) {
            alert('Please enter a train number');
            return;
        }

        try {
            // Show loading state
            const originalText = checkBtn.textContent;
            checkBtn.textContent = 'Loading...';
            checkBtn.disabled = true;

            const response = await fetch(`http://localhost:8000/api/train/${trainNumber}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to fetch train data');
            }

            const trainData = await response.json();
            updateTrainReport(trainData);
            updateArrivalSection(trainData); // Update arrival section with searched train
            showNotification(`${trainData.train_name} data loaded successfully`);

        } catch (error) {
            console.error('Error:', error);
            if (error.message.includes('not found')) {
                alert(`Train ${trainNumber} not found in database. Please check the train number.`);
            } else if (error.message.includes('No train table')) {
                alert('Database configuration issue. Please contact administrator.');
            } else {
                alert('Error: ' + error.message);
            }
        } finally {
            // Reset button state
            checkBtn.textContent = 'Check';
            checkBtn.disabled = false;
        }
    }

    function updateTrainReport(trainData) {
        const reportSection = document.querySelector('.container .section:first-of-type');
        
        if (!reportSection) {
            console.error('Report section not found');
            return;
        }

        // Determine status based on train_running
        let statusIcon = '⚪';
        let statusText = 'Unknown';
        
        if (trainData.train_running === 'yes') {
            statusIcon = '🟢';
            statusText = 'Running';
        } else if (trainData.train_running === 'no') {
            statusIcon = '🔴';
            statusText = 'Not Running';
        }

        // Format the report using your exact database columns
        reportSection.innerHTML = `
            <h2>Train Report</h2>
            <p><span class="icon">🚆 Train Number:</span> ${trainData.train_num || 'N/A'}</p>
            <p><span class="icon">📛 Train Name:</span> ${trainData.train_name || 'N/A'}</p>
            <p><span class="icon">➡️ Route:</span> ${trainData.route || 'N/A'}</p>
            <p><span class="icon">🕕 Arrival Time:</span> ${formatTime(trainData.arrival_time) || 'N/A'}</p>
            <p><span class="icon">🕕 Departure Time:</span> ${formatTime(trainData.departure_time) || 'N/A'}</p>
            <p><span class="icon">👤 Passengers Percentage:</span> ${trainData.passenger_percentage ? trainData.passenger_percentage + '%' : 'N/A'}</p>
            <p><span class="icon">🚈 Speed:</span> ${trainData.speed ? trainData.speed + ' km/h' : 'N/A'}</p>
            <p><span class="icon">${statusIcon} Status:</span> ${statusText}</p>
        `;
    }

    function updateArrivalSection(trainData) {
        const arrivalSection = document.querySelector('.arrival-big-space ol');
        
        if (!arrivalSection) return;

        // Clear previous data
        arrivalSection.innerHTML = '';
        
        // Create list item for the searched train only
        const listItem = document.createElement('li');
        const statusIcon = trainData.train_running === 'yes' ? '🟢' : '🔴';
        listItem.innerHTML = `
            ${trainData.train_num} ${trainData.train_name} | 
            Arrival: ${formatTime(trainData.arrival_time)} | 
            Departure: ${formatTime(trainData.departure_time)} | 
            Status: ${statusIcon}
        `;
        arrivalSection.appendChild(listItem);
    }

    function formatTime(timeString) {
        if (!timeString) return 'N/A';
        
        try {
            // Handle PostgreSQL time format (HH:MM:SS)
            if (typeof timeString === 'string') {
                const timeParts = timeString.split(':');
                if (timeParts.length >= 2) {
                    const hours = parseInt(timeParts[0]);
                    const minutes = parseInt(timeParts[1]);
                    
                    const period = hours >= 12 ? 'PM' : 'AM';
                    const displayHours = hours % 12 || 12;
                    
                    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                }
            }
            
            return timeString;
        } catch (error) {
            console.error('Time formatting error:', error);
            return timeString;
        }
    }

    // Popup notification function
    function showNotification(message) {
        const popup = document.getElementById('popupNotification');
        if (!popup) return;
        
        popup.textContent = message;
        popup.style.transform = 'translateX(0)';
        setTimeout(() => { 
            popup.style.transform = 'translateX(-100%)'; 
        }, 4000);
    }

    // Show initial notification
    setTimeout(() => showNotification('Enter a train number to check details.'), 1000);

    // Logout functionality
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'index.html';
            }
        });
    }

    // Chatbot functionality
    const sendBtn = document.querySelector('.chatbot-send-btn');
    const input = document.querySelector('.chatbot-input');
    const body = document.querySelector('.chatbot-body');

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const msg = input.value.trim();
            if (msg) {
                const userMsg = document.createElement('p');
                userMsg.textContent = 'You: ' + msg;
                body.appendChild(userMsg);
                input.value = '';
                setTimeout(() => {
                    const botMsg = document.createElement('p');
                    botMsg.textContent = 'Pilot: I am still learning .... coming Soon...';
                    body.appendChild(botMsg);
                    body.scrollTop = body.scrollHeight;
                }, 1000);
            }
        });
    }
});