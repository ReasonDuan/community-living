<template>
  <div class="merchant-form">
    <el-card>
      <template #header>
        <h3>{{ isEdit ? '编辑商户' : '添加商户' }}</h3>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="form"
      >
        <el-form-item label="商户名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="商户图片" prop="image_url">
          <el-input v-model="form.image_url" placeholder="请输入图片URL" />
        </el-form-item>

        <el-form-item label="营业时间">
          <el-col :span="11">
            <el-form-item prop="open_time">
              <el-time-picker
                v-model="form.open_time"
                format="HH:mm"
                placeholder="开始时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2" class="text-center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="close_time">
              <el-time-picker
                v-model="form.close_time"
                format="HH:mm"
                placeholder="结束时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>

        <el-form-item label="商户地址" prop="address">
          <el-input v-model="form.address" />
        </el-form-item>

        <el-form-item label="商户描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            {{ isEdit ? '保存' : '添加' }}
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { merchantApi } from '../../services/api'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

const isEdit = computed(() => route.params.id !== undefined)

// 创建默认时间的 Date 对象
const createTimeDate = (timeString) => {
  const [hours, minutes] = timeString.split(':')
  const date = new Date()
  date.setHours(parseInt(hours, 10))
  date.setMinutes(parseInt(minutes, 10))
  return date
}

// 格式化时间为字符串
const formatTime = (date) => {
  if (!date) return ''
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const form = ref({
  name: '',
  image_url: '',
  open_time: createTimeDate('10:00'),
  close_time: createTimeDate('20:00'),
  phone: '',
  address: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
  image_url: [{ required: true, message: '请输入图片URL', trigger: 'blur' }],
  open_time: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  close_time: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入商户地址', trigger: 'blur' }]
}

const loadMerchantData = async () => {
  if (!isEdit.value) return
  
  try {
    const response = await merchantApi.getDetail(route.params.id)
    const data = response.data
    // 转换时间字符串为 Date 对象
    data.open_time = createTimeDate(data.open_time)
    data.close_time = createTimeDate(data.close_time)
    Object.assign(form.value, data)
  } catch (error) {
    console.error('加载商户信息失败:', error)
    ElMessage.error('加载商户信息失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 提交前转换时间为字符串格式
        const submitData = {
          ...form.value,
          open_time: formatTime(form.value.open_time),
          close_time: formatTime(form.value.close_time)
        }
        
        if (isEdit.value) {
          await merchantApi.update(route.params.id, submitData)
          ElMessage.success('更新成功')
        } else {
          await merchantApi.add(submitData)
          ElMessage.success('添加成功')
        }
        router.push('/admin/merchants')
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

const handleCancel = () => {
  router.push('/admin/merchants')
}

onMounted(() => {
  loadMerchantData()
})
</script>

<style scoped>
.merchant-form {
  max-width: 800px;
  margin: 20px auto;
}

.form {
  margin-top: 20px;
}

.text-center {
  text-align: center;
  line-height: 32px;
}
</style> 