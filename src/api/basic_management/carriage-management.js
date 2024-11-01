import request from '@/utils/request'
// 获取 车厢管理list
export function getList(data) {
  return request({
    url: '/api/Coach',
    method: 'get',
    params: data
  })
}
//  新增 车厢信息
export function createCoach(data) {
  return request({
    url: '/api/Coach',
    method: 'post',
    data: data
  })
}
//  修改 车厢信息
export function updateCoach(data) {
  return request({
    url: '/api/Coach/Update',
    method: 'post',
    data: data
  })
}
//  多条修改 车厢信息
export function updateMuch(data) {
  return request({
    url: '/api/Coach/UpdateMuch',
    method: 'post',
    data: data
  })
}
//  删除 车厢信息
export function deleteCoach(data) {
  return request({
    url: '/api/Coach/Delete',
    method: 'post',
    data: data
  })
}

