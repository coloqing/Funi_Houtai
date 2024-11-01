import request from '@/utils/request'
// 查询 菜单管理
export function getRoute(query) {
  return request({
    url: '/api/Route',
    method: 'get',
    params: query
  })
}
// 查询 修改
export function Update(data, str_roles) {
  return request({
    url: '/api/Route/Update',
    method: 'post',
    data: {
      id: data.id,
      roles: str_roles,
      name: data.name,
      path: data.path,
      title: data.name,
      icon: data.meta.icon
    }
  })
}

