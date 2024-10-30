import request from '@/utils/request'
// 获取 列车设备管理
export function getList(data) {
  return request({
    url: '/api/TrainDevice',
    method: 'get',
    params: data
  })
}
// 添加 列车设备管理
export function createList(data) {
  return request({
    url: '/api/TrainDevice',
    method: 'post',
    data: data
  })
}
// 关联 列车，设备
export function relevancyDeviceSignal(data) {
  return request({
    url: '/api/TrainDevice/AllDeviceSignal',
    method: 'get',
    params: data
  })
}
// 修改 列车设备管理
export function Update(data) {
  return request({
    url: '/api/TrainDevice/Update',
    method: 'post',
    data: data
  })
}
// 删除 列车设备管理
export function Delete(data) {
  return request({
    url: '/api/TrainDevice/Delete',
    method: 'post',
    data: data
  })
}
