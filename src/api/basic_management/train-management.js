import request from "@/utils/request";
// 获取 列车管理list
export function getTrain(data) {
  return request({
    url: "/api/Train",
    method: "get",
    params: data,
  });
}
// 新增 列车
export function createTrain(data) {
  return request({
    url: "/api/Train",
    method: "post",
    data: data,
  });
}
// 修改 列车
export function Update(data) {
  return request({
    url: "/api/Train/Update",
    method: "post",
    data: data,
  });
}