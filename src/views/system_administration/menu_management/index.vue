<template>
  <div class="app-container">
    <!-- 搜索 -->
    <!-- <div class="filter-container" style="display: flex; align-items: baseline">
        线路
        <el-input
          v-model="from.title"
          placeholder="线路"
          style="width: 200px; margin-right: 10px"
          class="filter-item"
          @keyup.enter.native=""
        />
        列车号
        <el-input
          v-model="from.Options"
          placeholder="列车号"
          style="width: 200px; margin-right: 10px"
          class="filter-item"
          @keyup.enter.native=""
        />

        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click=""
        >
          {{ $t("table.search") }}
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-edit"
          @click=""
        >
          新增
        </el-button>
      </div> -->
    <!-- 表格内容 -->
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      :header-cell-style="{ backgroundColor: 'rgb(244, 243, 249)' }"
      border
    >
      <el-table-column prop="name" label="菜单名称" min-width="180" align="center" />
      <el-table-column prop="meta.roles" label="角色权限" min-width="300" align="center" />
      <el-table-column label="组件路径" min-width="300">
        <template slot-scope="{ row }" align="center">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="date" label="创建时间" min-width="180" align="center">
      </el-table-column> -->
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        min-width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button v-if="!row.bol" type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button type="primary" size="mini">
            <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)"> -->
            新增
          </el-button>
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="edit" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px">
        <el-form-item label="名称" prop="coachType" label-width="120px">
          <el-input v-model="temp.name" placeholder="请输入部件编码" />
        </el-form-item>
        <el-form-item label="角色权限" label-width="120px">
          <!-- <el-input v-model="temp.meta.roles" placeholder="请输入关联性能指标id" /> -->
          <el-select v-model="roles" multiple collapse-tags placeholder="请选择关联性能指标">
            <el-option v-for="item in user_list" :key="item.name" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="组件路径" label-width="120px">
          <el-input v-model="temp.path" placeholder="请输入部件名称" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getRoute } from '@/api/user'
import { getRole } from '@/api/system_administration/role_management'
import { Update } from '@/api/system_administration/menu_management'
// 获取所有角色
export default {
  data() {
    return {
      dialogFormVisible: false,
      // 表格数据
      tableData: [],
      // 角色
      user_list: [],
      // 查询数据
      from: {},
      temp: {

      },
      roles: []
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 查询路由
    getList() {
      getRoute().then((res) => {
        console.log('获取到对于的路由', res.data)
        if (res.code === 200) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].bol = true
          }
          this.tableData = res.data
        } else {
          console.error('路由接口获取失败')
        }
      })
      // 获取角色
      getRole().then((response) => {
        if (response.success) {
          console.log('角色列表list:', response)
          this.user_list = response.data
        } else {
          console.error('角色列表接口获取失败')
        }
      })
    },
    // 弹出层
    handleUpdate(row) {
      // console.log(row);
      this.temp = Object.assign({}, row) // copy obj
      const arr = []
      this.roles = this.temp.meta.roles
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 确定修改
    updateData() {
      console.log('进行修改')

      // this.temp.meta.roles = this.roles
      let str_roles = ''
      for (let i = 0; i < this.roles.length; i++) {
        if (this.roles.length - 1 === i) {
          str_roles += this.roles[i]
        } else {
          str_roles += this.roles[i] + ','
        }
      }
      console.log('修改', str_roles)
      Update(this.temp, str_roles).then((response) => {
        if (response.success) {
          console.log('修改', response)
          this.getList()
          this.dialogFormVisible = false,

          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        } else {
          console.error('修改失败')
        }
      })
    },
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: 'wangxiaohu'
          },
          {
            id: 32,
            date: '2016-05-01',
            name: 'wangxiaohu'
          }
        ])
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped></style>
