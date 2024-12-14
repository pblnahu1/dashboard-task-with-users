
import { PORT, API_URL, API_KEY_SUPABASE } from '../backend/api/rutas.js'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bbjrnmzufjjhqxgrstzb.supabase.co'
const supabaseKey = API_KEY_SUPABASE
const supabase = createClient(supabaseUrl, supabaseKey)

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'

// hago esto por el tipo (type:module)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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


// ruta estática
app.use(paths.pUploads, express.static(path.join(__dirname, 'uploads')))



// SUPABASE REGISTER
app.post(paths.pRegister, upload.single('iconProfile'), async (req, res) => {
  const { nombreApellido, email, password } = req.body;
  const iconProfile = req.file ? req.file.filename : null;

  if (!nombreApellido || !email || !password) {
    return res.status(400).json({ success: false, error: "Faltan datos." });
  }

  const { data, error } = await supabase
    .from('usuarios')
    .insert([
      { nombre_apellido: nombreApellido, email, password, icon_profile: iconProfile }
    ]);

  if (error) {
    return res.status(500).json({ success: false, error: "Error en la inserción", details: error.message });
  }

  return res.status(200).json({ success: true, message: "¡Registrado Exitosamente!" });
});



// SUPABASE LOGIN
app.post(paths.pLogin, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Faltan datos." });
  }

  const { data: users, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .eq('password', password);

  if (error) {
    return res.status(500).json({ success: false, error: "Error en el servidor", details: error.message });
  }

  if (users.length > 0) {
    const user = users[0];
    const iconUrl = user.icon_profile ? `${API_URL}/uploads/${user.icon_profile}` : null;
    return res.status(200).json({
      success: true,
      message: "¡Bienvenido!",
      nombreApellido: user.nombre_apellido,
      iconProfile: iconUrl,
      userId: user.id_usuario
    });
  } else {
    return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
  }
});



// SUPABASE CREAR TAREAS
app.post(paths.pTasksPost, async (req, res) => {
  const { name, color, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ success: false, message: "Faltan datos." });
  }

  const { data, error } = await supabase
    .from('tareas')
    .insert([
      { nombre: name, color: color || '#ffffff', id_usuario: userId }
    ]);

  if (error) {
    return res.status(500).json({ success: false, message: 'Error en el servidor (POST)', details: error.message });
  }

  return res.status(200).json({ success: true, message: 'Tarea guardada exitosamente.' });
});



// SUPABASE OBTENER TAREAS
app.get(paths.pTasksGet, async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ success: false, message: "No se proporcionó un ID de usuario" });
  }

  const { data: tasks, error } = await supabase
    .from('tareas')
    .select('id_tarea as id, nombre as name, color, completado as completed')
    .eq('id_usuario', userId);

  if (error) {
    return res.status(500).json({ success: false, message: 'Error en el servidor (GET)', details: error.message });
  }

  return res.status(200).json({ success: true, tasks });
});




// app.put(paths.pTasksPut, (req, res) => {
//   const { id } = req.params;
//   const { name, color, completed } = req.body;
//   const sql = `UPDATE TAREAS SET NOMBRE = ?, COLOR = ?, COMPLETADO = ? WHERE ID_TAREA = ?`;
//   db.query(sql, [name, color || '#ffffff', completed, id], (err, result) => {
//     if (err) {
//       console.error("Error al editar la tarea:", err);
//       return res.status(500).json({ success: false, message: 'Error en el servidor. (PUT)' });
//     }

//     res.status(200).json({ success: true, message: 'Tarea actualizada correctamente' });
//   });
// });



// app.delete(paths.pTasksDelete, (req, res) => {
//   const { id } = req.params;
//   const sql = `DELETE FROM TAREAS WHERE ID_TAREA = ?`;

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error("Error en eliminar una tarea: ", err);
//       res.status(500).json({ success: false, message: "Error en el servidor. (DELETE)" })
//     }

//     res.status(200).json({ success: true, message: 'Tarea eliminada correctamente' });
//   })
// })




app.listen(PORT, () => {
  if (app && typeof app.listen === 'function') {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  } else {
    console.error('Error al iniciar el servidor con puerto ', PORT);
  }
});
