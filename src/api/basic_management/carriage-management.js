import request from "@/utils/request";
// 获取 车厢管理list
export function getList(data) {
  return request({
    url: "/api/Coach",
    method: "get",
    params: data,
  });
}



















