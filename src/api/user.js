import request from '@/utils/request'
// 登录地址接口
export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/api/User/login',
    method: 'post',
    data:{
      "loginName": "admin",
      "password": "123456",
    }
    // data
  })
}
// 个人信息接口
export function getInfo(id) {
  return request({
    url: '/api/User/' + id,
    // url: '/vue-element-admin/user/info',
    method: 'get',
    // params: { token }
  })
}
// 退出登录接口
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
