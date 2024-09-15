
/**
 * Lado del cliente (Frontend)
*/
import userLogged, {saveUserToLS} from "./userLogged.mjs";

// import axios from 'axios';

const fnAddLoader = () => document.getElementById('loader').classList.add('hidden');
const fnRemoveLoader = () => document.getElementById('loader').classList.remove('hidden');

const resetForm = (formId) => {
  document.getElementById(formId).reset();
}

const infoConnection = document.getElementById("connection-status-register");
const infoConnection2 = document.getElementById("connection-status-login");

document.addEventListener('DOMContentLoaded', () => {

  const formRegister = document.getElementById("register-form");
  const formLogin = document.getElementById("login-form");

  if (formRegister) {
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
            // localStorage.setItem('nombreApellido', nombreApellido);
            saveUserToLS(email, nombreApellido);
            console.log("Registro Exitoso: " + res.data.message);

            if (infoConnection) {
              infoConnection.innerText = res.data.message;
            }

            resetForm('register-form');

            setTimeout(() => {
              window.location.href = './dashboard-tasks.html';
            }, 2000)
          } else {
            if (infoConnection) {
              infoConnection.innerText = res.data.message || "Error al registrar el usuario";
            }
          }
        })
        .catch(err => {
          if (infoConnection) {
            infoConnection.innerText = err.response?.data?.message || "Error al registrar el usuario.";
          }
        })
        .finally(() =>  fnAddLoader());
    });
  }


  if (formLogin) {
    formLogin.addEventListener("submit", (event) => {
      event.preventDefault();
      fnRemoveLoader();
  
      const email = document.getElementById("email-login").value;
      const password = document.getElementById("password-login").value;
  
      axios.post('http://localhost:8081/login', { email, password, mode: 'cors' })
        .then(res => {
          // console.log("Respuesta del Servidor: ", res);
          // console.log("Datos del Servidor: ", res.data);
          if (res.data.success) {
            const { nombreApellido } = res.data;
            if (nombreApellido) {
              // localStorage.setItem('nombreApellido', nombreApellido);
              saveUserToLS(email, nombreApellido);
              console.log("Login Exitoso: " + res.data.message);
            } else {
              console.error("Error al iniciar sesión: ", res.data.message);
            }

            if (infoConnection2) {
              infoConnection2.innerText = res.data.message;
            }
            
            resetForm('login-form');

            setTimeout(() => {
              window.location.href = './dashboard-tasks.html';
            }, 2000);
          } else {
            if (infoConnection2) {
              infoConnection2.innerText = res.data.message || "Error al iniciar sesión";
            }
          }
        })
        .catch(err => {
          if (infoConnection2) {
            infoConnection2.innerText = err.response?.data?.message || "Error al iniciar sesión.";
          }
        })
        .finally(() => fnAddLoader());
    });
  }

  userLogged("name-user-logged");
});