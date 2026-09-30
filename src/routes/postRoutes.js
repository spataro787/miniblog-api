import express from 'express';
import { body, validationResult } from 'express-validator';

import {
  getPosts,
  getPost,
  getAuthorPosts,
  createNewPost,
  updateExistingPost,
  deleteExistingPost,
} from '../controllers/postController.js';

const router = express.Router();

const validatePost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('El contenido es requerido'),
  body('author_id')
    .isInt()
    .withMessage('author_id debe ser un número entero'),
  body('published')
    .optional()
    .isBoolean({ strict: true })
    .withMessage('published debe ser booleano'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};
router.param('id', (req, res, next, id) => {
  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
      error: 'El ID debe ser un número entero positivo',
    });
  }

  next();
});

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtener todos los posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts
 */
router.get('/', getPosts);

/**
 * @swagger
 * /posts/author/{authorId}:
 *   get:
 *     summary: Obtener posts de un autor
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Posts del autor
 */
router.get('/author/:authorId', getAuthorPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Obtener un post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del post
 *       404:
 *         description: Post no encontrado
 */
router.get('/:id', getPost);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crear un nuevo post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - author_id
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author_id:
 *                 type: integer
 *               published:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Post creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Autor no existe
 */
router.post(
  '/',
  validatePost,
  handleValidationErrors,
  createNewPost
);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Actualizar un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Post actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Post no encontrado
 */
router.put(
  '/:id',
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El título no puede estar vacío'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El contenido no puede estar vacío'),
  body('published')
    .optional()
    .isBoolean({ strict: true })
    .withMessage('published debe ser booleano'),
  handleValidationErrors,
  updateExistingPost
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Eliminar un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post eliminado
 *       404:
 *         description: Post no encontrado
 */
router.delete('/:id', deleteExistingPost);

export default router;