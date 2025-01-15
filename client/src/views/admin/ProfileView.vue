<template>
  <div class="profile">
    <el-card class="profile-card">
      <div class="user-info">
        <el-avatar :size="64" icon="UserFilled" />
        <h3>管理员</h3>
      </div>

      <el-divider />

      <el-menu class="profile-menu">
        <el-menu-item index="1">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><Lock /></el-icon>
          <span>修改密码</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><InfoFilled /></el-icon>
          <span>关于系统</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
        </el-menu-item>
      </el-menu>
    </el-card>

    <el-card class="version-info">
      <p>版本号：v1.0.0</p>
    </el-card>
  </div>
</template>

<script setup>
import { Setting, Lock, InfoFilled, SwitchButton } from '@element-plus/icons-vue'
</script>

<style scoped>
.profile {
  padding: 20px;
}

.profile-card {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.user-info h3 {
  margin: 10px 0 0 0;
  color: #303133;
}

.profile-menu {
  border: none;
}

.version-info {
  text-align: center;
  color: #909399;
}

.version-info p {
  margin: 0;
  padding: 10px;
}
</style> 