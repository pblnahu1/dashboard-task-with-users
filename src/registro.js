
/**
 * Lado del cliente (Frontend)
*/

// import axios from 'axios';

const fnAddLoader = () => document.getElementById('loader').classList.add('hidden');

const fnRemoveLoader = () => document.getElementById('loader').classList.remove('hidden');

const reiniceInput = () => {
  document.getElementById("name-and-lastname-register").value = '';
  document.getElementById("email-register").value = '';
  document.getElementById("password-register").value = '';
}

const infoConnection = document.getElementById("connection-status-register");

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById("register-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    fnRemoveLoader();

    const nombreApellido = document.getElementById("name-and-lastname-register").value;
    const email = document.getElementById("email-register").value;
    const password = document.getElementById("password-register").value;

    // hago una solicitud POST al servidor, con la URL del endpoint del servidor y los datos del usuario que se envían en la solicitud para registrar al usuario
    axios.post('http://localhost:8081/register', { nombreApellido, email, password })
      .then(res => {
        console.log(res);
        console.log(res.data);

        if (res.data.success) {
          console.log(res.data);

          infoConnection.innerText = res.data.message;

          const welcomeMessage = document.createElement("h2");
          welcomeMessage.textContent = "¡Bienvenido " + nombreApellido + "!";
          welcomeMessage.classList.add("text-2xl", "font-bold", "m-4");

          const registerContainer = document.getElementById('container-auth-register');
          registerContainer.innerHTML = "";
          registerContainer.appendChild(welcomeMessage);

          const authSectionElement = document.getElementById('sct-auth');
          authSectionElement.style.display = 'none';
          reiniceInput();

          setTimeout(() => {
            window.location.href = '../index.html';
          }, 2000)
        } else {
          infoConnection.innerText = res.data.message || "Error al registrar el usuario";
        }
      })
      .catch(err => {
        console.error("Error al registrar el usuario. Su cuenta ya existe: ", err.response ? err.response.data : err.message);
        infoConnection.innerText = err.response?.data?.message || "Error al registrar el usuario. Su cuenta ya existe";
      })
      .finally(() => {
        fnAddLoader();
      });
  });
});
