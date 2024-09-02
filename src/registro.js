
/**
 * Lado del cliente (Frontend)
*/

// import axios from 'axios';

const fnAddLoader = () => document.getElementById('loader').classList.add('hidden');

const fnRemoveLoader = () => document.getElementById('loader').classList.remove('hidden');

const reiniceInputRegister = () => {
  document.getElementById("name-and-lastname-register").value = '';
  document.getElementById("email-register").value = '';
  document.getElementById("password-register").value = '';
}

const reiniceInputLogin = () => {
  document.getElementById("email-login").value = '';
  document.getElementById("password-login").value = '';
}

const infoConnection = document.getElementById("connection-status-register");
const infoConnection2 = document.getElementById("connection-status-login");

document.addEventListener('DOMContentLoaded', () => {

  const formRegister = document.getElementById("register-form");
  const formLogin = document.getElementById("login-form");

  formRegister.addEventListener("submit", (event) => {
    event.preventDefault();
    fnRemoveLoader();

    const nombreApellido = document.getElementById("name-and-lastname-register").value;
    const email = document.getElementById("email-register").value;
    const password = document.getElementById("password-register").value;

    // hago una solicitud POST al servidor, con la URL del endpoint del servidor y los datos del usuario que se envían en la solicitud para registrar al usuario
    axios.post('http://localhost:8081/register', { nombreApellido, email, password, mode: 'cors' })
      .then(res => {
        console.log("Respuesta del Servidor: ", res);
        console.log("Datos del Servidor: ", res.data);

        if (res.data.success) {
          console.log("Registro Exitoso: " + res.data.message);

          infoConnection.innerText = res.data.message;

          // const welcomeMessage = document.createElement("h2");
          // welcomeMessage.textContent = "¡Bienvenido " + nombreApellido + "!";
          // welcomeMessage.classList.add("text-2xl", "font-bold", "m-4");

          // const registerContainer = document.getElementById('container-auth-register');
          // registerContainer.innerHTML = "";
          // registerContainer.appendChild(welcomeMessage);

          reiniceInputRegister();

          setTimeout(() => {
            reiniceInputRegister();
            console.log("redirigiendo a index.html ...");
            window.location.href = './index.html';
            // window.location.assign = './index.html';
          }, 1000)

          // fnLoaderPath(reiniceInputRegister());
        } else {
          infoConnection.innerText = res.data.message || "Error al registrar el usuario";
          console.log(infoConnection.innerText);
        }
      })
      .catch(err => {
        console.error("Error al registrar el usuario: ", err.response ? err.response.data : err.message);
        infoConnection.innerText = err.response?.data?.message || "Error al registrar el usuario.";
      })
      .finally(() => {
        fnAddLoader();
      });
  });

  formLogin.addEventListener("submit", (event) => {
    event.preventDefault();
    fnRemoveLoader();

    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;

    axios.post('http://localhost:8081/login', { email, password, mode: 'cors' })
      .then(res => {
        console.log("Respuesta del Servidor: ", res);
        console.log("Datos del Servidor: ", res.data);
        if (res.data.success) {
          console.log("Login Exitoso: " + res.data.message);
          infoConnection2.innerText = res.data.message;

          reiniceInputLogin();

          setTimeout(() => {
            reiniceInputLogin();
            console.log("redirigiendo a index.html ...");
            window.location.href = './index.html';
            // window.location.assign = './index.html';
          }, 2000)

          // fnLoaderPath(reiniceInputLogin());
        } else {
          infoConnection2.innerText = res.data.message || "Error al iniciar sesión";
          console.log(infoConnection2.innerText);
        }
      })
      .catch(err => {
        console.error("Error al iniciar sesión: ", err.response ? err.response.data : err.message);
        infoConnection2.innerText = err.response?.data?.message || "Error al iniciar sesión.";
      })
      .finally(() => {
        fnAddLoader();
      });
  });
});

// const fnLoaderPath = () => {
//   const load = setTimeout(() => {
//     console.log("redirigiendo a index.html ...");
//     window.location.href = './index.html';
//     // window.location.assign = './index.html';
//   }, 1000)

//   return load;
// }