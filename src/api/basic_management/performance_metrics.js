import request from '@/utils/request'
// 获取 性能指标
export function fetchList_Indicators(data) {
  return request({
    url: '/api/Indicators',
    method: 'get',
    params: data
  })
}
// 添加 性能指标
export function createList(data) {
  return request({
    url: '/api/Indicators',
    method: 'post',
    data: data
  })
}
// 修改 性能指标
export function Update(data) {
  return request({
    url: '/api/Indicators/Update',
    method: 'post',
    data: data
  })
}
// 删除 性能指标
export function Delete(data) {
  return request({
    url: '/api/Indicators/Delete',
    method: 'post',
    data: data
  })
}

