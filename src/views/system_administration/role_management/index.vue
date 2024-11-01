<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">
      {{ $t("permission.addRole") }}
    </el-button>

    <el-table
      :data="line_list"
      style="width: 100%; margin-top: 30px"
      border
      :header-cell-style="{ backgroundColor: 'rgb(244, 243, 249)' }"
    >
      <!-- <el-table-column align="center" label="Role Key" width="220">
          <template slot-scope="scope">
            {{ scope.row.key }}
          </template>
        </el-table-column> -->
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="header-center" label="权限描述">
        <template slot-scope="scope">
          {{ scope.row.apiIds }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            {{ $t("permission.editPermission") }}
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row, scope.row.id)"
          >
            {{ $t("permission.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? 'Edit Role' : 'New Role'"
    >
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色昵称">
          <el-input v-model="role.name" placeholder="请输入角色昵称" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-input
            v-model="role_apiName"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入权限范围"
          />
        </el-form-item>
        <!-- <el-form-item label="权限范围">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            @check-change="check_change"
            show-checkbox
            node-key="id"
            class="permission-tree"
            :default-checked-keys="checkedKeys"
          />
        </el-form-item> -->
        <!-- ref="tree"     设置名称，方便后面使用tree方法
            v-model="roleForm.roleMenus"   绑定tree结构选中的值，该值要与对应的form-item中的prop的值一样
            :data="menuList"    用来绑定tree中渲染的值
            show-checkbox       用来确定节点是否可以选择
            node-key="id"    用来表示节点的属性，应该是唯一的
            @check-change="check_change"   节点选中状态发生变化时的回调
            :props="defaultProps"    用来设置子节点如何展示
            :default-checked-keys="checkedKeys"    默认勾选的数组 -->
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="ccc()">
          {{ $t("permission.cancel") }}
        </el-button>
        <!-- <el-button type="primary" @click="confirmRole"> -->
        <el-button
          type="primary"
          @click="dialogType === 'New Role' ? confirmRole() : confirmEdit()"
        >
          {{ $t("permission.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import {
  getRoutes,
  getRoles,
  // addRole,
  deleteRole
  // updateRole,
} from '@/api/role'
import i18n from '@/lang'
// ali
import {
  getRole,
  addRole,
  updateRole,
  getApi,
  Delect
} from '@/api/system_administration/role_management'

const defaultRole = {
  // key: "",
  name: '',
  apiIds: ''
  // description: "",
  // routes: [],
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 角色列表
      line_list: null,
      // 点击修改权限时默认勾选的值
      checkedKeys: null,
      // 显示的权限范围
      role_apiName: ''
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getList()
    this.getApi()
  },
  methods: {
    // ali
    getList(form) {
      this.listLoading = true
      getRole().then((response) => {
        if (response.success) {
          console.log('角色列表list:', response)
          this.line_list = response.data
          this.total = response.data.length
          this.listLoading = false
        } else {
          console.error('角色列表接口获取失败')
        }
      })
    },
    getApi(form) {
      getApi().then((response) => {
        if (response.success) {
          console.log('获取接口url:', response)
          this.routes = response.data
        } else {
          console.error('获取接口url失败')
        }
      })
    },
    ccc() {
      this.dialogVisible = false
      this.$refs.tree.setCheckedKeys([])
    },
    // ali----voer-------
    // 勾选权限范围
    check_change() {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      const checkedKeys = checkedNodes.map((node) => [node.id, node.name]) // 假设每个节点的id是唯一标识
      this.role.apiIds = ''
      this.role_apiName = ''
      for (let i = 0; i < checkedKeys.length; i++) {
        if (i !== checkedKeys.length - 1) {
          this.role.apiIds += checkedKeys[i][0] + ','
          this.role_apiName += checkedKeys[i][1] + ','
        } else {
          this.role.apiIds += checkedKeys[i][0]
          this.role_apiName += checkedKeys[i][1]
        }
      }
    },

    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      const routes = this.generateRoutes(res.data)
      this.routes = this.i18n(routes)
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    i18n(routes) {
      const app = routes.map((route) => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue
        }

        const onlyOneShowingChild = this.onlyOneShowingChild(
          route.children,
          route
        )

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach((route) => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      // 默认选中
      const tmp = scope.row.apiIds.split(',')
      this.checkedKeys = tmp
      this.role = deepClone(scope.row)
      // this.$nextTick(() => {
      //   const routes = this.generateRoutes(this.role.routes);
      //   this.$refs.tree.setCheckedNodes(this.generateArr(routes));
      //   // set checked state of a node not affects its father and child nodes
      //   this.checkStrictly = false;
      // });
    },
    handleDelete(row, index) {
      console.log('进行删除', row, index)

      this.$confirm(
        '此操作将永久删除id为 ' + index + ' 的线路, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          Delect({ id: index }).then((res) => {
            if (res.success) {
              this.getList()
              // 确认删除的逻辑
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'info',
                message: '删除失败'
              })
            }
          })
        })
        .catch(() => {
          // 取消删除的逻辑
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          )
        }

        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route)
        }
      }
      return res
    },
    // 新增角色
    async confirmRole() {
      addRole(this.role).then((response) => {
        if (response.success) {
          console.log('新增角色:', response)
          this.getList()
          this.dialogVisible = false
        } else {
          console.error('新增角色失败')
        }
      })

      // const isEdit = this.dialogType === "edit";
      // const checkedKeys = this.$refs.tree.getCheckedKeys();
      // this.role.routes = this.generateTree(
      //   deepClone(this.serviceRoutes),
      //   "/",
      //   checkedKeys
      // );

      // if (isEdit) {
      //   await updateRole(this.role.key, this.role);
      //   for (let index = 0; index < this.rolesList.length; index++) {
      //     if (this.rolesList[index].key === this.role.key) {
      //       this.rolesList.splice(index, 1, Object.assign({}, this.role));
      //       break;
      //     }
      //   }
      // } else {
      //   const { data } = await addRole(this.role);
      //   this.role.key = data.key;
      //   this.rolesList.push(this.role);
      // }

      // const { description, key, name } = this.role;
      // this.dialogVisible = false;
      // this.$notify({
      //   title: "Success",
      //   dangerouslyUseHTMLString: true,
      //   message: `
      //         <div>Role Key: ${key}</div>
      //         <div>Role Name: ${name}</div>
      //         <div>Description: ${description}</div>
      //       `,
      //   type: "success",
      // });
    },
    // 修改角色
    async confirmEdit() {
      updateRole(this.role).then((response) => {
        if (response.success) {
          console.log('修改角色:', response)
          this.getList()
          this.dialogVisible = false
        } else {
          console.error('修改角色失败')
        }
      })
    },

    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter((item) => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
