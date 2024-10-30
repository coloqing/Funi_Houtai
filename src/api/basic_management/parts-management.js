import request from '@/utils/request'
// 获取 部件管理
export function fetchList_Component(data) {
  return request({
    url: '/api/Component',
    method: 'get',
    params: data
  })
}
// 添加 部件管理
export function createList(data) {
  return request({
    url: '/api/Component',
    method: 'post',
    data: data
  })
}
// 修改 部件管理
export function Update(data) {
  return request({
    url: '/api/Component/Update',
    method: 'post',
    data: data
  })
}
// 删除 部件管理
export function Delete(data) {
  return request({
    url: '/api/Component/Delete',
    method: 'post',
    data: data
  })
}

