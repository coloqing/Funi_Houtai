<template>
  <div class="app-container lin_management">
    <div class="filter-container" style="display: flex; align-items: baseline">
      <el-form :inline="true">
        <!-- <el-form-item label="线路">
          <el-select v-model="listQuery.lineName" placeholder="请选择线路">
            <el-option v-for="item in line_list" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="指标名称">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入指标名称"
            style="width: 200px; margin-right: 10px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
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

          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="parts_list"
      border
      :header-cell-style="{ backgroundColor: 'rgb(244, 243, 249)' }"
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="序号"
        prop="id"
        align="center"
        min-width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指标名称" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大阈值" min-width="110px" align="center">
        <template slot-scope="{ row }" align="center">
          <span>{{ row.max }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最小阈值" min-width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.min }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联的信号量编码" min-width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.signalCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, row.id)">
            删除
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temps"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="指标名称" prop="coachType" label-width="130px">
          <el-input v-model="temp.name" placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="最大阈值" label-width="130px">
          <el-input v-model="temp.max" placeholder="请输入最大阈值" />
        </el-form-item>
        <el-form-item label="最小阈值" label-width="130px">
          <el-input v-model="temp.min" placeholder="请输入最小阈值" />
        </el-form-item>
        <el-form-item label="关联的信号量编码" label-width="130px">
          <!-- <el-input v-model="temp.indicatorsIds" placeholder="请输入关联性能指标id" /> -->
          <!-- <el-select v-model="temp.indicatorsIds" multiple collapse-tags placeholder="请选择信号量编码">
            <el-option v-for="item in parts_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>-->
          <el-select v-model="temp.signalCode" filterable placeholder="请选择信号量编码">
            <el-option v-for="item in parts_options" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
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
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
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
  fetchPv
} from '@/api/article'
import {
  fetchList_Indicators,
  createList,
  Update,
  Delete
} from '@/api/basic_management/performance_metrics'
import { fetchList_Signal } from '@/api/basic_management/semaphore'
// import { Lines } from "@/api/basic_management/line-management";

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
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
  name: 'Parts',
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
      parts_options: [
        {
          value: 1,
          label: '黄金糕'
        }, {
          value: 2,
          label: '双皮奶'
        }, {
          value: 3,
          label: '蚵仔煎'
        }, {
          value: 4,
          label: '龙须面'
        }, {
          value: 5,
          label: '北京烤鸭'
        }
      ],
      tableKey: 0,
      parts_list: [
        {
          id: '1',
          coachType: 'end',
          name: 'G100001',
          wlname: 'wlx',
          lineName: '10001',
          sn: '1',
          chexhao: '01',
          lieleix: 'A',
          trainNum: '2',
          ktiaoleix: 'M'
        }
      ],
      total: 0,
      listLoading: true,
      // 列车线路
      line_list: null,
      form: {
        xianlu: '',
        name: '',
        pageIndex: 1,
        pageRow: 10
      },
      temps: {
        coachType: '',
        id: '',
        lineName: '',
        name: '',
        sn: '',
        trainNum: ''
      },

      // ---------------------
      // arr: [
      //   {
      //     id: 1,
      //     path: "/root",
      //     component: "root",
      //     redirect: "1",
      //     alwaysShow: true,
      //     meta: { title: "1", icon: "1" },
      //     children: [
      //       {
      //         id: 2,
      //         path: "/2",
      //         component: "root",
      //         redirect: "2",
      //         alwaysShow: true,
      //         meta: { title: "2", icon: "2" },
      //       },
      //     ],
      //   },
      // ],
      listQuery: {
        pageIndex: 1,
        pageRow: 10,
        lineName: undefined,
        trainNum: undefined
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
        signalCode: null,
        max: null,
        min: null,
        name: null
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
    this.getLines()
  },
  methods: {
    // 获取表格数据
    getList() {
      this.listLoading = true
      fetchList_Indicators(this.listQuery).then((response) => {
        this.parts_list = response.data
        // console.log('获取部件管理', this.parts_list)

        this.total = response.total
        this.listLoading = false
      })
    },
    // 获取所有信号量
    getLines() {
      fetchList_Signal().then((response) => {
        // console.log("信号量", response);
        this.parts_options = response.data
      })
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
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
        signalCode: null,
        max: null,
        min: null,
        name: null
      }
    },
    handleCreate() {
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
          createList(this.temp).then((res) => {
            // console.log('新增', res)
            if (res.success) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              console.error('新增失败')
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          Update(tempData).then((res) => {
            // console.log('修改设备信息', res)
            // this.getList();
            if (res.success) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              console.error('新增失败')
            }
          })
        }
      })
    },
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
          Delete({ id: index }).then((res) => {
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
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.listQuery = {
        pageIndex: 1,
        pageRow: 10,
        lineName: undefined,
        trainNum: undefined
      }
      this.getList()
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
