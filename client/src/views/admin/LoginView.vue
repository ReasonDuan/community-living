<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h3>管理员登录</h3>
      </template>

      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane label="账号密码登录" name="password">
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="0"
            @keyup.enter="handlePasswordLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="form.username"
                placeholder="用户名"
                prefix-icon="User"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button 
                type="primary" 
                class="submit-btn"
                :loading="loading"
                @click="handlePasswordLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="微信扫码登录" name="wechat">
          <div class="qrcode-container">
            <div v-if="!qrcodeUrl" class="loading">
              <el-icon class="loading-icon"><Loading /></el-icon>
              <p>正在加载登录二维码...</p>
            </div>
            <template v-else>
              <img :src="qrcodeUrl" alt="微信登录二维码" class="qrcode">
              <p class="tip">请使用微信扫描二维码登录</p>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading, User, Lock } from '@element-plus/icons-vue'
import QRCode from 'qrcode'
import { authApi } from '../../services/api'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const activeTab = ref('password')
const qrcodeUrl = ref('')
const loading = ref(false)

const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 密码登录
const handlePasswordLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const { data } = await authApi.login(form.value)
        localStorage.setItem('token', data.token)
        router.replace('/admin/merchants')
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const generateQRCode = async (url) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(url)
    qrcodeUrl.value = qrDataUrl
  } catch (error) {
    console.error('生成二维码失败:', error)
    ElMessage.error('生成二维码失败')
  }
}

const getWechatAuthUrl = async () => {
  try {
    const { data } = await authApi.getWechatUrl()
    await generateQRCode(data.url)
  } catch (error) {
    console.error('获取微信登录链接失败:', error)
    ElMessage.error('获取微信登录链接失败')
  }
}

// 检查URL中是否有token参数
const checkToken = () => {
  const token = route.query.token
  if (token) {
    localStorage.setItem('token', token)
    // 获取用户信息
    checkUserRole()
  }
}

// 检查用户角色
const checkUserRole = async () => {
  try {
    const { data: user } = await authApi.getCurrentUser()
    if (user.role === 'admin') {
      router.replace('/admin/merchants')
    } else {
      ElMessage.error('您没有管理员权限')
      localStorage.removeItem('token')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
    localStorage.removeItem('token')
  }
}

// 监听 tab 切换
watch(activeTab, (newTab) => {
  if (newTab === 'wechat' && !qrcodeUrl.value) {
    getWechatAuthUrl()
  }
})

onMounted(() => {
  checkToken()
  if (!localStorage.getItem('token') && activeTab.value === 'wechat') {
    getWechatAuthUrl()
  }
})
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-card {
  width: 100%;
  max-width: 360px;
}

.qrcode-container {
  padding: 20px;
  text-align: center;
}

.loading {
  padding: 40px 0;
}

.loading-icon {
  font-size: 32px;
  color: #409EFF;
  animation: rotate 1s linear infinite;
}

.qrcode {
  width: 200px;
  height: 200px;
}

.tip {
  margin-top: 20px;
  color: #606266;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-tabs {
  padding: 20px 0;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}

:deep(.el-tabs__nav) {
  width: 100%;
}

:deep(.el-tabs__item) {
  width: 50%;
  text-align: center;
}

.el-form-item {
  margin-bottom: 20px;
}
</style> 