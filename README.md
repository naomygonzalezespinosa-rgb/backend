# Sistema de Biblioteca Escolar

Proyecto web para administrar una biblioteca escolar. Permite registrar usuarios, consultar catalogo de libros, controlar prestamos, confirmar devoluciones y revisar reportes basicos.

## Integrante

- Naomy Gonzalez Espinosa - 22224038

## Modulos del proyecto

- Libros: catalogo escolar con codigo, autor, editorial, categoria, descripcion, stock y disponibilidad.
- Categorias: clasificacion de libros por area academica.
- Usuarios: estudiantes, bibliotecarios y administradores con matricula, email y rol.
- Prestamos: registro de libros prestados a estudiantes con fecha limite y estado.
- Devoluciones: confirmacion de entrega, estado fisico del libro y observaciones.

## Instalacion

1. Crear la base de datos importando `backend/database/biblioteca_escolar.sql` en MySQL.
2. Entrar a la carpeta del backend:

```bash
cd backend
npm install
npm run dev
```

3. Abrir el frontend con Live Server desde la carpeta `frontend`.

## Variables de entorno

El archivo `backend/.env` debe contener:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=biblioteca_escolar
JWT_SECRET=cambia_este_secreto
JWT_EXPIRES=1h
```

## Usuario de prueba

- Email: `naomy@biblioteca.com`
- Password: `admin123`
- Rol: `administrador`

## Endpoints de autenticacion

- `POST /api/auth/registro`
- `POST /api/auth/login`

## Ruta de inicio

- `GET /api/inicio`

Responde mensaje de bienvenida, fecha del servidor, lista de modulos y resumen dinamico desde la base de datos.

## Endpoints de libros

- `GET /api/libros`
- `GET /api/libros/:id`
- `POST /api/libros`
- `PUT /api/libros/:id`
- `DELETE /api/libros/:id`
- Extra: `GET /api/libros/buscar/catalogo?q=texto`
- Extra: `GET /api/libros/disponibles/catalogo`

## Endpoints de categorias

- `GET /api/categorias`
- `GET /api/categorias/:id`
- `POST /api/categorias`
- `PUT /api/categorias/:id`
- `DELETE /api/categorias/:id`
- Extra: `GET /api/categorias/con-libros/resumen`

## Endpoints de usuarios

- `GET /api/usuarios`
- `GET /api/usuarios/:id`
- `POST /api/usuarios`
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`
- Extra: `GET /api/usuarios/rol/:rol`

## Endpoints de prestamos

- `GET /api/prestamos`
- `GET /api/prestamos/:id`
- `POST /api/prestamos`
- `PUT /api/prestamos/:id`
- `DELETE /api/prestamos/:id`
- Extra: `GET /api/prestamos/activos/lista`
- Extra: `GET /api/prestamos/usuario/:usuarioId`

## Endpoints de devoluciones

- `GET /api/devoluciones`
- `GET /api/devoluciones/:id`
- `POST /api/devoluciones`
- `PUT /api/devoluciones/:id`
- `DELETE /api/devoluciones/:id`
- Extra: `GET /api/devoluciones/estado/:estado`

## Frontend

El frontend incluye:

- `index.html`: landing publica.
- `registro.html`: registro de usuario.
- `login.html`: inicio de sesion.
- `inicio.html`: panel principal post-login.
- `libros.html`, `libros-registrar.html`, `libros-editar.html`, `detalle-libro.html`.
- `prestamos.html`, `prestamos-registrar.html`, `prestamos-editar.html`, `mis-prestamos.html`.
- `devoluciones.html`, `usuarios.html`, `reportes.html`, `perfil.html`.
