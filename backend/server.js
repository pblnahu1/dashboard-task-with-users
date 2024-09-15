
/**
 * 
 * Lado del servidor y bd (backend)
 * 
 * CORS es importante cuando tu frontend y backend están en diferentes dominios o puertos. Sin él, las solicitudes entre dominios podrían ser bloqueadas por el navegador debido a las políticas de seguridad.
 */

// inicializo variables globales
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express() // inicializo una instancia para ejecutar el servidor
const PORT = 8081;
app.use(express.json()) // middleware para parsear el body (sin este middleware el body seria undefined)
app.use(cors({
    origin: '*',
    // origin: 'http://localhost:3000',
    // origin: 'http://localhost:8081',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    // credentials: true
})); // para habilitar CORS y permite que otros origenes consuman el servidor
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
});

// conexion a la db
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_gestion_de_tareas'
})

// solicitud de post con el endpoint `/register` y manejo de errores
app.post('/register', (req, res) => {
    const { nombreApellido, email, password } = req.body; // obtengo los datos q ingresa el usuario
    // manejo de errores en el endpoint de registro (`/register`)
    // si el usuario no envia todos los datos, lanza errores de estados
    if (!nombreApellido || !email || !password) {
        if (!nombreApellido) return res.status(400).json({success: false, error: "El nombre es obligatorio" });

        if (!email) return res.status(400).json({success: false, error: "El Email es obligatorio" });

        if (!password) return res.status(400).json({success: false, error: "La contraseña es obligatoria" });

        if (password.length < 6) return res.status(400).json({success: false, error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const sql = "INSERT INTO USUARIOS (NOMBRE_APELLIDO, EMAIL, PASSWORD) VALUES (?, ?, ?)";
    // manejo del resultado de inserción en la bd
    db.query(sql, [nombreApellido, email, password], (err, data) => {
        if (err) {
            console.error("Error en la inserción: ",err);
           return res.status(500).json({success: false, error: "Error en el servidor", details: err });
        } // manejo de error de servidor
        return res.status(200).json({success:true, message: "¡Registrado Exitosamente!" }); // estado OK 200 y el mensaje
    });
});

app.post('/login', (req, res) => {
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
        
        // Manejo para la autenticación correcta del usuario...
        if (data.length > 0) {
            const user = data[0];
            return res.status(200).json({
                success: true,
                message: "¡Bienvenido!",
                nombreApellido: user.NOMBRE_APELLIDO
            });
        } else {
            return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    });
});

// probar el server
app.listen(PORT, () => {
    if (app && typeof app.listen === 'function') {
        console.log(`Server running on port ${PORT}`);
    } else {
        console.error('Failed to start server on port ', PORT);
    }
});
