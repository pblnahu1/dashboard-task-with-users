
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
  const nombreTarea = document.getElementById("task-name").value;
  if (nombreTarea) {
    await taskManager.addOrUpdateTask(nombreTarea, selectedColor || "#ffffff");
    taskManager.renderTasks();
    document.getElementById("task-name").value = ''; // limpio el input
    selectedColor = null; // reinicio el color
    document.querySelectorAll('.color-option').forEach(option => option.classList.remove('selected'));
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
window.addEventListener('DOMContentLoaded', async () => {
  await taskManager.loadTasks();
  taskManager.renderTasks();
  // await userManager.loadUsers();
  // userManager.renderUsuarios();
});
