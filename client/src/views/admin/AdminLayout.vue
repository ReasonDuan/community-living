<template>
  <el-container class="admin-layout">
    <el-main>
      <router-view></router-view>
    </el-main>

    <el-footer 
      v-if="!isLoginPage" 
      class="admin-footer" 
      height="50px"
    >
      <div class="tab-bar">
        <router-link 
          to="/admin/merchants" 
          class="tab-item"
          active-class="active"
        >
          <el-icon><Shop /></el-icon>
          <span>商户</span>
        </router-link>

        <router-link 
          to="/admin/merchants/add" 
          class="tab-item"
          active-class="active"
        >
          <el-icon><Plus /></el-icon>
          <span>添加</span>
        </router-link>

        <router-link 
          to="/admin/profile" 
          class="tab-item"
          active-class="active"
        >
          <el-icon><User /></el-icon>
          <span>我的</span>
        </router-link>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { Shop, Plus, User } from '@element-plus/icons-vue'

const route = useRoute()

// 判断是否是登录页面
const isLoginPage = computed(() => route.name === 'admin-login')
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-footer {
  padding: 0;
  border-top: 1px solid #dcdfe6;
  background-color: #fff;
}

.tab-bar {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  text-decoration: none;
  font-size: 12px;
  height: 100%;
}

.tab-item .el-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.tab-item.active {
  color: #409EFF;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .admin-layout {
    padding-bottom: 50px; /* 为底部导航留出空间 */
  }
}
</style> 