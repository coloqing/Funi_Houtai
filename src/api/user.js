import request from '@/utils/request'
// 登录地址接口
export function login(data) {
  return request({
    url: '/api/User/login',
    method: 'post',
    data: {
      loginName: data.username,
      password: data.password
    }
  })
}
// 个人信息接口
export function getInfo(id) {
  return request({
    url: '/api/User/' + id,
    // url: '/vue-element-admin/user/info',
    method: 'get'
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
// 根据用户获取动态路由
export function getRoute(data) {
  return request({
    url: '/api/Route/Structure',
    method: 'get',
    params: data
  })
}
