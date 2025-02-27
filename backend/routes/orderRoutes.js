const express = require('express');
const router = express.Router();

// Create a new order
router.post('/postOrder', async (req, res) => {
  const { userId, tradeSide, tradeType, price, amount, currency } = req.body;

  if (!userId || !tradeSide || !tradeType || !amount) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const db = req.db;
  let limitPrice = null;
  let executionPrice = null;
  let status = 'pending';

  if (tradeType === 'market') {
    if (!price) {
      return res.status(400).json({ message: 'Price is required for market orders.' });
    }
    executionPrice = price;
    status = 'executed';
  } else if (tradeType === 'limit') {
    if (!price) {
      return res.status(400).json({ message: 'Price is required for limit orders.' });
    }
    limitPrice = price;
  } else {
    return res.status(400).json({ message: 'Invalid tradeType.' });
  }

  const query = 'INSERT INTO orders (userId, tradeSide, tradeType, limit_price, execution_price, amount, currency, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [userId, tradeSide, tradeType, limitPrice, executionPrice, amount, currency || 'usdc', status];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    res.json({ message: 'Order created successfully', orderId: results.insertId });
  });
});

// Get active orders for the user
router.get('/activeOrders', (req, res) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const query = 'SELECT * FROM orders WHERE userId = ?';
  req.db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching active orders:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

// Execute a pending limit order
router.post('/executeOrder', (req, res) => {
  const { orderId, currentPrice } = req.body;
  const userId = req.headers['user-id'];
  if (!userId || !orderId || !currentPrice) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const db = req.db;
  db.query('SELECT * FROM orders WHERE id = ? AND userId = ? AND status = "pending"', [orderId, userId], (err, results) => {
    if (err) {
      console.error('Error fetching order:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found or not pending.' });
    }
    const order = results[0];
    const limitPrice = order.limit_price;
    const tradeSide = order.tradeSide;
    const conditionMet = (tradeSide === 'buy' && currentPrice <= limitPrice) || (tradeSide === 'sell' && currentPrice >= limitPrice);

    if (!conditionMet) {
      return res.status(400).json({ message: 'Price condition not met.' });
    }

    const updateQuery = 'UPDATE orders SET execution_price = ?, status = "executed" WHERE id = ?';
    db.query(updateQuery, [currentPrice, orderId], (err) => {
      if (err) {
        console.error('Error executing order:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.json({ message: 'Order executed successfully' });
    });
  });
});

// Close an executed order
router.post('/closeOrder', (req, res) => {
  const { orderId, currentPrice } = req.body;
  const userId = req.headers['user-id'];
  if (!userId || !orderId || !currentPrice) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const db = req.db;
  db.query('SELECT * FROM orders WHERE id = ? AND userId = ? AND status = "executed"', [orderId, userId], (err, results) => {
    if (err) {
      console.error('Error fetching order:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Executed order not found.' });
    }

    const order = results[0];
    const executionPrice = order.execution_price;
    const amount = order.amount;
    const tradeSide = order.tradeSide;

    // Calculate quantity (e.g., BTC)
    const quantity = amount / executionPrice;

    // Calculate balance adjustment
    let balanceAdjustment;
    if (tradeSide === 'buy') {
      balanceAdjustment = quantity * currentPrice; // Proceeds from selling the asset
    } else { // sell
      balanceAdjustment = - (quantity * currentPrice); // Cost to buy back the asset
    }

    // Calculate PNL for history
    const pnl = tradeSide === 'buy'
      ? balanceAdjustment - amount // Profit from buy: proceeds - initial amount
      : amount + balanceAdjustment; // Profit from sell: initial proceeds - buyback cost

    const historyQuery = 'INSERT INTO order_history (id, userId, tradeSide, tradeType, price, amount, currency, created_at, closed_at, pnl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?)';
    const historyValues = [order.id, order.userId, order.tradeSide, order.tradeType, order.limit_price, order.amount, order.currency, order.created_at, pnl];

    db.query(historyQuery, historyValues, (err) => {
      if (err) {
        console.error('Error inserting into order_history:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      db.query('DELETE FROM orders WHERE id = ?', [orderId], (err) => {
        if (err) {
          console.error('Error deleting order:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        db.query('UPDATE funds SET balance = balance + ? WHERE user_id = ?', [balanceAdjustment, userId], (err) => {
          if (err) {
            console.error('Error updating balance:', err);
            return res.status(500).json({ message: 'Server error' });
          }
          res.json({ message: 'Order closed successfully', pnl });
        });
      });
    });
  });
});

// Get order history with pagination
router.get('/orderHistory', (req, res) => {
  const userId = req.headers['user-id'];
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const countQuery = 'SELECT COUNT(*) as total FROM order_history WHERE userId = ?';
  req.db.query(countQuery, [userId], (err, countResults) => {
    if (err) {
      console.error('Error fetching order history count:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    const total = countResults[0].total;
    const totalPages = Math.ceil(total / limit);

    const query = 'SELECT * FROM order_history WHERE userId = ? ORDER BY closed_at DESC LIMIT ? OFFSET ?';
    req.db.query(query, [userId, limit, offset], (err, orders) => {
      if (err) {
        console.error('Error fetching order history:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.json({ orders, totalPages });
    });
  });
});

module.exports = router;