
import { TaskManager } from "./taskManager.js";
import { UserManager } from "./userManager.js";
import { validarUsername, validarEmail } from "./util.js";

// declaro nuevas instancias de clases
const taskManager = new TaskManager();
const userManager = new UserManager();

let selectedColor = null; // variable para guardar el color

document.querySelectorAll('.color-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.color-option').forEach(option => option.classList.remove('selected'));
    option.classList.add('selected');
    selectedColor = option.dataset.color;
  });
});

document.getElementById("add-task").addEventListener('click', handleTask);
document.getElementById("task-name").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleTask();
});

///////////////////////////////////////////////////////

// Event listeners para users
// document.getElementById("add-user").addEventListener('click', handleUser);
// document.getElementById("username").addEventListener("keydown", (e) => {
//     if (e.key === "Enter") handleUser();
// });
// document.getElementById("email").addEventListener("keydown", (e) => {
//     if (e.key === "Enter") handleUser();
// });

///////////////////////////////////////////////////////

async function handleTask() {
  const nombreTarea = document.getElementById("task-name").value.trim();
  const taskNameInput = document.getElementById("task-name");
  const loggedUser = localStorage.getItem('loggedUser');
  const userId = loggedUser ? JSON.parse(loggedUser).userId : null;

  if (!nombreTarea || !userId) {
    console.error("El nombre de la tarea o el userId son inválidos");
    taskNameInput.classList.add("input-error");
    return;
  }

  try {
    await taskManager.addOrUpdateTask(nombreTarea, selectedColor || "#ffffff", userId);
    taskManager.renderTasks();
    taskNameInput.value = ''; // limpio el input
    taskNameInput.classList.remove("input-error");
    selectedColor = null; // reinicio el color
    document.querySelectorAll('.color-option').forEach(option => option.classList.remove('selected'));
  } catch (error) {
    console.error("Error al agregar o actualizar la tarea: ", error);
  }
}

///////////////////////////////////////////////////////

// async function handleUser() {
//     const username = document.getElementById("username").value;
//     const email = document.getElementById("email").value;
//     if (validarUsername(username) && validarEmail(email)) {
//         await userManager.agregarEditarUsuarios(username, email);
//         userManager.renderUsuarios();
//         document.getElementById("username").value = "";
//         document.getElementById("email").value = "";
//     } else {
//         alert("Por favor, ingrese un nombre de usuario y un correo electrónico válidos.");
//     }
// }

///////////////////////////////////////////////////////

// cargo tareas cuando la página se carga 
window.onload = async () => {
  const loggedUser = localStorage.getItem('loggedUser');
  if (loggedUser) {
    try {
      const user = JSON.parse(loggedUser);
      const userId = user.userId;
      if (!userId) {
        console.error("el userId no es valido")
        return
      }

      await taskManager.loadTasks(userId);
    } catch (error) {
      console.error("error al cargar las tareas o procesar el usuario logueado: ", error)
    }
  } else {
    console.error("No se encontró el usuario logueado.");
  }
};


