
/**
 * Lado del cliente (Frontend)
*/

// import axios from 'axios';

const infoConnection = document.getElementById("connection-status");
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("login-form");
    // console.log(form === null);
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const nombreApellido = document.getElementById("name-and-lastname").value;
        // console.log(nombreApellido)
        const email = document.getElementById("email").value;
        // console.log(email)
        const password = document.getElementById("password").value;
        // console.log(password)

        // hago una solicitud POST al servidor, con la URL del endpoint del servidor y los datos del usuario que se envían en la solicitud para registrar al usuario
        axios.post('http://localhost:8081/register', { nombreApellido, email, password })
            .then(res => {
                console.log(res); // { data: {...}, status: 200, statusText: 'OK', headers: {...}, config: {...} }
                console.log(res.data); // {message: '¡Registrado Exitosamente!'}
                if (res.data.message === "¡Registrado Exitosamente!") {
                    console.log(res); // { data: {...}, status: 200, statusText: 'OK', headers: {...}, config: {...} }
                    console.log(res.data); // { message: '¡Registrado Exitosamente!' }
                    console.log(res.data.message); // ¡Registrado Exitosamente!
                    infoConnection.innerText = res.data.message; // Almacena en el elemento <span> el mensaje
                }
            })
            .catch(err => {
                console.log("Hubo un error al registrar el usuario: ", err.response ? err.response.data : err.message)
                if(infoConnection.innerText.indexOf("Hubo un error al registrar el usuario") === -1){ // le pongo '-1' para preguntar si no hay 'Hubo un error al registrar el usuario'
                    infoConnection.innerText = "Hubo un error al registrar el usuario"; // lo agrega si no hay
                } else if (infoConnection.innerText.indexOf("Registro exitoso") === -1){ // sino, si el contenido no tiene "Registro exitoso" que lo agregue
                    infoConnection.innerText = "Registro exitoso"; // lo agrega si no hay
                } else {
                    infoConnection.innerText = err.response ? err.response.data : err.message; // sino agrega el error 
                }
            });
    });
});
