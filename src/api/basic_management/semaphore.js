import request from '@/utils/request'
// 获取 信号量
export function getTrain(data) {
  return request({
    url: '/api/Train',
    method: 'get',
    params: data
  })
}
// 添加 信号量
export function createList(data) {
  return request({
    url: '/api/Indicators',
    method: 'post',
    data: data
  })
}
// 修改 信号量
export function Update(data) {
  return request({
    url: '/api/Indicators/Update',
    method: 'post',
    data: data
  })
}
// 删除 信号量
export function Delete(data) {
  return request({
    url: '/api/Indicators/Delete',
    method: 'post',
    data: data
  })
}

