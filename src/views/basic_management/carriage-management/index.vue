<template>
  <div class="app-container lin_management">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="列车线路">
          <el-input
            v-model="form.xianlu"
            placeholder="线路"
            style="width: 200px; margin-right: 10px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="列车号">
          <el-input
            v-model="form.liechehao"
            placeholder="列车号"
            style="width: 200px; margin-right: 10px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <!-- 功能按钮 -->
        <el-form-item>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            搜索
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
            :loading="downloadLoading"
            class="filter-item"
            type="primary"
            icon="el-icon-refresh"
            @click="handleDownload"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" :header-cell-style="{ backgroundColor: 'rgb(244, 243, 249)' }"  style="width: 100%" border>
      <el-table-column prop="id" label="ID" min-width="100" align="center" ></el-table-column>
      <el-table-column prop="lineName" label="线路" width="180" align="center" >
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.editable"
            v-model="scope.row.lineName"
            @blur="handleBlur(scope.$index, 'lineName')"
          ></el-input>
          <span v-else>{{ scope.row.lineName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="trainNum" label="列车号" min-width="180" align="center" >
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.editable"
            v-model="scope.row.trainNum"
            @blur="handleBlur(scope.$index, 'trainNum')"
          ></el-input>
          <span v-else>{{ scope.row.trainNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="车厢号" min-width="180" align="center" >
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.editable"
            v-model="scope.row.name"
            @blur="handleBlur(scope.$index, 'name')"
          ></el-input>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="240" align="center" >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.editable"
            size="small"
            type="danger"
            @click="cancelAllEdits(scope.$index, false)"
            >取消修改</el-button
          >
          <el-button
            v-if="!isAllEditable"
            size="small"
            @click="toggleAllEdit(true)"
            >修改所有</el-button
          >
          <el-button
            v-if="isAllEditable"
            size="small"
            type="primary"
            @click="toggleAllEdit(false)"
            >修改完成</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :pageIndex.sync="listQuery.pageIndex"
      :pageRow.sync="listQuery.pageRow"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <!-- :rules="rules" -->
      <el-form
        ref="dataForm"
        :model="temps"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="线路" prop="title" label-width="100px" >
          <el-input v-model="temps.lineName" placeholder="请输入线路号" />
        </el-form-item>
        <el-form-item label="列车号" label-width="100px" >
          <el-input v-model="temps.trainNum" placeholder="请输入列车号"/>
        </el-form-item>
        <el-form-item label="车厢号" label-width="100px" >
          <el-input v-model="temps.name" placeholder="请输入列车号"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  // fetchList,
  fetchPv,
  createArticle,
  updateArticle,
} from "@/api/article";
import {
  getList,
  createCoach,
  updateCoach,
  deleteCoach
} from "@/api/basic_management/carriage-management";


import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
// 地址选择器
// import {
//   provinceAndCityData,
//   pcTextArr,
//   regionData,
//   pcaTextArr,
//   codeToText,
// } from "element-china-area-data";
import { pcTextArr } from "element-china-area-data";
const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      // 地址选择器
      pcTextArr,
      selectedOptions: [],
      // 自定义可修改
      tableData: [
        {
          id: 1,
          lineName: "线路1",
          trainNum: "T101",
          name: "01",
          editable: false,
        },
        {
          id: 1,
          lineName: "线路1",
          trainNum: "T101",
          name: "01",
          editable: false,
        },
        {
          id: 1,
          lineName: "线路1",
          trainNum: "T101",
          name: "01",
          editable: false,
        },
        // 其他数据项...
      ],
      isAllEditable: false,
      // 新增/修改 表单
      temps:{
        lineName:'', // 线路
        name:'',// 车厢号
        trainNum:''// 列车号
      },


      // =================================================
      tableKey: 0,
      list: null,
      total: 4,
      listLoading: true,

      form: {
        xianlu: "",
        liechehao: "",
      },
      // ----------------------------------------

      listQuery: {
        pageIndex: 1,
        pageRow: 10,
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: "+id",
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: "请输入省市", trigger: "change" }],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [{ required: true, message: "请输入线路", trigger: "blur" }],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // toggleEdit(index, state) {
    //   this.$set(this.tableData, index, {
    //     ...this.tableData[index],
    //     editable: state,
    //   });
    // },
    toggleAllEdit(state) {
      this.isAllEditable = state;
      this.tableData.forEach((row) => {
        row.editable = state;
      });
      if (!state) {
        // 如果点击“修改完成”，则可以在这里执行其他逻辑，比如验证数据
        console.log(this.tableData);
      }
    },
    cancelAllEdits() {
      // 取消所有行的修改状态
      this.tableData.forEach((row) => {
        row.editable = false;
      });
      this.isAllEditable = false; // 如果需要的话，也可以设置这个标志位为false
    },
    // ==================================

    getList() {
      this.listLoading = true;
      getList(this.listQuery).then((response) => {
        this.tableData = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
        this.listLoading = false;
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success",
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          // this.temp.author = "vue-element-admin";
          createCoach(this.temps).then((res) => {
            console.log('进行新增',res);
            // this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>

<style>
/* 调整地址选择器高度 */
.lin_management .el-input__inner {
  height: 32px;
}
</style>
