const express = require('express');
const jwt = require('jsonwebtoken');
const Investment = require('../models/Investment');
const Goal = require('../models/Goal');
const WatchlistItem = require('../models/WatchlistItem');
const router = express.Router();

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Unauthorized' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/investments', auth, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.id });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch investments' });
  }
});

router.post('/investments', auth, async (req, res) => {
  try {
    const investment = await Investment.create({ ...req.body, userId: req.user.id });
    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create investment' });
  }
});

router.put('/investments/:id', auth, async (req, res) => {
  try {
    const investment = await Investment.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!investment) return res.status(404).json({ message: 'Investment not found' });
    res.json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update investment' });
  }
});

router.delete('/investments/:id', auth, async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!investment) return res.status(404).json({ message: 'Investment not found' });
    res.json({ message: 'Investment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete investment' });
  }
});

router.get('/goals', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch goals' });
  }
});

router.post('/goals', auth, async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user.id });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create goal' });
  }
});

router.get('/watchlist', auth, async (req, res) => {
  try {
    const items = await WatchlistItem.find({ userId: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch watchlist' });
  }
});

router.post('/watchlist', auth, async (req, res) => {
  try {
    const item = await WatchlistItem.create({ ...req.body, userId: req.user.id });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add watchlist item' });
  }
});

module.exports = router;
