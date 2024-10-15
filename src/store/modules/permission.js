import { asyncRoutes, constantRoutes } from "@/router";
/* Layout */
import Layout from "@/layout";
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];
  //循环每一个路由
  routes.forEach((route) => {
    const tmp = { ...route };
    //判断是否有权限
    if (hasPermission(roles, tmp)) {
      //判断是否有下限
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  // 完整的路由表
  routes: [],
  // 用户可以访问的路由
  addRoutes: [],
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    //把过滤出来有权限的路由议添加到不需要权限的路由
    state.routes = constantRoutes.concat(routes);
    // state.routes = [];

    // 用户身份 和 路由信息
    console.log('用户身份 和 路由信息',state);

  },
};
// 路由菜单
const arrxx = [
  {a:() => import("@/views/clipboard/index")}
]

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      //存的是有权限的路由，是一个数组
      console.log("用户身份",roles);
      console.log("路由信息",asyncRoutes);
      let accessedRoutes;
      //这里可以写自己的拦截逻辑
      // if (roles.includes("admin")) {
      if (true) {
        // accessedRoutes = asyncRoutes || [];
        accessedRoutes = [
          {
            path: "/clipboard",
            component: Layout,
            children: [
              {
                path: "index",
                component: arrxx[0].a,
                // name: "ClipboardDemo",
                meta: { title: "clipboardDemo", icon: "clipboard" },
              },
            ],
          }];
      }
      //  else if(roles.includes('doctor')){
      //   //通过所属的角色去过滤路由，生成新的路由表
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
       else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      // commit("SET_ROUTES", accessedRoutes);
      commit("SET_ROUTES", accessedRoutes);
      resolve(accessedRoutes);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

