import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

export const merchantApi = {
  // 获取商户列表
  getList(search = '') {
    return api.get(`/merchants${search ? `?search=${search}` : ''}`)
  },

  // 获取商户详情
  getDetail(id) {
    return api.get(`/merchants/${id}`)
  },

  // 添加商户
  add(data) {
    return api.post('/admin/merchants', data)
  },

  // 更新商户
  update(id, data) {
    return api.put(`/admin/merchants/${id}`, data)
  },

  // 更新商户状态
  updateStatus(id, status) {
    return api.patch(`/admin/merchants/${id}/status`, { status })
  }
}

export default api 