import request from '@/utils/request'
// 查询角色管理list
export function getRole(query) {
  return request({
    url: '/api/Role',
    method: 'get',
    // params: query
  })
}
// 获取接口list
export function getApi(data) {
  return request({
    url: '/api/Api',
    method: 'get',
    // data: data
  })
}
// 新增角色
export function addRole(data) {
  return request({
    url: '/api/Role',
    method: 'post',
    data: data
  })
}
// 修改角色
export function updateRole(data) {
  return request({
    url: '/api/Role/Update',
    method: 'post',
    data: data
  })
}
// 删除角色
export function Delect(query) {
  return request({
    url: '/api/Role/Delete',
    method: 'post',
    data: query
  })
}















