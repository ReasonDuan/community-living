const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const sequelize = require('./config/database');
const Merchant = require('./models/merchant');

const app = express();

// 中间件配置
app.use(cors());
app.use(bodyParser.json());

// 路由配置
const merchantRoutes = require('./routes/merchants');
const adminRoutes = require('./routes/admin');

app.use('/api/merchants', merchantRoutes);
app.use('/api/admin/merchants', adminRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

// 启动服务器前先同步数据库
async function startServer() {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('SQLite连接成功');

    // 同步所有模型
    await sequelize.sync({ force: true }); // force: true 会删除现有表并重新创建
    console.log('数据库模型同步完成');

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('无法启动服务器:', error);
    process.exit(1);
  }
}

startServer(); 