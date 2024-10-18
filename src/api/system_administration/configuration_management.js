import request from '@/utils/request'
// 查询 系统配置管理list
export function getConfig(query) {
  return request({
    url: '/api/Config',
    method: 'get',
    params: query
  })
}
// 修改 系统配置
export function getConfig(query) {
  return request({
    url: '/api/Config/Update',
    method: 'get',
    params: query
  })
}























