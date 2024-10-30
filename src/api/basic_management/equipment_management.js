import request from '@/utils/request'
// 获取 设备管理
export function getList_device(data) {
  return request({
    url: '/api/Device',
    method: 'get',
    params: data
  })
}
// 添加 设备管理
export function createList(data) {
  return request({
    url: '/api/Device',
    method: 'post',
    data: data
  })
}
// 修改 设备管理
export function Update(data) {
  return request({
    url: '/api/Device/Update',
    method: 'post',
    data: data
  })
}
// 删除 设备管理
export function Delete(data) {
  return request({
    url: '/api/Device/Delete',
    method: 'post',
    data: data
  })
}

