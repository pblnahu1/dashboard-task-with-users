
const express = require('express')

const mysql = require('mysql')

const cors = require('cors')

const app = express()

const PORT = 8081;

app.use(express.json())

app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));

app.use((request, response, next) => {
  response.set('Cache-Control', 'no-store');
  next();
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_gestion_de_tareas'
})

app.post('/register', (req, res) => {
    const { nombreApellido, email, password, iconProfile } = req.body;

    if (!nombreApellido || !email || !password) {
        if (!nombreApellido) return res.status(400).json({success: false, error: "El nombre es obligatorio" });

        if (!email) return res.status(400).json({success: false, error: "El Email es obligatorio" });

        if (!password) return res.status(400).json({success: false, error: "La contraseña es obligatoria" });

        if (password.length < 6) return res.status(400).json({success: false, error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const sql = "INSERT INTO USUARIOS (NOMBRE_APELLIDO, EMAIL, PASSWORD, icon_profile) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [nombreApellido, email, password, iconProfile], (err, data) => {
        if (err) {
            console.error("Error en la inserción: ", err);
            return res.status(500).json({ success: false, error: "Error en el servidor", details: err });
        }
        return res.status(200).json({success:true, message: "¡Registrado Exitosamente!" });
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
        
        if (data.length > 0) {
            const user = data[0];
            return res.status(200).json({
                success: true,
                message: "¡Bienvenido!",
                nombreApellido: user.NOMBRE_APELLIDO,
                imgIconProfile: user.icon_profile
            });
        } else {
            return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    });
});

app.listen(PORT, () => {
    if (app && typeof app.listen === 'function') {
        console.log(`Server running on port ${PORT}`);
    } else {
        console.error('Failed to start server on port ', PORT);
    }
});
