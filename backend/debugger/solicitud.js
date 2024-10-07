
////////////////////////////////////////
// codigo para probar la solicitud del cliente al servidor desde la consola...
// inserta una tarea desde la api para probar.. ejecutarlo cuando no funcione la solicitud cliente-servidor
////////////////////////////////////////

import { API_URL } from "../../api/rutas.js";

const taskData = {
  name: 'Nueva Tarea',
  color: '#ff0000', // Rojo como ejemplo
  userId: 1 // ID de usuario, este debe existir en la base de datos
};

fetch(`${API_URL}/tasks`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(taskData)
})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Tarea insertada correctamente:', data.message);
    } else {
      console.error('Error al insertar tarea:', data.message);
    }
  })
  .catch(error => {
    console.error('Error en la solicitud:', error);
  });
