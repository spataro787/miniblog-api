# MiniBlog API

API REST para gestionar autores y publicaciones, desarrollada con Node.js, Express y PostgreSQL.

## Funcionalidades

- CRUD de autores y publicaciones.
- Consulta de publicaciones por autor.
- Validación de campos e IDs.
- Consultas SQL parametrizadas.
- Documentación interactiva con Swagger.
- Scripts para preparar la base y cargar ejemplos.
- Pruebas con Vitest.

## Tecnologías

Node.js, Express, PostgreSQL, node-postgres, express-validator, Swagger y Vitest.

## Requisitos

- Node.js y npm. Proyecto probado con Node.js 24.
- PostgreSQL en ejecución.
- Git.

## Instalación local

```bash
git clone https://github.com/spataro787/miniblog-api.git
cd miniblog-api
npm install
```

Copiá el archivo de configuración de ejemplo. En Git Bash:

```bash
cp .env.example .env
```

Configurá `.env` con tus credenciales locales:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@127.0.0.1:5432/miniblog-api"
PORT=3000
NODE_ENV=development
```

Reemplazá `TU_PASSWORD` por tu contraseña y ajustá el puerto si corresponde.
Los caracteres especiales de la contraseña deben codificarse para usarlos
en la URL. No subas `.env` al repositorio.

## Preparar la base de datos

Para crear la base si no existe, preparar las tablas y cargar ejemplos:

```bash
node src/scripts/create-and-seed.js
```

Este script está preparado para PostgreSQL local. El usuario necesita
permiso para crear bases de datos si la base todavía no existe.

Si la base ya existe y solo querés preparar su estructura:

```bash
node init-db.js
```

Para cargar únicamente los ejemplos en una base ya preparada:

```bash
node src/scripts/seed-safe.js
```

La carga de ejemplos evita repetir autores por email y publicaciones
por título y autor. No elimina registros existentes.

## Comprobar la conexión

```bash
node src/db/test-db.js
```

Si la conexión funciona, muestra `✅ CONEXIÓN OK` y la fecha del servidor.

## Iniciar la API

Durante el desarrollo:

```bash
npm run dev
```

Nodemon reinicia el servidor al guardar cambios.

Para iniciar sin Nodemon:

```bash
npm start
```

Con `PORT=3000`, la API está disponible en:

http://localhost:3000

PostgreSQL y el servidor Node.js deben estar en ejecución.
No es necesario mantener pgAdmin abierto.

## Pruebas

Ejecutar los tests una vez:

```bash
npm test -- --run
```

Ejecutarlos en modo interactivo:

```bash
npm test
```

## Documentación

Con la API iniciada, abrí:

http://localhost:3000/api-docs

La documentación interactiva se genera desde los comentarios Swagger
de los archivos de rutas.

El proyecto también contiene documentación en `docs/`.
Para ejecutar el generador de documentación:

```bash
npm run generate-docs
```

## Endpoints

| Método | Ruta | Función |
|---|---|---|
| GET | `/authors` | Listar autores |
| GET | `/authors/:id` | Consultar un autor |
| POST | `/authors` | Crear un autor |
| PUT | `/authors/:id` | Editar un autor |
| DELETE | `/authors/:id` | Eliminar un autor |
| GET | `/posts` | Listar publicaciones |
| GET | `/posts/:id` | Consultar una publicación |
| GET | `/posts/author/:authorId` | Consultar publicaciones de un autor |
| POST | `/posts` | Crear una publicación |
| PUT | `/posts/:id` | Editar una publicación |
| DELETE | `/posts/:id` | Eliminar una publicación |
| GET | `/test` | Comprobar la conexión con PostgreSQL |

## Ejemplos

Crear un autor con `POST /authors`:

```json
{
  "name": "Autor de ejemplo",
  "email": "autor@example.com",
  "bio": "Descripción del autor"
}
```

Crear una publicación con `POST /posts`:

```json
{
  "title": "Mi publicación",
  "content": "Contenido de ejemplo",
  "author_id": 1,
  "published": true
}
```

Reemplazá `author_id` por el ID de un autor existente.

Para editar un autor, enviá nombre y email.
Para editar una publicación, podés enviar los campos que querés cambiar.
`published` debe ser un booleano JSON: `true` o `false`.

## Estructura

| Ubicación | Función |
|---|---|
| `src/routes/` | Rutas y validaciones |
| `src/controllers/` | Coordinación de peticiones y respuestas |
| `src/models/` | Consultas SQL |
| `src/db/` | Conexión y prueba de PostgreSQL |
| `src/middleware/` | Manejo de errores |
| `src/scripts/` | Preparación y carga de la base |
| `src/services/setup.sql` | Tablas y ajustes del esquema |
| `src/services/seed.sql` | Datos de ejemplo |
| `tests/` | Pruebas automáticas |
| `src/app.js` | Configuración de Express |
| `src/server.js` | Inicio del servidor |

El esquema incluye `authors`, `posts` y `comments`.
La API actual expone autores y publicaciones; comentarios no tiene endpoints.

Eliminar un autor también elimina sus publicaciones y los comentarios
relacionados, según las relaciones `ON DELETE CASCADE` del esquema.

## Seguridad y alcance

- Validación de entradas con express-validator.
- Consultas parametrizadas en los modelos.
- Credenciales configuradas mediante variables de entorno.
- `.env` excluido de Git.

CORS está habilitado y no reemplaza la autenticación.
La API actual no incluye autenticación ni control de permisos.

## Despliegue

La versión local fue comprobada.
La reactivación del despliegue en Railway está pendiente.

## Autor

Agustín Spataro

- GitHub: https://github.com/spataro787
- LinkedIn: https://www.linkedin.com/in/agustin-spataro-dev/