import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 认证相关的 API
export const authApi = {
  // 获取微信登录二维码 URL
  getWechatUrl: () => api.get('/auth/wechat/url'),
  
  // 账号密码登录
  login: (data) => api.post('/auth/login', data),
  
  // 获取当前用户信息
  getCurrentUser: () => api.get('/auth/me')
}

// 商户相关的 API
export const merchantApi = {
  // 获取商户列表
  getList: (search = '') => api.get(`/merchants${search ? `?search=${search}` : ''}`),

  // 获取商户详情
  getDetail: (id) => api.get(`/merchants/${id}`),

  // 添加商户
  add: (data) => api.post('/admin/merchants', data),

  // 更新商户
  update: (id, data) => api.put(`/admin/merchants/${id}`, data),

  // 更新商户状态
  updateStatus: (id, status) => api.patch(`/admin/merchants/${id}/status`, { status })
}

export default api 