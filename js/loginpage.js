function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    const messageElement = document.getElementById('message');


    if (username === '' || password === '') {
        messageElement.textContent = 'Please enter both username and password.';
        messageElement.style.color = 'white';
        return;
    }

    
    if (userType === 'employee') {
      
        if (username === 'employee' && password === '2') {
          
            window.location.href = 'Employee.html';
        } else {
            messageElement.textContent = 'Invalid employee credentials.';
            messageElement.style.color = 'red';
        }
    } else if (userType === 'user') {
        if (username === 'user' && password === '1') {

            window.location.href = 'General.html';
        } else {
            messageElement.textContent = 'Invalid user credentials.';
            messageElement.style.color = 'red';
        }
    }
}