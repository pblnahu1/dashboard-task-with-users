
import { API_URL } from "../api/rutas.js";

export class TaskManager {
  constructor() {
    this.tasks = [];
    this.edicionTaskId = null;
  }

  calcularPorcentaje() {
    const totalTasks = this.tasks.length;
    const tasksCompletadas = this.tasks.filter(task => task.completed).length;
    const porcentaje = totalTasks === 0 ? 0 : (tasksCompletadas / totalTasks) * 100;
    return porcentaje.toFixed(2);
  }

  async addOrUpdateTask(name, color, userId) {
    if (this.edicionTaskId !== null) {
      const task = this.tasks.find(task => task.id === this.edicionTaskId);
      if (task) {
        task.name = name; 
        task.color = color;
        task.userId = userId;
      }
      this.edicionTaskId = null;
    } else {
      const task = {
        id: this.tasks.length + 1,
        name,
        color: color || '#ffffff',
        completed: false,
        userId
      };
      this.tasks.push(task);
    }
    await this.saveTasks(name,color,userId);
    this.renderTasks();
  }

  toggleTaskCompletion(id) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  editTask(id) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      document.getElementById('task-name').value = task.name;
      this.edicionTaskId = id;
    }
  }

  renderTasks() {
    const taskList = document.getElementById("tasks");
    const contentText = document.getElementById("text_tareas");
    const pendingTasks = document.getElementById("pending-tasks");

    if (taskList && contentText) {
      contentText.innerHTML = '';
      if (this.tasks.length === 0) {
        contentText.innerHTML = 'No hay tareas. ¡Agregá una con tu color favorito!';
      } else {
        contentText.innerHTML = `Completá, Editá y Eliminá tus tareas`;
        if (pendingTasks) {
          pendingTasks.textContent = `Tienes ${this.tasks.length} ${this.tasks.length === 1 ? 'tarea' : 'tareas'} ${this.tasks.length === 1 ? 'pendiente' : 'pendientes'}`;
        } else {
          console.log("El elemento de pendientes de tareas no existe");
        }
      }
    } else {
      if (taskList === null) {
        console.log("La lista de tareas no existe");
      }

      if (contentText === null) {
        console.log("El elemento de texto para las tareas no existe");
      }
    }

    taskList.innerHTML = '';

    const porcentajeCompletado = this.calcularPorcentaje();
    const completadoBar = document.getElementById("completion-porcentage");
    completadoBar.textContent = `Progreso General: ${porcentajeCompletado}% Completado`;

    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = `${porcentajeCompletado}%`;

    const containerMainTask = document.createElement('div');
    containerMainTask.classList.add("container-main-task");
    taskList.appendChild(containerMainTask);

    this.tasks.forEach(task => {

      // console.log("Datos de la tarea: ", task);
      if (!task.id || !task.name || !task.color) {
        console.error("Datos inválidos en la tarea:", task);
        return;
      }
      
      const { id, name, color, completed } = task;

      if (!id || !name || !color) {
        console.error(`La tarea con ID ${id} tiene datos indefinidos.`);
        return;
      }

      const containerTasksGrid = document.createElement('div');
      containerTasksGrid.classList.add("task-container-grid");
      containerMainTask.appendChild(containerTasksGrid);


      const containerTasks = document.createElement('div');
      containerTasks.id = `${id}`;
      containerTasks.classList.add("task-container");
      containerTasksGrid.appendChild(containerTasks);


      const containerButtons = document.createElement('div');
      containerButtons.classList.add("container-buttons-task");
      containerTasksGrid.appendChild(containerButtons);

      const taskItem = document.createElement("li");
      taskItem.classList.add("task-item-container");
      taskItem.textContent = name;
      taskItem.style.backgroundColor = color;

      if (completed) {
        taskItem.classList.add("completed");
      }

      const toggleButton = document.createElement('button');
      toggleButton.textContent = completed ? 'Completado ✅' : 'Completar 🔥';
      toggleButton.addEventListener('click', () => {
        this.toggleTaskCompletion(id);
        this.renderTasks();
      });

      const editButton = document.createElement('button');
      editButton.textContent = 'Editar ✏️';
      editButton.addEventListener('click', () => {
        this.editTask(id);
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Borrar ❌';
      deleteButton.addEventListener("click", () => {
        this.deleteTask(id);
        this.renderTasks();
      });

      containerButtons.appendChild(toggleButton);
      containerButtons.appendChild(editButton);
      containerButtons.appendChild(deleteButton);
      containerTasks.appendChild(taskItem);
    });
  }

  async saveTasks(name, color, userId) {

    const taskData = { name, color, userId };
    if (this.edicionTaskId !== null) {
      // actualizo tarea existente
      await axios.put(`${API_URL}/tasks/${this.edicionTaskId}`, taskData)
        .then(res => console.log(res.data.message))
        .catch(err => console.error(err));
      
      this.edicionTaskId = null;
    } else {
      await axios.post(`${API_URL}/tasks`, taskData)
        .then(res => console.log(res.data.message))
        .catch(err => console.error(err));
    }

    this.renderTasks();

    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     console.log("Tasks saved!");
    //     resolve();
    //   }, 500);
    // });
  }


  async loadTasks(userId) {
    if (!userId) {
      console.error("El userId no es válido: ", userId);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/tasks/${userId}`);
      console.log("Datos recibidos del servidor: ", response.data); 
      if (response.data.success) { 
        this.tasks = response.data.tasks;
        console.log("Tareas a renderizar: ",this.tasks)
        this.renderTasks();
      } else {
        console.error("Error al cargar tareas: ", response.data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud de tareas: ", error);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('tasks loades!')
        resolve(this.tasks)
      }, 500)
    })
  }

}