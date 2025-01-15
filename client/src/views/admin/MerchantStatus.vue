<template>
  <div class="merchant-status">
    <el-card>
      <template #header>
        <div class="header">
          <h3>营业状态设置</h3>
          <h4>{{ merchant.name }}</h4>
        </div>
      </template>

      <el-form label-width="120px">
        <el-form-item label="当前状态">
          <el-tag :type="getStatusType(merchant.status)" size="large">
            {{ getStatusText(merchant.status) }}
          </el-tag>
        </el-form-item>

        <el-form-item label="更改状态">
          <el-radio-group v-model="selectedStatus">
            <el-radio-button label="open">营业中</el-radio-button>
            <el-radio-button label="close">临时关闭</el-radio-button>
            <el-radio-button label="long_term_close">长期关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { merchantApi } from '../../services/api'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const merchant = ref({})
const selectedStatus = ref('open')

const getStatusType = (status) => {
  const types = {
    open: 'success',
    close: 'warning',
    long_term_close: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    open: '营业中',
    close: '临时关闭',
    long_term_close: '长期关闭'
  }
  return texts[status] || '未知状态'
}

const loadMerchantData = async () => {
  try {
    const response = await merchantApi.getDetail(route.params.id)
    merchant.value = response.data
    selectedStatus.value = response.data.status
  } catch (error) {
    console.error('加载商户信息失败:', error)
    ElMessage.error('加载商户信息失败')
  }
}

const handleSubmit = async () => {
  try {
    await merchantApi.updateStatus(route.params.id, selectedStatus.value)
    ElMessage.success('状态更新成功')
    router.push('/admin/merchants')
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新状态失败')
  }
}

const handleCancel = () => {
  router.push('/admin/merchants')
}

onMounted(() => {
  loadMerchantData()
})
</script>

<style scoped>
.merchant-status {
  max-width: 600px;
  margin: 20px auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h3, .header h4 {
  margin: 0;
}
</style> 