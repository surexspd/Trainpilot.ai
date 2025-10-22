document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login');
    if (loginBtn) {
        // use page-relative path so it works on GitHub Pages (repository root)
        loginBtn.addEventListener('click', () => {
            window.location.href = 'loginpage.html';
        });
    }

    const checkBtn = document.getElementById('Cheak');
    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            window.location.href = 'loginpage.html';
        });
    }
});
