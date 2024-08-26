const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_gestion_de_tareas'
})

app.post('/register', (req, res) => {
    const sql = "INSERT INTO USUARIOS (NOMBRE_APELLIDO, EMAIL, PASSWORD) VALUES (?, ?, ?)";
    db.query(sql, [req.body.NOMBRE_APELLIDO, req.body.EMAIL, req.body.PASSWORD], (err, data) => { })
})