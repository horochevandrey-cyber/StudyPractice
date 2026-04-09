// POST /api/request
// Body: { email, phone, comment }
// Response: { message }

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, phone, comment } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email обязателен' });
  }

  const sql = neon(process.env.DATABASE_URL);

  await sql`
    INSERT INTO requests (user_email, phone, comment, created_at)
    VALUES (${email}, ${phone || ''}, ${comment || ''}, NOW())
  `;

  res.status(200).json({ message: 'Заявка отправлена' });
}
