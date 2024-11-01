import request from '@/utils/request'
// 查询 组织结构管理list
export function getOrgStructure(query) {
  return request({
    url: '/api/OrgStructure',
    method: 'get'
    // params: query
  })
}
// 新增 组织结构管理
export function createOrgStructure(data) {
  return request({
    url: '/api/OrgStructure',
    method: 'post',
    data: data
  })
}
// 修改 组织结构管理
export function Update(data) {
  return request({
    url: '/api/OrgStructure/Update',
    method: 'post',
    data: data
  })
}

