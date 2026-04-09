// POST /api/auth/register
// Body: { name, email, password }
// Response: { user: { id, name, email }, token }

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Пароль минимум 6 символов' });
  }

  const sql = neon(process.env.DATABASE_URL);

  // Check existing
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    return res.status(409).json({ error: 'Такой email уже зарегистрирован' });
  }

  // Insert user
  const result = await sql`
    INSERT INTO users (name, email, password, created_at)
    VALUES (${name}, ${email}, ${password}, NOW())
    RETURNING id, name, email, created_at
  `;

  const user = result[0];

  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email },
    message: 'Регистрация успешна'
  });
}
