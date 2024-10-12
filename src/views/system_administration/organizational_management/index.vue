<template>
  <div class="app-container">
    <!-- 新增 -->
    <div class="filter-container" style="display: flex; align-items: baseline">
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleAddRole"
      >
        新增
      </el-button>
    </div>
    <!-- 表格内容 -->
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :header-cell-style="{ backgroundColor: 'rgb(244, 243, 249)' }"
    >
      <el-table-column prop="name" label="部门" min-width="180" align="center">
      </el-table-column>
      <el-table-column
        prop="time"
        label="创建时间"
        min-width="180"
        align="center"
      >
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
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出层 -->
    <el-dialog :title="dialogStatus" :visible.sync="dialogVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temps"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="组织昵称" prop="name" label-width="100px">
          <el-input v-model="temps.name" placeholder="请输入组织昵称" />
        </el-form-item>

        <el-form-item label="上级菜单" prop="parentId" label-width="100px">
          <el-cascader
            v-model="selectedLeafNode"
            :options="tableData"
            :props="{ checkStrictly: true ,value: 'id', label: 'name' }"
            @change="handleChange"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="排序" prop="order" label-width="100px">
          <el-input v-model="temps.order" placeholder="请排序" />
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'new' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrgStructure,createOrgStructure,Update } from "@/api/system_administration/organizational_management";
export default {
  data() {
    return {
      // a: null,
      // 被选中的下拉菜单
      selectedLeafNode:null,
      // 新增 修改 title
      dialogStatus:null,
      // 表格数据
      tableData: [
        {
          id: 3,
          name: "wangxiaohu",
          time: "2016-05-01",
          children: [
            {
              id: 31,
              name: "wangxiaohu",
              time: "2016-05-01",
            },
            {
              id: 32,
              name: "wangxiaohu",
              time: "2016-05-01",
              children: [
                {
                  id: 41,
                  name: "wangxiaohu",
                  time: "2016-05-01",
                },
                {
                  id: 42,
                  name: "wangxiaohu",
                  time: "2016-05-01",
                },
              ],
            },
          ],
        },
        {
          id: 4,
          name: "wangxiaohu",
          time: "2016-05-03",
        },
      ],
      //查询数据
      from: {},
      // 新增/修改 表单
      temps: {
        name: "",
        parentId: null,
        order:0
      },
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
        textMap: {
          update: "Edit",
          create: "Create",
        },
      },
      textMap: "",
      // dialogVisible: false,
      dialogType: null,
      dialogVisible: false,
      // 下拉框 菜单树选项
      menuOptions: [],
    };
  },
  computed: {
    routesData() {
      return this.routes;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // 查询
    getList(form) {
      this.listLoading = true;
      getOrgStructure().then((response) => {
        if (response.success) {
          console.log("组织结构管理list:", response);
          this.tableData = response.data;
          // this.total = response.data.length;
          this.listLoading = false;
        } else {
          console.error("组织结构管理list获取失败");
        }
      });
    },
    // 点击新增
    handleAddRole() {
      this.dialogStatus = "new";
      this.dialogVisible = true;
      this.reset_temps()
      this.selectedLeafNode = null
    },
    // 新增
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if(this.temps.parentId === null){
            this.temps.parentId = 0
          }
          createOrgStructure(this.temps).then((res) => {
            console.log("新增部门", res);
            this.getList();
            this.dialogVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
            this.reset_temps()
          });
        }
      });
    },
    // 点击修改
    handleUpdate(row) {
      this.temps = Object.assign({}, row); // copy obj
      // let tmp = this.temps.province;
      // this.temps.province = [tmp, this.temps.city];
      // this.temp.timestamp = new Date(this.temp.timestamp);
      console.log("操作的对象", this.temps);
      this.dialogStatus = "update";
      this.dialogVisible = true;

    },
    // 修改
    updateData(){
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          Update(this.temps).then((res) => {
            console.log("修改部门", res);
            this.getList();
            this.dialogVisible = false;
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    // 上级菜单选择
    handleChange(value){
      this.temps.parentId = value[value.length-1]
      console.log('当前选中的值id:',this.temps.parentId);
    },
    // 重置temps
    reset_temps(){
      this.temps = {
        name: "",
        parentId: null,
        order:0
      }
    },



    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            time: "2016-05-01",
            name: "wangxiaohu",
          },
          {
            id: 32,
            time: "2016-05-01",
            name: "wangxiaohu",
          },
        ]);
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped></style>
