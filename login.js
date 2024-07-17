// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyC-J2OdSIOBZLYiA-JavO5eaAVdqFHJgOQ',
    appId: '1:929837617513:web:333179ea490322ae88adf8',
    messagingSenderId: '929837617513',
    projectId: 'fyp-project-db-final',
    authDomain: 'fyp-project-db-final.firebaseapp.com',
    storageBucket: 'fyp-project-db-final.appspot.com',
};

firebase.initializeApp(firebaseConfig);

const loginForm = document.getElementById('loginForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Attempting login with email:', email); // Log email for debugging
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Login successful!'); // Log success message for debugging
            // Hide error message (if any)
            errorMessage.style.display = 'none';
            // Show success message
            successMessage.style.display = 'block';
            // Redirect to popup.html upon successful login
            window.location.href = 'popup.html';
        })
        .catch((error) => {
            console.error('Login Error:', error.message); // Log error message for debugging
            // Hide success message (if any)
            successMessage.style.display = 'none';
            // Show error message
            errorMessage.textContent = 'Login failed. Please check your credentials and try again.';
            errorMessage.style.display = 'block';
        });
});
