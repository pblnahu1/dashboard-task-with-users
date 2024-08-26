// import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const nombreApellido = document.getElementById("name-and-lastname").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        axios.post('http://localhost:8081/register', { nombreApellido, email, password })
            .then(res => console.log(res.data))
            .catch(err => console.log(err.response ? err.response.data : err.message));
    });
});
