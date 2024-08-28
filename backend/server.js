
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
app.use(express.json()) // middleware para parsear el body (sin este middleware el body seria undefined)
app.use(cors()) // para habilitar CORS y permite que otros origenes consuman el servidor

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
        if (!nombreApellido) return res.status(400).json({ error: "El nombre es obligatorio" });

        if (!email) return res.status(400).json({ error: "El Email es obligatorio" });

        if (!password) return res.status(400).json({ error: "La contraseña es obligatoria" });

        if (password.length < 6) return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const sql = "INSERT INTO USUARIOS (NOMBRE_APELLIDO, EMAIL, PASSWORD) VALUES (?, ?, ?)";
    // manejo del resultado de inserción en la bd
    db.query(sql, [nombreApellido, email, password], (err, data) => {
        if (err) return res.status(500).json({error: "Error en el servidor", details: err}); // manejo de error de servidor
        return res.status(200).json({ message: "¡Registrado Exitosamente!" }); // estado OK 200 y el mensaje
    });
});

// probar el server
app.listen(8081, () => {
    console.log("Server in port 8081...");
});
