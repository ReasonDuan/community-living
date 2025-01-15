<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-input
          v-model="searchQuery"
          placeholder="搜索商户名称或地址"
          prefix-icon="Search"
          clearable
          @input="handleSearch"
        />
      </el-header>
      
      <el-main>
        <el-row :gutter="20">
          <el-col 
            v-for="merchant in merchants" 
            :key="merchant.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            class="merchant-card-col"
          >
            <el-card 
              class="merchant-card"
              @click="goToDetail(merchant.id)"
            >
              <img :src="merchant.image_url" class="merchant-image">
              <div class="merchant-info">
                <h3>{{ merchant.name }}</h3>
                <p>{{ merchant.address }}</p>
                <el-tag :type="merchant.is_open ? 'success' : 'danger'">
                  {{ merchant.is_open ? '营业中' : '已关闭' }}
                </el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { merchantApi } from '../services/api'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const merchants = ref([])
const searchQuery = ref('')

const loadMerchants = async (search = '') => {
  try {
    const response = await merchantApi.getList(search)
    merchants.value = response.data
  } catch (error) {
    console.error('加载商户列表失败:', error)
    ElMessage.error('加载商户列表失败')
  }
}

const handleSearch = () => {
  loadMerchants(searchQuery.value)
}

const goToDetail = (id) => {
  router.push(`/merchant/${id}`)
}

onMounted(() => {
  loadMerchants()
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.merchant-card-col {
  margin-bottom: 20px;
}

.merchant-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.merchant-card:hover {
  transform: translateY(-5px);
}

.merchant-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.merchant-info {
  padding: 10px;
}

.merchant-info h3 {
  margin: 0 0 10px 0;
}

.merchant-info p {
  color: #666;
  margin: 5px 0;
}
</style>
