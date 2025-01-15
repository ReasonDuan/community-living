<template>
  <div class="merchant-list">
    <div class="table-header">
      <el-input
        v-model="searchQuery"
        placeholder="搜索商户名称或地址"
        style="width: 300px"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <el-table :data="merchants" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="商户名称" />
      <el-table-column label="商户图片" width="180">
        <template #default="{ row }">
          <el-image
            :src="row.image_url"
            style="width: 100px; height: 60px"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" />
      <el-table-column label="营业状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.is_open ? 'success' : 'danger'">
            {{ row.is_open ? '营业中' : '已关闭' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button
              type="primary"
              :icon="Edit"
              @click="handleEdit(row.id)"
            >
            </el-button>
            <el-button
              type="warning"
              :icon="Setting"
              @click="handleStatus(row.id)"
            >
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { merchantApi } from '../../services/api'
import { ElMessage } from 'element-plus'
import { Search, Edit, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const merchants = ref([])
const searchQuery = ref('')
const loading = ref(false)

const loadMerchants = async (search = '') => {
  loading.value = true
  try {
    const response = await merchantApi.getList(search)
    merchants.value = response.data
  } catch (error) {
    console.error('加载商户列表失败:', error)
    ElMessage.error('加载商户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  loadMerchants(searchQuery.value)
}

const handleEdit = (id) => {
  router.push(`/admin/merchants/${id}/edit`)
}

const handleStatus = (id) => {
  router.push(`/admin/merchants/${id}/status`)
}

onMounted(() => {
  loadMerchants()
})
</script>

<style scoped>
.merchant-list {
  padding: 20px;
}

.table-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 