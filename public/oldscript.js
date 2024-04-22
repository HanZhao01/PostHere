document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent default form submission which reloads the page

    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Login successful") {
            console.log('Login Success:', data);
            window.location.href = '/dashboard'; // Redirect to a new page/dashboard
        } else {
            // Display error message directly on the page
            alert('Login Failed: ' + data.message);
        }
    })
    // Inside your login fetch response handling
    .then(data => {
    if (data.message === "Login successful") {
        window.location.href = '/dashboard?username=' + encodeURIComponent(data.user.Username);
    } else {
        console.log('Login Failed:', data.message);
    }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login Error: ' + error.message);
    });
});
