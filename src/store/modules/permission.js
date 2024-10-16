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
export function updateAsyncRoutes(routes) {
    console.log('需要修改的路由',routes);
    let tmp  = JSON.parse(JSON.stringify(routes))
    console.log('深拷贝',tmp);
    for (let i = 0; i < tmp.length; i++) {
      // Layout  为字符串 修改为变量
      if (tmp[i].component) {
        tmp[i].component = Layout
      }
      // 子路由 component:basic  修改为对应的路径
      if (tmp[i].children) {
        for (let j = 0; j < tmp[i].children.length; j++) {
          tmp[i].children[j].component = router_dictionary[tmp[i].children[j].component]
          // console.log('匹配字典',router_dictionary[tmp[i].children[j].component],tmp[i].children[j]);
        }
      }
    }
    return tmp
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
const router_dictionary = 
  {
  a:() => import("@/views/clipboard/index"),
  basic: () => import("@/views/basic_management/line-management/index"),
  system:() => import("@/views/system_administration/menu_management/index")
  }


const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      //存的是有权限的路由，是一个数组
      console.log("用户身份",roles);
      console.log("路由信息",asyncRoutes);
      let accessedRoutes;
      let array
      //这里可以写自己的拦截逻辑
      // if (roles.includes("admin")) {
      if (true) {
        // accessedRoutes = asyncRoutes || [];
        accessedRoutes = [];
         array = [
          {
            path: "/basic_management",
            component: 'Layout',
            redirect: "/line-management",
            alwaysShow: true, 
            meta: { title: "基础管理", icon: "el-icon-document" },
            children: [
              {
                path: "line",
                component:'basic',
                name: "line",
                meta: { title: "线路管理", roles: ["editor"] },
              }
            ]
          },
          {
            path: "/system_administration",
            component: 'Layout',
            redirect: "/menu-management",
            alwaysShow: true, 
            meta: { title: "系统管理", icon: "el-icon-document" },
            children: [
              {
                path: "munu",
                component: 'system',
                name: "menu_management",
                meta: { title: "菜单管理", roles: ["admin", "editor"] },
              },
            ]
          }
        ];
          // 路由获取完成 开始调整路由数据
          array = updateAsyncRoutes(array)


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

