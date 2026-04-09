// POST /api/auth/login
// Body: { email, password }
// Response: { user: { id, name, email } }

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  const sql = neon(process.env.DATABASE_URL);

  const result = await sql`
    SELECT id, name, email, created_at FROM users
    WHERE email = ${email} AND password = ${password}
  `;

  if (result.length === 0) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  const user = result[0];

  res.status(200).json({
    user: { id: user.id, name: user.name, email: user.email },
    message: 'С возвращением, ' + user.name + '!'
  });
}
