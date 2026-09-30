BEGIN;

INSERT INTO authors (name, email, bio) VALUES
  ('Juan Pérez', 'juan@example.com', 'Autor de ejemplo'),
  ('María López', 'maria@example.com', 'Editora y escritora')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (title, content, published, author_id)
SELECT
  examples.title,
  examples.content,
  examples.published,
  authors.id
FROM (
  VALUES
    (
      'Bienvenida al MiniBlog',
      'Este es el primer post de ejemplo.',
      true,
      'juan@example.com'
    ),
    (
      'Segundo post',
      'Contenido del segundo post de ejemplo.',
      false,
      'juan@example.com'
    ),
    (
      'Post de María',
      'Post escrito por María López.',
      true,
      'maria@example.com'
    )
) AS examples(title, content, published, email)
JOIN authors ON authors.email = examples.email
WHERE NOT EXISTS (
  SELECT 1
  FROM posts
  WHERE posts.author_id = authors.id
    AND posts.title = examples.title
);

COMMIT;