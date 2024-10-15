import request from "@/utils/request";
// 获取 设备部件管理
export function fetchList(data) {
  return request({
    url: "/api/Device",
    method: "get",
    params: data,
  });
}
// 新增
export function createList(data) {
  return request({
    url: "/api/Device",
    method: "post",
    data: data,
  });
}
// 修改
export function Update(data) {
  return request({
    url: "/api/Device/Update",
    method: "post",
    data: data,
  });
}
// 删除
export function Delete(data) {
  return request({
    url: "/api/Device/Delete",
    method: "post",
    data: data,
  });
}


























