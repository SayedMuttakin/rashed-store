const express = require('express');
const router = express.Router();
const Due = require('../models/Due');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user's due list
// @route   GET /api/dues
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        let due = await Due.findOne({ userId: req.user._id });
        if (!due) {
            due = await Due.create({ userId: req.user._id, items: [] });
        }
        res.json(due.items);
    } catch (error) {
        next(error);
    }
});

// @desc    Add new due item
router.post('/', protect, async (req, res, next) => {
    const { name, amount, description } = req.body;
    try {
        let due = await Due.findOne({ userId: req.user._id });
        if (!due) {
            due = new Due({ userId: req.user._id, items: [] });
        }

        const dateStr = new Date().toISOString().split('T')[0];
        const newItem = {
            name,
            amount: parseFloat(amount),
            lastUpdate: dateStr,
            history: [{
                type: 'initial',
                amount: parseFloat(amount),
                description: description || 'প্রাথমিক এন্ট্রি',
                date: dateStr
            }]
        };

        due.items.push(newItem);
        await due.save();
        res.status(201).json(due.items);
    } catch (error) {
        next(error);
    }
});

// @desc    Update due item amount
router.put('/:id', protect, async (req, res, next) => {
    const { amount, description } = req.body;
    try {
        const due = await Due.findOne({ userId: req.user._id });
        if (!due) return res.status(404).json({ message: 'তথ্য পাওয়া যায়নি' });

        const item = due.items.id(req.params.id);
        if (!item) return res.status(404).json({ message: 'ব্যক্তি খুঁজে পাওয়া যায়নি' });

        const delta = parseFloat(amount);
        const type = delta > 0 ? 'plus' : 'minus';
        const dateStr = new Date().toISOString().split('T')[0];

        item.amount = (item.amount || 0) + delta;
        item.lastUpdate = dateStr;
        
        // Add to history
        item.history.push({
            type,
            amount: Math.abs(delta),
            description: description || (type === 'plus' ? 'বকেয়া যোগ করা হয়েছে' : 'বকেয়া পরিশোধ পাওয়া গেছে'),
            date: dateStr
        });

        await due.save();
        res.json(due.items);
    } catch (error) {
        next(error);
    }
});

// @desc    Delete due item
// @route   DELETE /api/dues/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const due = await Due.findOne({ userId: req.user._id });
        if (!due) return res.status(404).json({ message: 'তথ্য পাওয়া যায়নি' });

        due.items = due.items.filter(item => item._id.toString() !== req.params.id);
        await due.save();
        res.json(due.items);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
