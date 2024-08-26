CREATE DATABASE db_gestion_de_tareas;

USE db_gestion_de_tareas;

CREATE TABLE IF NOT EXISTS USUARIOS(
    ID_USUARIO INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NOMBRE_APELLIDO VARCHAR(100) NOT NULL,
    EMAIL VARCHAR(50) NOT NULL UNIQUE,
    PASSWORD VARCHAR(50) NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

INSERT INTO USUARIOS (NOMBRE_APELLIDO, EMAIL, PASSWORD) VALUES ('Javier', 'pXQp3@example.com', '123456');