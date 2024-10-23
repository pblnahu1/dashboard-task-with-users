
import { PORT, API_URL } from '../api/rutas.js'

import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

const app = express()

app.use(express.json())

app.use(cors({
  origin: '*',
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));

app.use((request, response, next) => {
  response.set('Cache-Control', 'no-store');
  next();
});

const paths = {
  pUploadsConfigMulter: './uploads',
  pUploads: '/uploads',
  pRegister: '/register',
  pLogin: '/login',
  pTasksPost: '/tasks',
  pTasksGet: '/tasks/:userId',
  pTasksPut: '/tasks/:id',
  pTasksDelete: '/tasks/:id'
}

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, paths.pUploadsConfigMulter) // acá se guardarán
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 159)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // limite de 1mb
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true)

    } else {
      cb(new Error('Solo se permiten imágenes'))
    }
  }
})

// crear directorio si no existe
if (!fs.existsSync(paths.pUploadsConfigMulter)) {
  fs.mkdirSync(paths.pUploadsConfigMulter)
}

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_gestion_de_tareas'
})

// ruta estática
app.use(paths.pUploads, express.static('uploads'))

app.post(paths.pRegister, upload.single('iconProfile'), (req, res) => {

  if (req.fileValidationError) {
    return res.status(400).json({ success: false, error: req.fileValidationError })
  }

  console.log("Body:", req.body)
  console.log("File:", req.file)

  const { nombreApellido, email, password } = req.body;
  const iconProfile = req.file ? req.file.filename : null;

  if (!nombreApellido || !email || !password) {
    if (!nombreApellido) return res.status(400).json({ success: false, error: "El nombre es obligatorio" });
    if (!email) return res.status(400).json({ success: false, error: "El Email es obligatorio" });
    if (!password) return res.status(400).json({ success: false, error: "La contraseña es obligatoria" });
    if (password.length < 6) return res.status(400).json({ success: false, error: "La contraseña debe tener al menos 6 caracteres" });
  }

  const sql = "INSERT INTO USUARIOS (NOMBRE_APELLIDO, EMAIL, PASSWORD, icon_profile) VALUES (?, ?, ?, ?)";

  db.query(sql, [nombreApellido, email, password, iconProfile], (err, data) => {
    if (err) {
      console.error("Error en la inserción: ", err);
      return res.status(500).json({ success: false, error: "Error en el servidor", details: err });
    }
    return res.status(200).json({ success: true, message: "¡Registrado Exitosamente!" });
  });
});

app.post(paths.pLogin, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    if (!email) return res.status(400).json({ success: false, error: "El Email es obligatorio" });
    if (!password) return res.status(400).json({ success: false, error: "La contraseña es obligatoria" });
  }

  const sql = "SELECT * FROM USUARIOS WHERE EMAIL = ? AND PASSWORD = ?";
  db.query(sql, [email, password], (err, data) => {
    if (err) {
      console.error("Error en la selección: ", err);
      return res.status(500).json({ success: false, error: "Error en el servidor", details: err });
    }

    if (data.length > 0) {
      const user = data[0];
      const iconUrl = user.icon_profile ? `${API_URL}/uploads/${user.icon_profile}` : null;
      return res.status(200).json({
        success: true,
        message: "¡Bienvenido!",
        nombreApellido: user.NOMBRE_APELLIDO,
        iconProfile: iconUrl,
        userId: user.ID_USUARIO
      });
    } else {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  });
});

app.post(paths.pTasksPost, (req, res) => {
  const { name, color, userId } = req.body;
  if (!name || !userId) {
    return res.status(400).json({ success: false, message: "Hubo un error con enviar las tareas. Faltan datos." })
  }

  const sql = `INSERT INTO TAREAS (NOMBRE, COLOR, ID_USUARIO) VALUES(?,?,?)`;
  db.query(sql, [name, color || '#ffffff', userId], (err, result) => {
    if (err) {
      console.error("Error al insertar tarea en DB:", err);
      return res.status(500).json({ success: false, message: 'Error en el servidor. (POST)' });
    }

    res.status(200).json({ success: true, message: 'Tarea guardada exitosamente.' });
  });
});

app.get(paths.pTasksGet, (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ success: false, message: "No se proporcionó un ID de usuario" });
  }

  const sql = `SELECT ID_TAREA as id, NOMBRE as name, COLOR as color, COMPLETADO as completed FROM TAREAS WHERE ID_USUARIO = ?`;
  db.query(sql, [userId], (err, tasks) => {
    if (err) {
      console.error('Error al obtener tareas: ', err);
      res.status(500).json({ success: false, message: 'Error al obtener los datos del servidor. (GET)' });
    }

    res.status(200).json({ success: true, tasks });
  });
});

app.put(paths.pTasksPut, (req, res) => {
  const { id } = req.params;
  const { name, color, completed } = req.body;
  const sql = `UPDATE TAREAS SET NOMBRE = ?, COLOR = ?, COMPLETADO = ? WHERE ID_TAREA = ?`;
  db.query(sql, [name, color || '#ffffff', completed, id], (err, result) => {
    if (err) {
      console.error("Error al editar la tarea:", err);
      return res.status(500).json({ success: false, message: 'Error en el servidor. (PUT)' });
    }

    res.status(200).json({ success: true, message: 'Tarea actualizada correctamente' });
  });
});

app.delete(paths.pTasksDelete, (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM TAREAS WHERE ID_TAREA = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error en eliminar una tarea: ", err);
      res.status(500).json({ success: false, message: "Error en el servidor. (DELETE)" })
    }

    res.status(200).json({ success: true, message: 'Tarea eliminada correctamente' });
  })
})

app.listen(PORT, () => {
  if (app && typeof app.listen === 'function') {
    console.log(`Server running on port ${PORT}`);
  } else {
    console.error('Failed to start server on port ', PORT);
  }
});
