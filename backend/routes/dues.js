const express = require('express');
const router = express.Router();
const Due = require('../models/Due');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user's due list
// @route   GET /api/dues
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let due = await Due.findOne({ userId: req.user._id });
        if (!due) {
            due = await Due.create({ userId: req.user._id, items: [] });
        }
        res.json(due.items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add new due item
// @route   POST /api/dues
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, amount } = req.body;
    try {
        let due = await Due.findOne({ userId: req.user._id });
        if (!due) {
            due = new Due({ userId: req.user._id, items: [] });
        }

        const newItem = {
            name,
            amount: parseFloat(amount),
            lastUpdate: new Date().toISOString().split('T')[0]
        };

        due.items.push(newItem);
        await due.save();
        res.status(201).json(due.items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update due item amount
// @route   PUT /api/dues/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { amount } = req.body;
    try {
        const due = await Due.findOne({ userId: req.user._id });
        if (!due) return res.status(404).json({ message: 'তথ্য পাওয়া যায়নি' });

        const item = due.items.id(req.params.id);
        if (!item) return res.status(404).json({ message: 'ব্যক্তি খুঁজে পাওয়া যায়নি' });

        item.amount = (item.amount || 0) + parseFloat(amount);
        item.lastUpdate = new Date().toISOString().split('T')[0];

        await due.save();
        res.json(due.items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete due item
// @route   DELETE /api/dues/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const due = await Due.findOne({ userId: req.user._id });
        if (!due) return res.status(404).json({ message: 'তথ্য পাওয়া যায়নি' });

        due.items = due.items.filter(item => item._id.toString() !== req.params.id);
        await due.save();
        res.json(due.items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
