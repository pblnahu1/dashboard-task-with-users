
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_apellido VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    icon_profile TEXT NOT NULL
);

CREATE TABLE tareas (
    id_tarea SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    nombre VARCHAR(255),
    color VARCHAR(7),
    completado BOOLEAN DEFAULT FALSE
);
