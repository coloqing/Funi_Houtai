import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Cookies from 'js-cookie'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  id: ''
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ID: (state, roles) => {
    state.id = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          // 打印登录数据
          console.log('打印登录信息', response.data)
          console.log('打印登录信息type', response.data.token_type)
          const token = `${response.data.token_type} ${response.data.token}`
          console.log('完整的token', token)
          commit('SET_TOKEN', token)
          commit('SET_ID', response.data.user_id)
          Cookies.set('userId', response.data.user_id, { expires: 7 })
          // user_id = response.user_id
          setToken(token)
          // const { data } = response
          // setToken(data.token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // get user info
  // 静态获取用户数据
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     let data = {
  //       roles: ["admin"],
  //       introduction: "I am a super administrator",
  //       avatar:
  //         "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
  //       name: "Super Admin",
  //       orgId: 2,
  //       orgName: null,
  //       roleId: 1,
  //     };
  //     // let data = {
  //     //   roles: ["管理员"],
  //     //   introduction: "I am a super administrator",
  //     //   avatar:
  //     //     "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
  //     //   name: "Super Admin",
  //     //   loginName: "admin",
  //     //   // orgId: 2,
  //     //   // orgName: null,
  //     //   // roleId: 1,
  //     // };
  //     const { roles, name, avatar, introduction } = data;

  //     // roles must be a non-empty array
  //     // if (!roles || roles.length <= 0) {
  //     //   reject("getInfo: roles must be a non-null array!");
  //     // }

  //     commit("SET_ROLES", roles);
  //     commit("SET_NAME", name);
  //     commit("SET_AVATAR", avatar);
  //     commit("SET_INTRODUCTION", introduction);
  //     resolve(data);
  //   });
  // },
  // 动态获取用户数据
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.id || Cookies.get('userId'))
        .then((response) => {
          console.log('获取用户数据', response.data)
          const data = response.data
          // data.roles[0] = data.loginName
          // console.log(typeof data);
          // if (!data) {
          //   reject('Verification failed, please Login again.')
          // }
          // const { roles, name, avatar, introduction } = data

          // roles must be a non-empty array
          // if (!roles || roles.length <= 0) {
          //   reject('getInfo: roles must be a non-null array!')
          // }

          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          commit('SET_ID', data.id)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token)
      //   .then(() => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
      // })
      // .catch((error) => {
      //   reject(error);
      // });
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // 添加到路由表
    console.log('添加路由到router', accessRoutes)
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
