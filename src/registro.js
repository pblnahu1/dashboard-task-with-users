
import { API_URL } from "../api/rutas.js";
import { saveUserToLS, userIcon, userLogged } from "./userLogged.js";

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
      
      const formData = new FormData(this); // capturo todo del form

      const nombreApellido = document.getElementById("name-and-lastname-register").value;
      const email = document.getElementById("email-register").value;
      const password = document.getElementById("password-register").value;
      const iconProfile = document.getElementById("icon-profile").files[0];
      
      formData.append('nombreApellido', nombreApellido)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('iconProfile', iconProfile)
  
      axios.post(`${API_URL}/register`, formData, {
        mode: 'cors',
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
        .then(res => {
          console.log("Respuesta del Servidor: ", res);

          if (res.data.success) {
            saveUserToLS(email, nombreApellido, iconProfile);
            console.log("Registro Exitoso: " + res.data.message);

            if (infoConnection) {
              infoConnection.innerText = res.data.message;
            }

            resetForm('register-form');

            setTimeout(() => {
              window.location.replace('./dashboard-tasks.html');
            }, 2000);
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
  
      axios.post(`${API_URL}/login`, {
        mode: 'cors',
        email,
        password
      })
        .then(res => {
          console.log("Respuesta del Servidor: ", res);
          if (res.data.success) {
            const { nombreApellido, iconProfile, userId } = res.data;
            saveUserToLS(email, nombreApellido, iconProfile, userId);
            console.log("Login Exitoso: " + res.data.message);

            if (infoConnection2) {
              infoConnection2.innerText = res.data.message;
            }
            
            resetForm('login-form');

            setTimeout(() => {
              window.location.replace('./dashboard-tasks.html');
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
  userIcon("img-user-logged");
});