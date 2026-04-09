// GET  /api/cart?email=xxx  — получить корзину
// POST /api/cart — добавить/обновить корзину
// Body: { email, items: [{ service_key, service_name, price, quantity }] }

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  // GET — получить корзину
  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email обязателен' });

    const result = await sql`
      SELECT id, service_key, service_name, price, quantity, created_at
      FROM cart_items
      WHERE user_email = ${email}
      ORDER BY created_at
    `;

    return res.status(200).json({ items: result });
  }

  // POST — сохранить корзину
  if (req.method === 'POST') {
    const { email, items } = req.body;
    if (!email || !items) {
      return res.status(400).json({ error: 'Email и items обязательны' });
    }

    // Удаляем старую корзину
    await sql`DELETE FROM cart_items WHERE user_email = ${email}`;

    // Вставляем новые items
    for (const item of items) {
      await sql`
        INSERT INTO cart_items (user_email, service_key, service_name, price, quantity, created_at)
        VALUES (${email}, ${item.service_key}, ${item.service_name}, ${item.price}, ${item.quantity}, NOW())
      `;
    }

    return res.status(200).json({ message: 'Корзина сохранена', items });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
