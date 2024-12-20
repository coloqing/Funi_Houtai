import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
// let tmps = [
//   {
//     "path": "/basic_management",
//     "component": "Layout",
//     "redirect": "/line-management",
//     "alwaysShow": true,
//     "meta": { "title": "基础管理", "icon": "el-icon-document" },
//     "children": [
//       {
//         "path": "line",
//         "component": "line",
//         "name": "line",
//         "meta": { "title": "线路管理", "roles": ["editor"] }
//       },
//       {
//         "path": "train",
//         "component": "train",
//         "name": "train-management",
//         "meta": { "title": "列车管理", "roles": ["admin", "editor"] }
//       },
//       {
//         "path": "carriage",
//         "component": "carriage",
//         "name": "carriage-management",
//         "meta": { "title": "车厢管理", "roles": ["admin", "editor"] }
//       },
//       {
//         "path": "parts",
//         "component": "parts",
//         "name": "parts-management",
//         "meta": { "title": "设备部件管理", "roles": ["admin", "editor"] }
//       },
//     ],
//   },
//   {
//     "path": "/system_administration",
//     "component": "Layout",
//     "redirect": "/menu-management",
//     "alwaysShow": true,
//     "meta": { "title": "系统管理", "icon": "el-icon-document" },
//     "children": [
//       {
//         "path": "munu",
//         "component": "munu",
//         "meta": { "title": "菜单管理", "roles": ["admin", "editor"] }
//       },
//       {
//         "path": "role",
//         "component": "role",
//         "meta": { "title": "角色管理", "roles": ["admin", "editor"] }
//       },
//       {
//         "path": "organizational",
//         "component": "organizational",
//         "name": "organizational_management",
//         "meta": { "title": "组织结构管理", "roles": ["admin", "editor"] }
//       },
//       {
//         "path": "configuration",
//         "component": "configuration",
//         "name": "configuration_management",
//         "meta": { "title": "系统配置管理", "roles": ["admin", "editor"] }
//       },
//     ],
//   },
//   {
//     "path": "/user_management",
//     "component": "Layout",
//     "redirect": "/user_management",
//     "alwaysShow": true,
//     "meta": { "title": "用户管理", "icon": "el-icon-document" },
//     "children": [
//       {
//         "path": "user",
//         "component": "user",
//         "name": "user_management",
//         "meta": { "title": "用户管理", "roles": ["admin", "editor"] }
//       }
//     ]
//   }
// ]
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

  {
    path: '/system_administrations',
    component: Layout,
    children: [
      {
        path: 'configuration',
        component: () =>
          import(
            '@/views/system_administration/configuration_management/index'
          ),
        name: 'configuration_management',
        meta: { title: 'configurationManagement', roles: ['admin', 'editor'], icon: 'el-icon-s-home' }
      }
    ]
  },

  /** 自定义路由===================**/
  // {
  //   path: '/basic_management',
  //   component: Layout,
  //   redirect: '/line-management',
  //   alwaysShow: true,
  //   meta: { title: 'basicManagement', icon: 'el-icon-menu' },
  //   children: [
  //     {
  //       path: 'line',
  //       component: () =>
  //         import('@/views/basic_management/line-management/index'),
  //       name: 'line',
  //       meta: { title: 'lineManagement', roles: ['editor'] }
  //     },
  //     {
  //       path: 'train',
  //       component: () =>
  //         import('@/views/basic_management/train-management/index'),
  //       name: 'train-management',
  //       meta: { title: 'trainManagement', roles: ['admin', 'editor'] }
  //     },
  //     {
  //       path: 'carriage',
  //       component: () =>
  //         import('@/views/basic_management/carriage-management/index'),
  //       name: 'carriage-management',
  //       meta: { title: 'carriageManagement', roles: ['admin', 'editor'] }
  //     },
  //     {
  //       path: 'equipment',
  //       component: () =>
  //         import('@/views/basic_management/equipment_management/index'),
  //       name: 'equipment_management',
  //       meta: { title: 'equipmentManagement', roles: ['admin', 'editor'] }
  //     },
  //     {
  //       path: 'parts',
  //       component: () =>
  //         import('@/views/basic_management/parts-management/index'),
  //       name: 'parts-management',
  //       meta: { title: 'partsManagement', roles: ['admin', 'editor'] }
  //     },
  //     {
  //       path: 'performance',
  //       component: () =>
  //         import('@/views/basic_management/performance_metrics/index'),
  //       name: 'performance_metrics',
  //       meta: { title: 'performanceMetrics', roles: ['admin', 'editor'] }
  //     },
  //     {
  //       path: 'semaphore',
  //       component: () =>
  //         import('@/views/basic_management/semaphore/index'),
  //       name: 'semaphore',
  //       meta: { title: 'semaphore', roles: ['admin', 'editor'] }
  //     },
  //     {
  //       path: 'trainEquipment',
  //       component: () =>
  //         import('@/views/basic_management/trainEquipment_management/index'),
  //       name: 'trainEquipment_management',
  //       meta: { title: 'lineEquipmentManagement', roles: ['admin', 'editor'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/system_administration',
  //   component: Layout,
  //   redirect: '/menu-management',
  //   alwaysShow: true,
  //   meta: { title: 'systemManagement', icon: 'el-icon-s-tools' },
  //   children: [
  //     {
  //       path: 'munu',
  //       component: () =>
  //         import('@/views/system_administration/menu_management/index'),
  //       name: 'menu_management',
  //       meta: { title: 'menuManagement', roles: ['admin', 'editor'] }
  //     },
  //     {
  //       path: 'role',
  //       component: () =>
  //         import('@/views/system_administration/role_management/index'),
  //       name: 'role_management',
  //       meta: { title: 'roleManagement', roles: ['admin', 'editor'] }
  //     },
  //     {
  //       path: 'organizational',
  //       component: () =>
  //         import(
  //           '@/views/system_administration/organizational_management/index'
  //         ),
  //       name: 'organizational_management',
  //       meta: { title: 'organizationManagement', roles: ['admin', 'editor'] }
  //     },
  //     {
  //       path: 'configuration',
  //       component: () =>
  //         import(
  //           '@/views/system_administration/configuration_management/index'
  //         ),
  //       name: 'configuration_management',
  //       meta: { title: 'configurationManagement', roles: ['admin', 'editor'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/user_management',
  //   component: Layout,
  //   redirect: '/user_management',
  //   alwaysShow: true,
  //   meta: { title: 'userManagement', icon: 'el-icon-user-solid' },
  //   children: [
  //     {
  //       path: 'user',
  //       component: () => import('@/views/user_management/index'),
  //       name: 'user_management',
  //       meta: { title: 'userManagement', roles: ['admin', 'editor'] }
  //     }
  //   ]
  // },
  /** 自定义路由=========over==========**/
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    // redirect: '/basic_management/line'
    // redirect: '/icon/index'
    redirect: '/system_administrations/configuration'
  }
  // { path: '*', redirect: '/404', hidden: true }

  // {
  //   path: "/redirect",
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: "/redirect/:path(.*)",
  //       component: () => import("@/views/redirect/index"),
  //     },
  //   ],
  // },

  //   {
  //     path: "/documentation",
  //     component: Layout,
  //     children: [
  //       {
  //         path: "index",
  //         component: () => import("@/views/documentation/index"),
  //         name: "Documentation",
  //         meta: { title: "documentation", icon: "documentation", affix: true },
  //       },
  //     ],
  //   },
  //   {
  //     path: "/guide",
  //     component: Layout,
  //     redirect: "/guide/index",
  //     children: [
  //       {
  //         path: "index",
  //         component: () => import("@/views/guide/index"),
  //         name: "Guide",
  //         meta: { title: "guide", icon: "guide", noCache: true },
  //       },
  //     ],
  //   },
  //   {
  //     path: "/profile",
  //     component: Layout,
  //     redirect: "/profile/index",
  //     hidden: true,
  //     children: [
  //       {
  //         path: "index",
  //         component: () => import("@/views/profile/index"),
  //         name: "Profile",
  //         meta: { title: "profile", icon: "user", noCache: true },
  //       },
  //     ],
  //   },
]

// /**
//  * asyncRoutes
//  * the routes that need to be dynamically loaded based on user roles
//  */

//   export const asyncRoutes = [
//     {
//       path: "/permission",
//       component: Layout,
//       redirect: "/permission/page",
//       alwaysShow: true, // will always show the root menu
//       name: "Permission",
//       meta: {
//         title: "permission",
//         icon: "lock",
//         roles: ["admin", "editor"], // you can set roles in root nav
//       },
//       children: [
//         {
//           path: "page",
//           component: () => import("@/views/permission/page"),
//           name: "PagePermission",
//           meta: {
//             title: "pagePermission",
//             roles: ["admin"], // or you can only set roles in sub nav
//           },
//         },
//         {
//           path: "directive",
//           component: () => import("@/views/permission/directive"),
//           name: "DirectivePermission",
//           meta: {
//             title: "directivePermission",
//             // if do not set roles, means: this page does not require permission
//           },
//         },
//         {
//           path: "role",
//           component: () => import("@/views/permission/role"),
//           name: "RolePermission",
//           meta: {
//             title: "rolePermission",
//             roles: ["admin"],
//           },
//         },
//       ],
//     },

//     {
//       path: "/icon",
//       component: Layout,
//       children: [
//         {
//           path: "index",
//           component: () => import("@/views/icons/index"),
//           name: "Icons",
//           meta: { title: "icons", icon: "icon", noCache: true },
//         },
//       ],
//     },

//     /** when your routing map is too long, you can split it into small modules **/
//     componentsRouter,
//     chartsRouter,
//     nestedRouter,
//     tableRouter,
//     {
//       path: "/example",
//       component: Layout,
//       redirect: "/example/list",
//       name: "Example",
//       meta: {
//         title: "example",
//         icon: "el-icon-s-help",
//       },
//       children: [
//         {
//           path: "create",
//           component: () => import("@/views/example/create"),
//           name: "CreateArticle",
//           meta: { title: "createArticle", icon: "edit" },
//         },
//         {
//           path: "edit/:id(\\d+)",
//           component: () => import("@/views/example/edit"),
//           name: "EditArticle",
//           meta: {
//             title: "editArticle",
//             noCache: true,
//             activeMenu: "/example/list",
//           },
//           hidden: true,
//         },
//         {
//           path: "list",
//           component: () => import("@/views/example/list"),
//           name: "ArticleList",
//           meta: { title: "articleList", icon: "list" },
//         },
//       ],
//     },

//     {
//       path: "/tab",
//       component: Layout,
//       children: [
//         {
//           path: "index",
//           component: () => import("@/views/tab/index"),
//           name: "Tab",
//           meta: { title: "tab", icon: "tab" },
//         },
//       ],
//     },

//     {
//       path: "/error",
//       component: Layout,
//       redirect: "noRedirect",
//       name: "ErrorPages",
//       meta: {
//         title: "errorPages",
//         icon: "404",
//       },
//       children: [
//         {
//           path: "401",
//           component: () => import("@/views/error-page/401"),
//           name: "Page401",
//           meta: { title: "page401", noCache: true },
//         },
//         {
//           path: "404",
//           component: () => import("@/views/error-page/404"),
//           name: "Page404",
//           meta: { title: "page404", noCache: true },
//         },
//       ],
//     },

//     {
//       path: "/error-log",
//       component: Layout,
//       children: [
//         {
//           path: "log",
//           component: () => import("@/views/error-log/index"),
//           name: "ErrorLog",
//           meta: { title: "errorLog", icon: "bug" },
//         },
//       ],
//     },

//     {
//       path: "/excel",
//       component: Layout,
//       redirect: "/excel/export-excel",
//       name: "Excel",
//       meta: {
//         title: "excel",
//         icon: "excel",
//       },
//       children: [
//         {
//           path: "export-excel",
//           component: () => import("@/views/excel/export-excel"),
//           name: "ExportExcel",
//           meta: { title: "exportExcel" },
//         },
//         {
//           path: "export-selected-excel",
//           component: () => import("@/views/excel/select-excel"),
//           name: "SelectExcel",
//           meta: { title: "selectExcel" },
//         },
//         {
//           path: "export-merge-header",
//           component: () => import("@/views/excel/merge-header"),
//           name: "MergeHeader",
//           meta: { title: "mergeHeader" },
//         },
//         {
//           path: "upload-excel",
//           component: () => import("@/views/excel/upload-excel"),
//           name: "UploadExcel",
//           meta: { title: "uploadExcel" },
//         },
//       ],
//     },

//     {
//       path: "/zip",
//       component: Layout,
//       redirect: "/zip/download",
//       alwaysShow: true,
//       name: "Zip",
//       meta: { title: "zip", icon: "zip" },
//       children: [
//         {
//           path: "download",
//           component: () => import("@/views/zip/index"),
//           name: "ExportZip",
//           meta: { title: "exportZip" },
//         },
//       ],
//     },

//     {
//       path: "/pdf",
//       component: Layout,
//       redirect: "/pdf/index",
//       children: [
//         {
//           path: "index",
//           component: () => import("@/views/pdf/index"),
//           name: "PDF",
//           meta: { title: "pdf", icon: "pdf" },
//         },
//       ],
//     },
//     {
//       path: "/pdf/download",
//       component: () => import("@/views/pdf/download"),
//       hidden: true,
//     },

//     {
//       path: "/theme",
//       component: Layout,
//       children: [
//         {
//           path: "index",
//           component: () => import("@/views/theme/index"),
//           name: "Theme",
//           meta: { title: "theme", icon: "theme" },
//         },
//       ],
//     },

//     {
//       path: "/clipboard",
//       component: Layout,
//       children: [
//         {
//           path: "index",
//           component: () => import("@/views/clipboard/index"),
//           name: "ClipboardDemo",
//           meta: { title: "clipboardDemo", icon: "clipboard" },
//         },
//       ],
//     },

//     {
//       path: "/i18n",
//       component: Layout,
//       children: [
//         {
//           path: "index",
//           component: () => import("@/views/i18n-demo/index"),
//           name: "I18n",
//           meta: { title: "i18n", icon: "international" },
//         },
//       ],
//     },

//     {
//       path: "external-link",
//       component: Layout,
//       children: [
//         {
//           path: "https://github.com/PanJiaChen/vue-element-admin",
//           meta: { title: "externalLink", icon: "link" },
//         },
//       ],
//     },

//   // 404 page must be placed at the end !!!
//   { path: "*", redirect: "/404", hidden: true },
// ];
export const asyncRoutes = []

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
