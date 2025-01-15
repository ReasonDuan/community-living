const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Merchant = require('../models/merchant');

// 获取商户列表
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let where = {};
    
    if (search) {
      where = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    
    const merchants = await Merchant.findAll({
      where,
      attributes: ['id', 'name', 'image_url', 'is_open', 'address']
    });
    res.json(merchants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取商户详情
router.get('/:id', async (req, res) => {
  try {
    const merchant = await Merchant.findByPk(req.params.id);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    res.json(merchant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 