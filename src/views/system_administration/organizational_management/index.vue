<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container" style="display: flex; align-items: baseline">
      <!-- 线路 -->
      <el-input
        v-model="from.title"
        placeholder="线路"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native=""
      />
      <!-- 列车号 -->
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
      <el-table-column prop="date" label="创建时间" min-width="180" align="center">
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
    <el-dialog title="修改" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temps"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="线路" prop="title" label-width="100px" >
          <el-input v-model="temps.xianlu" placeholder="请输入线路号" />
        </el-form-item>
        <el-form-item label="列车号" label-width="100px" >
          <el-input v-model="temps.liechehao" placeholder="请输入列车号" />
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
export default {
  data() {
    return {
      // 表格数据
      tableData: [
        {
          id: 3,
          name: "wangxiaohu",
          date: "2016-05-01",
          children: [
            {
              id: 31,
              name: "wangxiaohu",
              date: "2016-05-01",
            },
            {
              id: 32,
              name: "wangxiaohu",
              date: "2016-05-01",
              children: [
                {
                  id: 41,
                  name: "wangxiaohu",
                  date: "2016-05-01",
                },
                {
                  id: 42,
                  name: "wangxiaohu",
                  date: "2016-05-01",
                },
              ],
            },
          ],
        },
        {
          id: 4,
          name: "wangxiaohu",
          date: "2016-05-03",
        },
      ],
      //查询数据
      from: {},
      // 新增/修改 表单
      temps: {
        xianlu: "",
        liechehao: "",
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
      dialogFormVisible: false,
    };
  },
  computed: {
    routesData() {
      return this.routes;
    },
  },
  created() {},
  methods: {
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: "2016-05-01",
            name: "wangxiaohu",
          },
          {
            id: 32,
            date: "2016-05-01",
            name: "wangxiaohu",
          },
        ]);
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped></style>
