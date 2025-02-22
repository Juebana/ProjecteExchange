const express = require('express');
const router = express.Router();

router.post('/postOrder', async (req, res) => {
  const { userId, tradeSide, tradeType, price, amount, currency } = req.body;

  if (!userId || !tradeSide || !tradeType || !amount) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const db = req.db; 
  const query = 'INSERT INTO orders (userId, tradeSide, tradeType, price, amount, currency) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [userId, tradeSide, tradeType, price, amount, currency || 'usdc'];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error.' });
    }
    res.json({ message: 'Order created successfully', orderId: results.insertId });
  });
});

module.exports = router;
