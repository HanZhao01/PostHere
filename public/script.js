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
            window.location.href = '/dashboard?username=' + encodeURIComponent(data.user.username); // Ensure this matches what the server sends
        } else {
            alert('Login Failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login Error: ' + error.message);
    });
});


document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Signup failed: ' + response.status); // Handle HTTP errors
        }
        return response.json();
    })
    .then(data => {
        console.log('Signup Success:', data);
        // Check if data and data.user exist before accessing data.user.username
        
        alert('Successfully Signed Up! Welcome!' );
    
        // Clear the form fields
        //document.getElementById('signupForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message); // Show error message
    });
});

document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
});

document.getElementById('signupBtn').addEventListener('click', function() {
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
});
