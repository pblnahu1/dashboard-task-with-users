import { API_KEY_SUPABASE } from '../api/rutas.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// Supabase
const supabaseUrl = 'https://bbjrnmzufjjhqxgrstzb.supabase.co';
const supabaseKey = API_KEY_SUPABASE;
const supabase = createClient(supabaseUrl, supabaseKey);

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

        const { error } = await supabase
          .from('tareas')
          .update({ nombre: name, color, completado: task.completed })
          .eq('id_tarea', this.edicionTaskId);

        if (error) {
          console.error("Error al actualizar la tarea:", error.message);
        } else {
          console.log("Tarea actualizada con éxito.");
        }

        this.edicionTaskId = null;
      }
    } else {
      const task = {
        name,
        color: color || '#ffffff',
        completed: false,
        userId
      };
      const { data, error } = await supabase
        .from('tareas')
        .insert([{ nombre: name, color, completado: false, id_usuario: userId }]);

      if (error) {
        console.error("Error al crear la tarea:", error.message);
      } else {
        console.log("Tarea creada con éxito:", data);
      }
    }

    this.renderTasks();
  }

  async toggleTaskCompletion(id) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;

      const { error } = await supabase
        .from('tareas')
        .update({ completado: task.completed })
        .eq('id_tarea', id);

      if (error) {
        console.error("Error al actualizar el estado de la tarea:", error.message);
      } else {
        console.log("Estado de la tarea actualizado con éxito.");
      }

      this.renderTasks();
    }
  }

  async deleteTask(id) {
    const { error } = await supabase
      .from('tareas')
      .delete()
      .eq('id_tarea', id);

    if (error) {
      console.error("Error al eliminar la tarea:", error.message);
    } else {
      console.log("Tarea eliminada con éxito.");
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.renderTasks();
    }
  }

  editTask(id) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      document.getElementById('task-name').value = task.name;
      this.edicionTaskId = id;
    }
  }

  async renderTasks() {
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
        }
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
      if (!task.id || !task.name || !task.color) {
        console.error("Datos inválidos en la tarea:", task);
        return;
      }

      const { id, name, color, completed } = task;

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
      });

      containerButtons.appendChild(toggleButton);
      containerButtons.appendChild(editButton);
      containerButtons.appendChild(deleteButton);
      containerTasks.appendChild(taskItem);
    });
  }

  async loadTasks(userId) {
    if (!userId) {
      console.error("El userId no es válido:", userId);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tareas')
        .select('id_tarea, nombre, color, completado')
        .eq('id_usuario', userId);

      if (error) {
        console.error("Error al cargar tareas:", error.message);
      } else {
        this.tasks = data.map(task => ({
          id: task.id_tarea,
          name: task.nombre,
          color: task.color,
          completed: task.completado
        }));
        this.renderTasks();
      }
    } catch (error) {
      console.error("Error al cargar las tareas:", error.message);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('tasks loaded!');
        resolve(this.tasks);
      }, 500);
    });
  }
}
