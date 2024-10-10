

--------------- Alters
ALTER TABLE usuarios ADD COLUMN icon_profile VARCHAR(255);

ALTER TABLE usuarios MODIFY COLUMN icon_profile TEXT NOT NULL;




--------------- Updates
UPDATE usuarios
SET icon_profile = 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQI7iw6Bg9aNVGQJVzBfX4b3IA3zo5cyzqf0bnz2zEA7y-Sw9lF7na5iij6bIv-g48o8dtmPI_b6FlPHFs' WHERE ID_USUARIO = 1 AND NOMBRE_APELLIDO = 'Javier';





--------------- Selects
SELECT * FROM usuarios

SELECT * FROM TAREAS WHERE ID_USUARIO = 83

SELECT ID_TAREA as id, NOMBRE as name, COLOR as color, COMPLETADO as completed FROM TAREAS WHERE ID_USUARIO = 83



--------------- Deletes / Truncates


--------------- Describe
DESCRIBE TAREAS;

DESCRIBE USUARIOS;