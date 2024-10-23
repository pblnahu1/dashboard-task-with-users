# 🚀 Proyecto: Sistema de Gestión de Tareas con Autenticación de Usuarios

Este sistema es una aplicación MERN Stack que permite la gestión de tareas y usuarios mediante autenticación. Se utiliza **Node.js**, **Express**, **MySQL**, **Axios**, **CORS** y **localStorage** para el manejo de la base de datos, autenticación y almacenamiento en el lado del cliente.

## Imágen del Proyecto
![alt text](src/img/screen.png "Muestra Panel")

## Tabla de Contenidos
- [📁 Archivo: `mysql/db.sql`](#📁-archivo-mysqldbsql)
- [📁 Archivo: `backend/server.js`](#📁-archivo-backendserverjs)
- [📁 Archivo: `src/historyObj.js`](#📁-archivo-srchistoryobjjs)
- [📁 Archivo: `src/loader.js`](#📁-archivo-srcloaderjs)
- [📁 Archivo: `src/logoutbutton.js`](#📁-archivo-srclogoutbuttonjs)
- [📁 Archivo: `src/main.js`](#📁-archivo-srcmainjs)
- [📁 Archivo: `src/registro.js`](#📁-archivo-srcregistrojs)
- [📁 Archivo: `src/taskManager.js`](#📁-archivo-srctaskmanagerjs)
- [📁 Archivo: `src/userLogged.mjs`](#📁-archivo-srcuserloggedmjs)
- [📁 Archivo: `src/userManager.js`](#📁-archivo-srcusermanagerjs)
- [📁 Archivo: `src/utils.js`](#📁-archivo-srcutilsjs)

## Características del Proyecto:
- Basic Syntax: Toda la lógica básica de la aplicación estará escrita en JavaScript moderno, utilizando la sintaxis más reciente.

- Events: Implementarás eventos para manejar interacciones del usuario, como hacer clic en botones para agregar nuevas tareas, marcar tareas como completadas, y cambiar entre diferentes vistas.

- Variables (let & const): Utilizarás let y const adecuadamente para manejar variables de estado y constantes en tu código.

- Template Literals: Generarás HTML dinámico utilizando template literals para insertar variables y expresiones directamente en las cadenas de texto.

- Arrow Functions: Utilizarás funciones flecha para crear funciones anónimas y callbacks en eventos y promesas.

- Spread/Rest Operators: Implementarás el operador spread/rest para manejar arrays y objetos, como en la copia de listas de tareas o la combinación de propiedades de un objeto.

- Object/Array Destructuring: Desestructurarás objetos y arrays para acceder fácilmente a las propiedades y valores que necesitas en tu lógica de negocio.

- Class and Objects: Diseñarás clases para manejar la lógica de las tareas y usuarios, utilizando objetos para representar cada entidad. 

- Module Imports/Exports: Dividirás el código en módulos, utilizando import y export para organizar tu aplicación en diferentes archivos.

- Promises, async/await: Implementarás promesas y async/await para manejar operaciones asíncronas, como la simulación de guardar tareas en una base de datos o consultar datos de un servidor.

## Estructura del Proyecto:

- Pantalla Principal: Un dashboard donde se muestran las tareas pendientes y completadas, con un resumen del progreso.
- Gestión de Tareas: Formulario para agregar nuevas tareas.
- Listado de tareas donde se puede marcar como completadas o eliminarlas.
- Posibilidad de editar tareas existentes.
- Gestión de Usuarios (Opcional): Implementación de un sistema simple de usuarios para asignar tareas y ver progreso individual.

## Paso a Paso:
- Configurar el entorno de desarrollo.
- Crear la estructura básica de HTML y enlazar archivos JavaScript.
- Desarrollar el módulo de gestión de tareas con clases y objetos.
- Implementar la funcionalidad de eventos y manipulación del DOM.
- Utilizar promesas y async/await para simular operaciones asíncronas.
- Dividir la lógica en módulos y utilizar imports/exports.
- Estilizar la aplicación con CSS o TailwindCSS/DaisyUI.

---

## 📁 Archivo: `mysql/db.sql`

La base de datos contiene una tabla `USUARIOS` que almacena los datos de los usuarios registrados. Los campos principales incluyen:

- `ID_USUARIO`
- `NOMBRE_APELLIDO`
- `EMAIL`
- `PASSWORD`
- `CREATED_AT`

Se utiliza un esquema sencillo para registrar usuarios en la tabla y probar la funcionalidad de registro y autenticación.

---

## 📁 Archivo: `backend/server.js`

Este archivo es crucial ya que permite la interacción entre el **frontend** y la **base de datos**. Algunas de las características clave incluyen:

- **CORS**: Se utiliza para permitir solicitudes entre diferentes dominios, habilitando la interacción entre el frontend y backend.
  
- **Configuración del servidor**:
  - `app.use(express.json())`: Para parsear el body de las solicitudes HTTP.
  - `app.use(cors({...}))`: Permite el acceso al servidor desde diferentes orígenes.
  - `app.use((req, res, next) => { res.set('Cache-Control', 'no-store'); ... })`: Evita el almacenamiento en caché para gestionar correctamente el historial de navegación.
  
- **Endpoints**:
  - `/register` y `/login`: Gestionan el registro e inicio de sesión de usuarios.
  
- **Manejo de errores**: Implementa diferentes estados de respuesta (`200`, `400`, `401`, `500`) para gestionar los errores y respuestas del servidor.
  
---

## 📁 Archivo: `src/historyObj.js`

Este archivo gestiona el historial de navegación del usuario, detectando si la navegación es desde caché o usando las flechas del historial. Aún se deben resolver algunos problemas de redirección.

---

## 📁 Archivo: `src/loader.js`

Crea una animación de "cargando" para mejorar la interactividad del sistema. Se usa `setTimeout` para manejar el tiempo de carga.

---

## 📁 Archivo: `src/logoutbutton.js`

Configura el botón "Cerrar Sesión", eliminando al usuario logueado del `localStorage`, mejorando la experiencia cuando se desea cambiar de cuenta.

---

## 📁 Archivo: `src/main.js`

Maneja los eventos globales, la carga del dashboard de tareas y la lógica del usuario. Usa `async/await` para gestionar la lógica de las tareas.

---

## 📁 Archivo: `src/registro.js`

Archivo clave para la autenticación del usuario. Usa `axios` para enviar solicitudes POST al servidor en los endpoints `/register` y `/login`, y maneja la respuesta de manera asíncrona. 

---

## 📁 Archivo: `src/taskManager.js`

Maneja la lógica de las tareas usando clases y objetos. Proporciona funcionalidades como:

- `calcularPorcentaje()`: Calcula el porcentaje de tareas completadas.
- `addOrUpdateTask()`: Agrega o actualiza tareas, asignándoles un color y almacenándolas en la base de datos.
- `toggleTaskCompletion(id)`: Marca las tareas como completadas según su ID.
- `deleteTask(id)`: Elimina tareas por su ID.
- `renderTasks()`: Renderiza las tareas en el DOM, manipulando elementos de forma dinámica.

---

## 📁 Archivo: `src/userLogged.mjs`

Módulo para la autenticación de usuarios, gestionando el `localStorage`. Algunas funciones clave incluyen:

1. `saveUserToLS(email, nombreApellido)`: Guarda los datos del usuario en `localStorage`.
2. `getLoggedInUser()`: Recupera los datos del usuario logueado desde `localStorage`.
3. `userLogged(selector)`: Muestra el nombre del usuario logueado en la UI.

El sistema actual solo gestiona un usuario logueado a la vez.

---

## 📁 Archivo: `src/userManager.js`

Módulo para la lógica de gestión de usuarios. (opcional)

---

## 📁 Archivo: `src/utils.js`

Funciones auxiliares para operaciones comunes. (opcional)

---

## Instalaciones / Dependencias
* CORS: `npm install cors`
* EXPRESS: `npm install express`
* AXIOS: `npm install axios`
* MYSQL: `npm install mysql`
* MULTER: `npm install multer`


## Licencia

Este proyecto está bajo la Licencia MIT.
