<template>
  <div class="app-container lin_management">
    <div class="filter-container" style="display: flex; align-items: baseline">
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
            v-model="form.name"
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
        sortable="custom"
        align="center"
        min-width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备编码" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.coachType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="列车号" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="线网名称" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.wlname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showReviewer"
        label="中心名称"
        min-width="110px"
        align="center"
      >
        <template slot-scope="{ row }" align="center">
          <span style="color: red">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="线路名称" min-width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.lineName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车品类型" min-width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车厢号" min-width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.chexhao }}</span>
        </template>
      </el-table-column>
      <el-table-column label="列车类型" min-width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.lieleix }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机组数量" min-width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.trainNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="空调类型" min-width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ktiaoleix }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="230"
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
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
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
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temps"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="设备编码" prop="coachType" label-width="100px">
          <el-input v-model="temp.coachType" placeholder="请输入设备编码" />
        </el-form-item>
        <el-form-item label="列车号" label-width="100px">
          <el-input v-model="temp.name" placeholder="请输入网线名称" />
        </el-form-item>
        <el-form-item label="线路名称" label-width="100px">
          <el-input v-model="temp.lineName" placeholder="请输入网线名称" />
        </el-form-item>
        <el-form-item label="车品类型" label-width="100px">
          <el-input v-model="temp.sn" placeholder="请输入车品类型" />
        </el-form-item>
        <!-- <el-form-item label="列车类型" label-width="100px" >
          <el-input v-model="temp.lcleix" placeholder="请输入列车类型" />
        </el-form-item> -->
        <el-form-item label="机组数量" label-width="100px">
          <el-input v-model="temp.trainNum" placeholder="请输入机组数量" />
        </el-form-item>
        <!-- <el-form-item label="空调类型" label-width="100px" >
          <el-input v-model="temp.ktiao" placeholder="请输入空调类型" />
        </el-form-item> -->
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
  fetchPv,
  createArticle,
  updateArticle,
} from "@/api/article";
import {
  fetchList,
  createList,
  Update,
  Delete,
} from "@/api/basic_management/parts-management";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
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

      tableKey: 0,
      parts_list: [
        {
          id: "1",
          coachType: "end",
          name: "G100001",
          wlname: "wlx",
          lineName: "10001",
          sn: "1",
          chexhao: "01",
          lieleix: "A",
          trainNum: "2",
          ktiaoleix: "M",
        },
      ],
      total: 0,
      listLoading: true,

      form: {
        xianlu: "",
        name: "",
        pageIndex: 1,
        pageRow: 10,
      },
      temps: {
        coachType: "",
        id: "",
        lineName: "",
        name: "",
        sn: "",
        trainNum: "",
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
        coachType: "",
        // id: "",
        lineName: "",
        name: "",
        sn: "",
        trainNum: "",
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
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.parts_list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
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
        coachType: "",
        // id: "",
        lineName: "",
        name: "",
        sn: "",
        trainNum: "",
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
          createList(this.temp).then((res) => {
            console.log("新增", res);
            if (res.success) {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000,
              });
            } else {
              console.error("新增失败");
            }
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
          // tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          Update(tempData).then((res) => {
            console.log("修改设备信息", res);
            // this.getList();
            if (res.success) {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000,
              });
            } else {
              console.error("新增失败");
            }
          });
        }
      });
    },
    handleDelete(row, index) {
      Delete({id:row.id}).then((res) => {
        console.log("删除设备", res);
        if (res.success) {
          this.getList();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
        } else {
          console.error("删除失败");
        }
      });
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
