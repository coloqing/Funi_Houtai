<template>
  <div class="app-container lin_management">
    <div class="filter-container" style="display: flex; align-items: baseline">
      <el-form :inline="true">
        <el-form-item label="用户昵称">
          <el-input
            v-model="form.loginName"
            placeholder="请输入用户昵称"
            style="width: 200px; margin-right: 10px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="用户身份">
          <el-input
            v-model="form.loginName"
            placeholder="请输入用户身份"
            style="width: 200px; margin-right: 10px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <!-- <el-form-item label="用户id">
          <el-input
            v-model="form.id"+
            placeholder="请输入用户id"
            style="width: 200px; margin-right: 10px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item> -->
        <!-- 功能按钮 -->
        <el-form-item>
          <el-button
            v-waves
            :loading="downloadLoading"
            class="filter-item"
            type="primary"
            icon="el-icon-refresh"
            @click="handleDownload"
          >
            重置
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
          >
            新增
          </el-button>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="user_list"
      border
      fit
      highlight-current-row
      :header-cell-style="{ backgroundColor: 'rgb(244, 243, 249)' }"
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        min-width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户身份" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ user_role(row.roleId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone === null ? "--" : row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改"
        align="center"
        min-width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, row.id)"
          >
            删除
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate2(row)">
            更多
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageRow"
      @pagination="getList"
    />
    <!-- 新增/修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temps"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <!-- 新建用户 -->
        <el-form-item
          v-if="dialogStatus === 'create'"
          label="账号"
          prop="loginName"
          label-width="100px"
        >
          <el-input v-model="temps.loginName" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'create'"
          label="密码"
          prop="loginName"
          label-width="100px"
        >
          <el-input v-model="temps.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'create'"
          label="手机号"
          prop="phone"
          label-width="100px"
        >
          <el-input v-model="temps.phone" placeholder="请输入手机号" />
        </el-form-item>
        <!-- 修改 -->
        <el-form-item
          v-if="dialogStatus !== 'create'"
          label="用户id"
          prop="loginName"
          label-width="100px"
        >
          <el-input v-model="temps.id" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item
          v-if="dialogStatus !== 'create'"
          label="原密码"
          prop="loginName"
          label-width="100px"
        >
          <el-input v-model="temps.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item
          v-if="dialogStatus !== 'create'"
          label="新密码"
          prop="phone"
          label-width="100px"
        >
          <el-input v-model="temps.newPassword" placeholder="请输入新密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取 消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

    <!-- 更多 -->
    <el-dialog title="修改用户身份" :visible.sync="dialogFormVisible2">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户id" prop="title" label-width="100px">
          <el-input v-model="temp.userId" placeholder="请输入用户身份" />
        </el-form-item>

        <el-form-item label="用户身份" prop="title" label-width="100px">
          <el-select
            v-model="temp.roleId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in Role_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false"> 取 消 </el-button>
        <el-button type="primary" @click="createData2()"> 确 定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{
          $t("table.confirm")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  // fetchList,
  fetchPv
  // createArticle,
  // updateArticle,
} from '@/api/article'
import {
  getRole,
  fetchList,
  createArticle,
  updateArticle,
  modRole,
  Delete
} from '@/api/user_management/user'
// import { getRoles } from '@/api/system_administration/role_management'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// 地址选择器
import { pcTextArr } from 'element-china-area-data'
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      // 地址选择器
      pcTextArr,
      selectedOptions: [],
      // 用户密码 身份修改
      dialogFormVisible2: false,
      // 查询
      form: {
        loginName: '',
        loginName: ''
      },
      // 修改 或 新增
      temps: {
        loginName: '',
        password: '',
        phone: '',
        avatar:
          'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        introduction: 'Permissions'
      },
      //   ------------------------------
      tableKey: 0,
      user_list: [
        {
          id: '1',
          loginName: '132541',
          loginName: 'admin',
          phone: '17325465221',
          createdTime: '2024-9-28'
        },
        {
          id: '2',
          loginName: '132542',
          loginName: 'admin',
          phone: '17332546844',
          createdTime: '2024-9-28'
        },
        {
          id: '3',
          loginName: '132543',
          loginName: 'admin',
          phone: '17236548554',
          createdTime: '2024-9-28'
        },
        {
          id: '4',
          loginName: '132544',
          loginName: 'admin',
          phone: '17548954654',
          createdTime: '2024-9-28'
        }
      ],
      // 角色列表
      Role_list: [],

      total: 4,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageRow: 10
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: "+id",
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: '请输入省市', trigger: 'change' }],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [{ required: true, message: '请输入线路', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getRoleList()
  },
  methods: {
    // 获取用户数据列表
    getList(data) {
      this.listLoading = true
      // if (data) {
      fetchList(this.listQuery).then((response) => {
        if (response.code === 200) {
          // this.list = response.data;
          this.user_list = response.data
          this.total = response.data.length
          this.listLoading = false
        } else {
          console.err('获取用户数据接口执行失败')
        }
      })
      // } else {
      //   fetchList().then((response) => {
      //     if (response.code === 200) {
      //       // this.list = response.data;
      //       this.user_list = response.data;
      //       this.total = response.data.length;
      //       this.listLoading = false;
      //     } else {
      //       console.err("获取用户数据接口执行失败");
      //     }
      //   });
      // }
      // this.listLoading = false;
    },
    // 获取系统角色列表
    getRoleList() {
      getRole().then((response) => {
        if (response.code === 200) {
          this.Role_list = response.data
        } else {
          console.err('获取用户数据接口执行失败')
        }
      })
    },
    // 通过roleid 获取到 对应角色
    user_role(user){
      for (let i = 0; i < this.Role_list.length; i++) {
        if (this.Role_list[i].id === user) {
          return this.Role_list[i].name
        }else{
          if (this.Role_list.length -1 === i) {
            return '无匹配角色'
          }
        }

      }

    },


    handleFilter() {
      this.listQuery.pageIndex = 1
      // this.getList(this.form);
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      (this.temps = {
        loginName: '',
        password: '',
        phone: '',
        avatar:
          'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        introduction: 'Permissions'
      }),
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          // this.temp.author = "vue-element-admin";
          createArticle(this.temps).then((res) => {
            console.log('新增用户', res)
            if (res.success) {
              this.getList()
              // this.list.unshift(this.temp);
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '' + res.message,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '' + res.message,
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 修改用户角色身份
    createData2() {
      modRole(this.temp).then((response) => {
        if (response.success) {
          this.$notify({
            title: '成功',
            message: '' + response.message,
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.dialogFormVisible2 = false
        } else {
          console.error('修改用户角色身份失败')
        }
      })
    },
    handleUpdate(row) {
      this.temps = Object.assign({}, row)
      // 去除加密后的密码,设置为空
      this.temps.password = ''
      // this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate2(row) {
      this.temp = Object.assign({}, row) // copy obj
      // let temp_ = Object.assign({}, row); // copy obj
      // this.temp = {};
      this.temp.userId = this.temp.id
      // this.temp.roleId = temp_.roleId;
      this.dialogStatus = ''
      // this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogFormVisible2 = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateArticle(this.temps).then((res) => {
            console.log('修改用户密码', res)
            if (res.success) {
              this.getList()
              this.$notify({
                title: '成功',
                message: '' + res.message,
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
            } else {
              console.log('修改用户密码失败', res)
            }
          })
        }
      })
    },
    // 删除用户
    handleDelete(row, index) {
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
          Delete(row).then((res) => {
            console.log('删除用户', res)
            if (res.success) {
              this.getList()
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
    //
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.listQuery = {
        pageIndex: 1,
        pageRow: 10
      }
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style>
/* 调整地址选择器高度 */
.lin_management .el-input__inner {
  height: 32px;
}
</style>
