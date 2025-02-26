const express = require('express');
const router = express.Router();

// Get user's balance
router.get('/balance', (req, res) => {
    const userId = req.headers['user-id']; // Assuming user ID comes from headers
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const query = 'SELECT balance FROM funds WHERE user_id = ?';
    req.db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching balance:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User funds not found' });
        }
        res.json({ balance: results[0].balance });
    });
});

// Recharge funds
router.post('/recharge', (req, res) => {
    const userId = req.headers['user-id'];
    const { amount } = req.body;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }
    // Check if user exists in funds table
    req.db.query('SELECT balance FROM funds WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error checking user funds:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length === 0) {
            // Insert new record
            const insertQuery = 'INSERT INTO funds (user_id, balance) VALUES (?, ?)';
            req.db.query(insertQuery, [userId, amount], (err) => {
                if (err) {
                    console.error('Error inserting new funds record:', err);
                    return res.status(500).json({ message: 'Server error' });
                }
                res.json({ message: 'Funds recharged successfully', newBalance: amount });
            });
        } else {
            // Update existing record
            const updateQuery = 'UPDATE funds SET balance = balance + ? WHERE user_id = ?';
            req.db.query(updateQuery, [amount, userId], (err) => {
                if (err) {
                    console.error('Error updating funds:', err);
                    return res.status(500).json({ message: 'Server error' });
                }
                // Fetch the new balance
                req.db.query('SELECT balance FROM funds WHERE user_id = ?', [userId], (err, results) => {
                    if (err) {
                        console.error('Error fetching new balance:', err);
                        return res.status(500).json({ message: 'Server error' });
                    }
                    res.json({ message: 'Funds recharged successfully', newBalance: results[0].balance });
                });
            });
        }
    });
});

module.exports = router;