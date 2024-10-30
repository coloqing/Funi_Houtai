import request from '@/utils/request'
// 获取 信号量
export function fetchList_Signal(data) {
  return request({
    url: '/api/Signal',
    method: 'get',
    params: data
  })
}
// 添加 信号量
export function createList(data) {
  return request({
    url: '/api/Signal',
    method: 'post',
    data: data
  })
}
// 修改 信号量
export function Update(data) {
  return request({
    url: '/api/Signal/Update',
    method: 'post',
    data: data
  })
}
// 删除 信号量
export function Delete(data) {
  return request({
    url: '/api/Signal/Delete',
    method: 'post',
    data: data
  })
}

