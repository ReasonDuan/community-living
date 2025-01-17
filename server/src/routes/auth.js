const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const wechatConfig = require('../config/wechat');
const { authMiddleware } = require('../middleware/auth');
const adminConfig = require('../config/admin');

// 生成微信授权URL
router.get('/wechat/url', (req, res) => {
  const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechatConfig.appId}&redirect_uri=${encodeURIComponent(wechatConfig.redirectUrl)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
  res.json({ url });
});

// 微信回调处理
router.get('/wechat/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ message: '缺少参数' });
  }

  try {
    // 获取访问令牌
    const tokenResponse = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wechatConfig.appId}&secret=${wechatConfig.appSecret}&code=${code}&grant_type=authorization_code`
    );

    const { access_token, openid } = tokenResponse.data;

    // 获取用户信息
    const userInfoResponse = await axios.get(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
    );

    const { nickname, headimgurl } = userInfoResponse.data;

    // 查找或创建用户
    let user = await User.findOne({ where: { openid } });

    if (!user) {
      user = await User.create({
        openid,
        nickname,
        avatar: headimgurl
      });
    } else {
      await user.update({
        nickname,
        avatar: headimgurl,
        lastLoginAt: new Date()
      });
    }

    // 生成 JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        openid: user.openid 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 重定向到前端页面，带上token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  } catch (error) {
    console.error('微信登录失败:', error);
    res.status(500).json({ message: '登录失败' });
  }
});

// 获取当前用户信息
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

// 添加密码登录接口
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Received login request:', username, password);
  console.log('Admin config:', adminConfig);
  
  if (username === adminConfig.username && password === adminConfig.password) {
    // 创建管理员用户（如果不存在）
    let user = await User.findOne({ 
      where: { 
        username: adminConfig.username,
        role: 'admin'
      }
    });

    if (!user) {
      user = await User.create({
        username: adminConfig.username,
        role: 'admin',
        openid: 'admin', // 使用固定值区分管理员账号
        nickname: '管理员'
      });
    }

    // 更新登录时间
    await user.update({ lastLoginAt: new Date() });

    // 生成 JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } else {
    res.status(401).json({ message: '用户名或密码错误' });
  }
});

module.exports = router; 