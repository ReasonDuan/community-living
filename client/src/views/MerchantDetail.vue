<template>
  <div class="merchant-detail">
    <el-card>
      <template #header>
        <div class="header">
          <h2>{{ merchant.name }}</h2>
          <el-tag :type="merchant.is_open ? 'success' : 'danger'" size="large">
            {{ merchant.is_open ? '营业中' : '已关闭' }}
          </el-tag>
        </div>
      </template>
      
      <div class="content">
        <el-image 
          :src="merchant.image_url" 
          fit="cover"
          class="merchant-image"
        />
        
        <div class="info-section">
          <h3>基本信息</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="营业时间">
              {{ merchant.open_time }} - {{ merchant.close_time }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ merchant.phone }}
            </el-descriptions-item>
            <el-descriptions-item label="地址">
              {{ merchant.address }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="description-section">
          <h3>商户描述</h3>
          <p>{{ merchant.description }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { merchantApi } from '../services/api'
import { ElMessage } from 'element-plus'

const route = useRoute()
const merchant = ref({})

const loadMerchantDetail = async () => {
  try {
    const response = await merchantApi.getDetail(route.params.id)
    merchant.value = response.data
  } catch (error) {
    console.error('加载商户详情失败:', error)
    ElMessage.error('加载商户详情失败')
  }
}

onMounted(() => {
  loadMerchantDetail()
})
</script>

<style scoped>
.merchant-detail {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  margin: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.merchant-image {
  width: 100%;
  height: 300px;
  border-radius: 8px;
}

.info-section, .description-section {
  margin-top: 20px;
}

.info-section h3, .description-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.description-section p {
  line-height: 1.6;
  color: #666;
}
</style> 