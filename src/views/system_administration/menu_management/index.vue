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
      <el-table-column prop="name" label="菜单名称" min-width="180" align="center">
      </el-table-column>
      <el-table-column prop="qxzf" label="权限标识" min-width="180" align="center">
      </el-table-column>
      <el-table-column prop="zjrul" label="组件路径" min-width="180" align="center">
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
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            新增
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表格数据
      tableData: [
        {
          id: 1,
          name: "基础管理",
          date: "2016-05-01",
          qxzf: "",
          zjrul: "-- --",
          children: [
            {
              id: 11,
              name: "线路管理",
              date: "2016-05-01",
              qxzf: "admin",
              zjrul: "-- --",
            },
            {
              id: 32,
              name: "列车管理",
              date: "2016-05-01",
              qxzf: "admin",
              zjrul: "-- --",
            },
            {
              id: 41,
              name: "车厢管理",
              date: "2016-05-01",
              qxzf: "admin",
              zjrul: "-- --",
            },
            {
              id: 42,
              name: "设备部件管理",
              date: "2016-05-01",
              qxzf: "admin",
              zjrul: "-- --",
            },
          ],
        },
        {
          id: 2,
          name: "系统管理",
          date: "2016-05-03",
          qxzf: "",
          zjrul: "-- --",
          children: [
            {
              id: 21,
              name: "菜单管理",
              date: "2016-05-01",
              qxzf: "admin",
              zjrul: "-- --",
            },
            {
              id: 22,
              name: "角色管理",
              date: "2016-05-01",
              qxzf: "admin",
              zjrul: "-- --",
            },
            {
              id: 23,
              name: "组织结构管理",
              date: "2016-05-01",
              qxzf: "admin",
              zjrul: "-- --",
            },
            {
              id: 24,
              name: "系统配置管理",
              date: "2016-05-01",
              qxzf: "admin",
              zjrul: "-- --",
            },
          ],
        },
        {
          id: 3,
          name: "系统管理",
          date: "2016-05-03",
          qxzf: "",
          zjrul: "-- --",
          children: [
            {
              id: 31,
              name: "用户管理",
              date: "2016-05-01",
              qxzf: "admin",
              zjrul: "-- --",
            },
          ],
        },
      ],
      //查询数据
      from: {},
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
