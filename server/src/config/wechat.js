require('dotenv').config();

module.exports = {
  appId: process.env.WECHAT_APP_ID,
  appSecret: process.env.WECHAT_APP_SECRET,
  // 登录成功后的回调地址
  redirectUrl: process.env.WECHAT_REDIRECT_URL || 'http://localhost:3000/api/auth/wechat/callback'
}; 