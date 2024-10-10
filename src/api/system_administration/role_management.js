import request from '@/utils/request'
// 查询角色管理list
export function getRole(query) {
  return request({
    url: '/api/Role',
    method: 'get',
    // params: query
  })
}
// 新增角色
export function addRole(query) {
  return request({
    url: '/api/Role',
    method: 'post',
    // params: query
  })
}
// 修改角色
export function createRole(query) {
  return request({
    url: '/api/Role/Update',
    method: 'get',
    // params: query
  })
}
// 删除角色
export function Delect(query) {
//   return request({
//     url: '/api/Role',
//     method: 'get',
//     // params: query
//   })
}















