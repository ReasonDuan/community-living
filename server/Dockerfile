FROM node:18-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 创建数据库目录并设置权限
RUN mkdir -p /app/data && \
    chown -R node:node /app/data

# 设置工作目录权限
RUN chown -R node:node /app

# 切换到非 root 用户
USER node

# 设置环境变量
ENV PORT=3000
ENV NODE_ENV=production

# 修改 SQLite 数据库存储位置
ENV DB_PATH=/app/data/database.sqlite

EXPOSE 3000

CMD ["npm", "start"] 