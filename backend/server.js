
/**
 * CORS es importante cuando tu frontend y backend están en diferentes dominios o puertos. Sin él, las solicitudes entre dominios podrían ser bloqueadas por el navegador debido a las políticas de seguridad.
 */

// inicializo variables globales
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express() // inicializo una instancia para ejecutar el servidor
app.use(express.json()) // middleware para parsear el body (sin este middleware el body seria undefined)
app.use(cors()) // para habilitar CORS y permite que otros origenes consuman el servidor

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_gestion_de_tareas'
})

app.post('/register', (req, res) => {
    const { nombreApellido, email, password } = req.body;
    if (!nombreApellido || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO USUARIOS (NOMBRE_APELLIDO, EMAIL, PASSWORD) VALUES (?, ?, ?)";
    db.query(sql, [nombreApellido, email, password], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json({ message: "Registrado Exitosamente" });
    });
});

// probar el server
app.listen(8081, () => {
    console.log("Listening on port 8081...");
});
