const express = require('express');
const router = express.Router();
const Merchant = require('../models/merchant');

// 添加商户
router.post('/', async (req, res) => {
  try {
    const merchant = await Merchant.create(req.body);
    res.status(201).json({
      id: merchant.id,
      created_at: merchant.createdAt
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 更新商户信息
router.put('/:id', async (req, res) => {
  try {
    const merchant = await Merchant.findByPk(req.params.id);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    
    await merchant.update(req.body);
    res.json({ updated_at: merchant.updatedAt });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 设置商户状态
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['open', 'close', 'long_term_close'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const merchant = await Merchant.findByPk(req.params.id);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    
    await merchant.update({
      status,
      is_open: status === 'open'
    });
    
    res.json({ updated_at: merchant.updatedAt });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 