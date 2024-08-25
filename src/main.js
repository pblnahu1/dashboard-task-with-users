import { TaskManager } from "./taskManager.js";

const taskManager = new TaskManager();
let selectedColor = null;

document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(option => option.classList.remove('selected'));
        option.classList.add('selected');
        selectedColor = option.dataset.color; // guardar el color seleccionado
    });
});

document.getElementById("add-task").addEventListener('click', handleTask);
document.getElementById("task-name").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleTask();
});
// document.getElementById("task-color").addEventListener('keydown', (e) => {
//     if (e.key === "Enter") handleTask();
// })

async function handleTask() {
    const taskName = document.getElementById("task-name").value;
    // const taskColor = document.getElementById("task-color").value;
    if (taskName) {
        await taskManager.addOrUpdateTask(taskName, selectedColor || "#ffffff");
        taskManager.renderTasks();
        document.getElementById("task-name").value = ''; // limpio el input
        selectedColor = null; // reinicio el color
        // document.getElementById("task-color").value = '#ffffff';
        document.querySelectorAll('.color-option').forEach(option => option.classList.remove('selected'));
    }
}

// cargo tareas cuando la página se carga 
window.addEventListener('DOMContentLoaded', async () => {
    await taskManager.loadTasks();
    taskManager.renderTasks();
});
