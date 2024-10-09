import request from '@/utils/request'
// 获取用户管理数据
export function fetchList(data) {
  return request({
    url: '/api/User/All',
    method: 'get',
    // data: data
  })
}
// 新增账号
export function updateArticle(data) {
  return request({
    url: '/api/User/ChangePassword',
    method: 'post',
    data: data
  })
}
// 新增账号
export function createArticle(data) {
  return request({
    url: '/api/User/Signup',
    method: 'post',
    data: data
  })
}
// 获取用户角色列表
export function getRole(data) {
  return request({
    url: '/api/Role',
    method: 'get',
  })
}
// 修改用户角色身份
export function modRole(query) {
  return request({
    url: '/api/User/ModRole',
    method: 'get',
    params:{
        userId:query.userId,
        roleId:query.roleId
    }
  })
}