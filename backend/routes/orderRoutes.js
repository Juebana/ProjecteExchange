const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.post('/orders', async (req, res) => {
  const { userId, tradeSide, tradeType, price, amount, currency } = req.body;
  if (!userId || !tradeSide || !tradeType || !amount) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const db = req.db;
  const id = uuidv4();
  const query = 'INSERT INTO orders (id, userId, tradeSide, tradeType, price, amount, currency) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [id, userId, tradeSide, tradeType, price, amount, currency || 'usdc'];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error.' });
    }
    res.status(201).json({ id, userId, tradeSide, tradeType, price, amount, currency: currency || 'usdc', created_at: new Date() });
  });
});

module.exports = router;
