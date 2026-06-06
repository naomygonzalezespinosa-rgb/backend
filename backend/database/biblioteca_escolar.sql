DROP DATABASE IF EXISTS biblioteca_escolar;
CREATE DATABASE biblioteca_escolar;
USE biblioteca_escolar;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  matricula VARCHAR(30) UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('estudiante', 'bibliotecario', 'administrador') NOT NULL DEFAULT 'estudiante',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE libros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  autor VARCHAR(120) NOT NULL,
  editorial VARCHAR(120),
  anio INT,
  categoria_id INT,
  codigo VARCHAR(40) NOT NULL UNIQUE,
  descripcion TEXT,
  stock INT NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE prestamos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  libro_id INT NOT NULL,
  fecha_prestamo DATE NOT NULL,
  fecha_devolucion DATE NOT NULL,
  estado ENUM('activo', 'devuelto', 'vencido') NOT NULL DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (libro_id) REFERENCES libros(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE devoluciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prestamo_id INT NOT NULL,
  fecha_devolucion_real DATE NOT NULL,
  estado_libro ENUM('bueno', 'danado', 'perdido') NOT NULL DEFAULT 'bueno',
  observaciones TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (prestamo_id) REFERENCES prestamos(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- Password para todos los usuarios de prueba: admin123
INSERT INTO usuarios (nombre, matricula, email, password, rol) VALUES
('Naomy Gonzalez Espinosa', '22224038', 'naomy@biblioteca.com', '$2a$10$bktyL6kDL7BZf6Sa1ztV7.s8fP0HZA9x23eYP2R5k4Z0rCIWEDHWW', 'administrador'),
('Mariana Lopez Reyes', '22224011', 'mariana.lopez@escuela.edu', '$2a$10$bktyL6kDL7BZf6Sa1ztV7.s8fP0HZA9x23eYP2R5k4Z0rCIWEDHWW', 'estudiante'),
('Carlos Mendez Ruiz', '22224012', 'carlos.mendez@escuela.edu', '$2a$10$bktyL6kDL7BZf6Sa1ztV7.s8fP0HZA9x23eYP2R5k4Z0rCIWEDHWW', 'estudiante'),
('Lucia Hernandez Soto', '22224013', 'lucia.hernandez@escuela.edu', '$2a$10$bktyL6kDL7BZf6Sa1ztV7.s8fP0HZA9x23eYP2R5k4Z0rCIWEDHWW', 'estudiante'),
('Rafael Torres Neri', 'BIB001', 'rafael.torres@biblioteca.com', '$2a$10$bktyL6kDL7BZf6Sa1ztV7.s8fP0HZA9x23eYP2R5k4Z0rCIWEDHWW', 'bibliotecario');

INSERT INTO categorias (nombre, descripcion) VALUES
('Literatura', 'Novelas, cuentos, poesia y lecturas recreativas'),
('Ciencias', 'Material de ciencias naturales, biologia, fisica y quimica'),
('Historia', 'Libros de historia nacional, universal y regional'),
('Matematicas', 'Algebra, calculo, geometria y razonamiento matematico'),
('Tecnologia', 'Programacion, redes, bases de datos y cultura digital');

INSERT INTO libros (titulo, autor, editorial, anio, categoria_id, codigo, descripcion, stock) VALUES
('El principito', 'Antoine de Saint-Exupery', 'Salamandra', 1943, 1, 'LIB-LIT-001', 'Relato literario sobre amistad, imaginacion y responsabilidad.', 5),
('Cien anos de soledad', 'Gabriel Garcia Marquez', 'Diana', 1967, 1, 'LIB-LIT-002', 'Novela representativa del realismo magico latinoamericano.', 3),
('Biologia 1', 'Teresa Audesirk', 'Pearson', 2018, 2, 'LIB-CIE-001', 'Texto introductorio para estudiar celulas, ecosistemas y evolucion.', 6),
('Historia minima de Mexico', 'Daniel Cosio Villegas', 'El Colegio de Mexico', 1973, 3, 'LIB-HIS-001', 'Panorama general de la historia de Mexico.', 4),
('Fundamentos de bases de datos', 'Abraham Silberschatz', 'McGraw Hill', 2019, 5, 'LIB-TEC-001', 'Conceptos de modelos relacionales, SQL y diseno de bases de datos.', 2);

INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, fecha_devolucion, estado) VALUES
(2, 1, '2026-05-20', '2026-06-03', 'vencido'),
(3, 3, '2026-05-28', '2026-06-10', 'activo'),
(4, 5, '2026-05-29', '2026-06-12', 'activo'),
(2, 4, '2026-05-10', '2026-05-24', 'devuelto'),
(3, 2, '2026-05-12', '2026-05-26', 'devuelto'),
(4, 1, '2026-05-01', '2026-05-15', 'devuelto'),
(2, 5, '2026-04-26', '2026-05-10', 'devuelto'),
(3, 4, '2026-04-20', '2026-05-04', 'devuelto');

INSERT INTO devoluciones (prestamo_id, fecha_devolucion_real, estado_libro, observaciones) VALUES
(4, '2026-05-23', 'bueno', 'Libro entregado un dia antes de la fecha limite.'),
(5, '2026-05-27', 'bueno', 'Entrega con un dia de retraso sin dano.'),
(6, '2026-05-15', 'danado', 'Portada doblada, requiere revision del bibliotecario.'),
(7, '2026-05-10', 'bueno', 'Devolucion registrada durante revision de inventario.'),
(8, '2026-05-05', 'bueno', 'Entrega revisada y archivada por el bibliotecario.');
