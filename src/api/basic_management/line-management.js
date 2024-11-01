import request from '@/utils/request'
// 获取 线路管理list
export function Lines(data) {
  return request({
    url: '/api/Lines',
    method: 'get',
    params: data
  })
}
// 新增线路
export function addLines(data) {
  return request({
    url: '/api/Lines',
    method: 'post',
    data: {
      // lineId: "string",
      province: data.province[0],
      city: data.province[1],
      name: data.name,
      grouping: data.grouping,
      devicePerCarriage: data.devicePerCarriage
      // isDeleted: true
    }
  })
}
// 修改线路
export function updateLines(data) {
  return request({
    url: '/api/Lines/Update',
    method: 'post',
    data: {
      id: data.id,
      lineId: data.lineId,
      province: data.province[0],
      city: data.province[1],
      name: data.name,
      grouping: data.grouping,
      devicePerCarriage: data.devicePerCarriage

    }
  })
}
