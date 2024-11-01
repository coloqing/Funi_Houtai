import { asyncRoutes, constantRoutes } from '@/router'
import { getRoute } from '@/api/user'
/* Layout */
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  console.log('调整的路由', routes)

  const res = []
  // 循环每一个路由
  routes.forEach((route) => {
    const tmp = { ...route }
    // 判断是否有权限
    if (hasPermission(roles, tmp)) {
      // 判断是否有下限
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
export function updateAsyncRoutes(routes) {
  console.log('需要修改的路由', routes)
  const tmp = JSON.parse(JSON.stringify(routes))
  console.log('深拷贝', tmp)
  for (let i = 0; i < tmp.length; i++) {
    // Layout  为字符串 修改为变量
    if (tmp[i].component) {
      tmp[i].component = Layout
    }
    // 子路由 component:basic  修改为对应的路径
    if (tmp[i].children) {
      for (let j = 0; j < tmp[i].children.length; j++) {
        tmp[i].children[j].component = router_dictionary[tmp[i].children[j].component]
        // console.log("匹配字典",router_dictionary[tmp[i].children[j].component],tmp[i].children[j]);
      }
    }
  }
  return tmp
}

const state = {
  // 完整的路由表
  routes: [],
  // 用户可以访问的路由
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // 把过滤出来有权限的路由议添加到不需要权限的路由
    state.routes = constantRoutes.concat(routes)
    // state.routes = [];

    // 用户身份 和 路由信息
    console.log('用户身份 和 路由信息', state)
  }
}
// 路由菜单
const router_dictionary =
{
  // a: () => import("@/views/clipboard/index"),
  // basic: () => import("@/views/basic_management/line-management/index"),
  // system: () => import("@/views/system_administration/menu_management/index"),
  line: () => import('@/views/basic_management/line-management/index'),
  train: () => import('@/views/basic_management/train-management/index'),
  carriage: () => import('@/views/basic_management/carriage-management/index'),
  equipment: () => import('@/views/basic_management/equipment_management/index'),
  parts: () => import('@/views/basic_management/parts-management/index'),
  performance: () => import('@/views/basic_management/performance_metrics/index'),
  semaphore: () => import('@/views/basic_management/semaphore/index'),
  trainEquipment: () => import('@/views/basic_management/trainEquipment_management/index'),
  munu: () => import('@/views/system_administration/menu_management/index'),
  role: () => import('@/views/system_administration/role_management/index'),
  organizational: () => import('@/views/system_administration/organizational_management/index'),
  configuration: () => import('@/views/system_administration/configuration_management/index'),
  user: () => import('@/views/user_management/index')
}
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      // 存的是有权限的路由，是一个数组
      console.log('用户身份', roles)
      // console.log("路由信息", asyncRoutes);
      let accessedRoutes
      let array
      // 这里可以写自己的拦截逻辑
      // if (roles.includes("admin")) {
      if (true) {
        console.log('执行接口')

        // accessedRoutes = asyncRoutes || [];
        accessedRoutes = []
         array = [
                  {
                    path: "/basic_management",
                    component: "Layout",
                    redirect: "/line-management",
                    alwaysShow: true,
                    meta: { title: "basicManagement", icon: "el-icon-menu" },
                    children: [
                      {
                        id:1,
                        path: "line",
                        component: "line",
                        name: "line",
                        meta: { title: "lineManagement"  }
                      },
                      {
                        id:2,
                        path: "train",
                        component: "train",
                        name: "train-management",
                        meta: { title: "trainManagement"  }
                      },
                      {
                        path: "carriage",
                        component: "carriage",
                        name: "carriage-management",
                        meta: { title: "carriageManagement"  }
                      },
                      {
                        path: "equipment",
                        component: "equipment",
                        name: "equipment_management",
                        meta: { title: "equipmentManagement"  }
                      },
                      {
                        path: "parts",
                        component:"parts",
                        name: "parts-management",
                        id:3,
                        meta: { title: "partsManagement"}
                      },
                      {
                        path: "performance",
                        component: "performance",
                        name: "performance_metrics",
                        meta: { title: "performanceMetrics" }
                      },
                      {
                        path: "semaphore",
                        component: "semaphore",
                        name: "semaphore",
                        meta: { title: "semaphore"  }
                      },
                      {
                        path: "trainEquipment",
                        component: "trainEquipment",
                        name: "trainEquipment_management",
                        meta: { title: "lineEquipmentManagement"  }
                      }
                    ]
                  },
                  {
                    path: "/system_administration",
                    component: "Layout",
                    redirect: "/menu-management",
                    alwaysShow: true,
                    meta: { title: "systemManagement", icon: "el-icon-s-tools" },
                    children: [
                      {
                        path: "munu",
                        component: "munu",
                        name: "menu_management",
                        meta: { title: "menuManagement"   }
                      },
                      {
                        path: "role",
                        component:"role",
                        name: "role_management",
                        meta: { title: "roleManagement"   }
                      },
                      {
                        path: "organizational",
                        component: "organizational",
                        name: "organizational_management",
                        meta: { title: "organizationManagement"  }
                      },
                      // {
                      //   path: "configuration",
                      //   component:"configuration",
                      //   name: "configuration_management",
                      //   meta: { title: "configurationManagement",   }
                      // }
                    ]
                  },
                  {
                    path: "/user_management",
                    component: "Layout",
                    redirect: "/user_management",
                    alwaysShow: true,
                    meta: { title: "userManagement", icon: "el-icon-user-solid" },
                    children: [
                      {
                        path: "user",
                        component:  "user",
                        name: "user_management",
                        meta: { title: "userManagement"   }
                      }
                    ]
                  },
                ]
        // 路由
        getRoute().then((res) => {
          console.log('获取到的路由', res)
          if (res.code === 200) {
            // array = res.data
            // 路由获取完成 开始调整路由数据
            array = updateAsyncRoutes(array)
            array.push({ path: '*', redirect: '/404', hidden: true })
            accessedRoutes = filterAsyncRoutes(array, roles)
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
          }
        })

        // array = [
        //   {
        //     path: "/basic_management",
        //     component: "Layout",
        //     redirect: "/line-management",
        //     alwaysShow: true,
        //     meta: { title: "basicManagement", icon: "el-icon-menu" },
        //     children: [
        //       {
        //         id:1,
        //         path: "line",
        //         component: "line",
        //         name: "line",
        //         meta: { title: "lineManagement", roles: ["admin","editor"] }
        //       },
        //       {
        //         id:2,
        //         path: "train",
        //         component: "train",
        //         name: "train-management",
        //         meta: { title: "trainManagement", roles: ["admin","editor"] }
        //       },
        //       {
        //         path: "carriage",
        //         component: "carriage",
        //         name: "carriage-management",
        //         meta: { title: "carriageManagement", roles: ["admin","editor"] }
        //       },
        //       {
        //         path: "equipment",
        //         component: "equipment",
        //         name: "equipment_management",
        //         meta: { title: "equipmentManagement", roles: ["admin","editor"] }
        //       },
        //       {
        //         path: "parts",
        //         component:"parts",
        //         name: "parts-management",
        //         id:3,
        //         meta: { title: "partsManagement", roles: ["admin", "editor"] }
        //       },
        //       {
        //         path: "performance",
        //         component: "performance",
        //         name: "performance_metrics",
        //         meta: { title: "performanceMetrics", roles: ["admin", "editor"] }
        //       },
        //       {
        //         path: "semaphore",
        //         component: "semaphore",
        //         name: "semaphore",
        //         meta: { title: "semaphore", roles: ["admin", "editor"] }
        //       },
        //       {
        //         path: "trainEquipment",
        //         component: "trainEquipment",
        //         name: "trainEquipment_management",
        //         meta: { title: "lineEquipmentManagement", roles: ["admin", "editor"] }
        //       }
        //     ]
        //   },
        //   {
        //     path: "/system_administration",
        //     component: "Layout",
        //     redirect: "/menu-management",
        //     alwaysShow: true,
        //     meta: { title: "systemManagement", icon: "el-icon-s-tools" },
        //     children: [
        //       {
        //         path: "munu",
        //         component: "munu",
        //         name: "menu_management",
        //         meta: { title: "menuManagement", roles: ["admin", "editor"] }
        //       },
        //       {
        //         path: "role",
        //         component:"role",
        //         name: "role_management",
        //         meta: { title: "roleManagement", roles: ["admin", "editor"] }
        //       },
        //       {
        //         path: "organizational",
        //         component: "organizational",
        //         name: "organizational_management",
        //         meta: { title: "organizationManagement", roles: ["admin", "editor"] }
        //       },
        //       // {
        //       //   path: "configuration",
        //       //   component:"configuration",
        //       //   name: "configuration_management",
        //       //   meta: { title: "configurationManagement", roles: ["admin", "editor"] }
        //       // }
        //     ]
        //   },
        //   {
        //     path: "/user_management",
        //     component: "Layout",
        //     redirect: "/user_management",
        //     alwaysShow: true,
        //     meta: { title: "userManagement", icon: "el-icon-user-solid" },
        //     children: [
        //       {
        //         path: "user",
        //         component:  "user",
        //         name: "user_management",
        //         meta: { title: "userManagement", roles: ["admin", "editor"] }
        //       }
        //     ]
        //   },
        // ]

        // // 路由获取完成 开始调整路由数据
        // array = updateAsyncRoutes(array)
        // array.push({ path: "*", redirect: "/404", hidden: true })

        // accessedRoutes = filterAsyncRoutes(array, roles)
      }
      //  else if(roles.includes("doctor")){
      //   //通过所属的角色去过滤路由，生成新的路由表
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // commit("SET_ROUTES", accessedRoutes);
      // -------------
      // commit("SET_ROUTES", accessedRoutes);
      // resolve(accessedRoutes);
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

