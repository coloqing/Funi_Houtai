<template>
  <div class="app-container lin_management">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="列车线路">
          <!-- <el-input
            v-model="listQuery.lineId"
            placeholder="线路"
            style="width: 200px; margin-right: 10px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          /> -->
          <!-- <el-form-item label="线路"> -->
            <el-select v-model="listQuery.lineId" placeholder="请选择线路">
              <el-option
                v-for="item in line_list"
                :key="item.id"
                :label="item.name"
                :value="item.lineId"
              >
              </el-option>
            </el-select>
          <!-- </el-form-item> -->
        </el-form-item>
        <el-form-item label="省-市">
          <el-cascader
            v-model="selectedOptions"
            size="large"
            :options="pcTextArr"
            style="width: 200px; margin-right: 10px; height: 32px"
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
      :data="line_list"
      :header-cell-style="{ backgroundColor: 'rgb(244, 243, 249)' }"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        align="center"
        min-width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.province === null ? "--" : row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.city === null ? "--" : row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="线路" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name === null ? "--" : row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编组" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.grouping === null ? "--" : row.grouping }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单节车设备数" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.devicePerCarriage === null ? "--" : row.devicePerCarriage
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
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
            @click="handleDelete(row, row.id)"
          >
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
        <el-form-item label="省/市" prop="province" label-width="100px">
          <el-cascader
            v-model="temps.province"
            size="large"
            :options="pcTextArr"
            style="width: 200px; margin-right: 10px; height: 32px"
          />
        </el-form-item>

        <el-form-item label="线路" prop="name" label-width="100px">
          <el-input v-model="temps.name" placeholder="请选择线路" />
        </el-form-item>
        <el-form-item label="单车节设备数" label-width="100px">
          <el-input v-model="temps.grouping" placeholder="请选择单车节设备数" />
        </el-form-item>
        <el-form-item label="编组" label-width="100px">
          <el-input
            v-model="temps.devicePerCarriage"
            placeholder="请输入编组"
          />
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
  fetchList,
  fetchPv,
  createArticle,
  updateArticle,
} from "@/api/article";
import {
  Lines,
  addLines,
  updateLines,
} from "@/api/basic_management/line-management";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
// 地址选择器
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
      line_list:null,
      total: 0,
      listLoading: true,
      // 新增/修改 对应表单
      temps: {
        id: "",
        province: "",
        city: "",
        name: "",
        grouping: "",
        devicePerCarriage: "",
      },

      // -------------------------
      listQuery: {
        // 线路
        lineId: undefined,
        // 省
        province: undefined,
        // 市
        city: undefined,
        pageIndex: 1,
        pageRow: 10,
        // importance: undefined,
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
    getList(form) {
      this.listLoading = true;
      // if (form) {
      //   Lines(this.listQuery).then((response) => {
      //     console.log("线路管理list", response);
      //     this.line_list = response.data;
      //     this.total = response.total;
      //     this.listLoading = false;
      //   });
      // } else {
      Lines(this.listQuery).then((response) => {
        // console.log("线路管理list", response);
        this.line_list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
      // }
    },
    // 清除temps
    clear_temps() {
      this.temps = {
        id: "",
        province: "",
        city: "",
        name: "",
        grouping: "",
        devicePerCarriage: "",
      };
      this.selectedOptions = [];
    },
    clear_listQuery() {
      this.listQuery = {
        // 线路
        lineId: undefined,
        // 省
        province: undefined,
        // 市
        city: undefined,
        pageIndex: 1,
        pageRow: 10,
      };
    },
    handleFilter() {
      //  selectedOptions   listQuery
      // 省 province   市 city
      this.listQuery.pageIndex = 1;
      this.listQuery.province = this.selectedOptions[0];
      this.listQuery.city = this.selectedOptions[1];

      this.getList(this.listQuery);
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
      // 清除temps
      this.clear_temps();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 取消新增 或者 取消修改
    cancel_adjust() {
      this.clear_temps();
      this.dialogFormVisible = false;
    },

    // 新增线路
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          addLines(this.temps).then((res) => {
            // console.log("新增线路", res);
            this.getList();
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
      this.temps = Object.assign({}, row); // copy obj
      let tmp = this.temps.province;
      this.temps.province = [tmp, this.temps.city];
      // this.temp.timestamp = new Date(this.temp.timestamp);
      // console.log("操作的对象", this.temp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 修改线路
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temps);
          // tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateLines(tempData).then(() => {
            // const index = this.list.findIndex((v) => v.id === this.temp.id);
            // this.list.splice(index, 1, this.temp);
            this.listQuery.province = this.selectedOptions[0];
            this.listQuery.city = this.selectedOptions[1];
            this.getList(this.listQuery);
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
      this.$confirm("此操作将永久删除id为 "+ index +" 的线路, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确认删除的逻辑
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          // 取消删除的逻辑
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    // 重置
    handleDownload() {
      this.clear_temps(); //多余
      this.clear_listQuery();
      this.getList();
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
