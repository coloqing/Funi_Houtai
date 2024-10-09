<template>
  <div class="configuration">
    <el-form ref="form" :model="form" label-width="80px">
      <!-- 选择线路 -->
      <el-form-item label="列车线路">
        <el-select v-model="line" placeholder="请选择线路">
          <el-option label="190021" value="shanghai"></el-option>
          <el-option label="190022" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="Kafka">
      <div class="title">
        <div class="radius"></div>
        <h3 class="title_name">卡夫卡地址配置</h3>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="地址" style="width: 400px">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="主题" style="width: 400px">
          <el-input v-model="form.topic"></el-input>
        </el-form-item>
        <el-form-item label="主id" style="width: 400px">
          <el-input v-model="form.primaryID"></el-input>
        </el-form-item>
      </el-form>
      <!-- 接口api -->
      <div class="title">
        <div class="radius"></div>
        <h3 class="title_name">接口地址</h3>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="接口api" style="width: 400px">
          <el-input v-model="form.interface"></el-input>
        </el-form-item>
      </el-form>
      <!-- 预警/报警 -->
      <div class="title">
        <div class="radius"></div>
        <h3 class="title_name">预警推送地址</h3>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="预警" style="width: 400px">
          <el-input v-model="form.forewarn"></el-input>
        </el-form-item>
      </el-form>

      <el-button
        type="primary"
        style="background-color: #1890ff; margin: 20px 0 27px 100px"
        @click="dispositionUpdate"
        >保存</el-button
      >
    </div>
    <!-- 保存  -->
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import {
  getRoutes,
  getRoles,
  addRole,
  deleteRole,
  updateRole,
} from "@/api/role";
import i18n from "@/lang";

const defaultRole = {
  key: "",
  name: "",
  description: "",
  routes: [],
};

export default {
  data() {
    return {
      // 配置数据
      form: {
        address: "kafuka:8086",
        topic: "user_behavior",
        primaryID: "Broker",
        forewarn: "https://forewarn.con",
        alarm: "https://alarm.con",
        interface: "https://10.35.47:9527",
      },
      //   线路
      line: "",
    };
  },
  computed: {
    routesData() {
      return this.routes;
    },
  },
  created() {},
  methods: {
    dispositionUpdate(file) {
      this.$alert("是否确定进行修改？", "修改配置", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$message({
            message: "恭喜你，这是一条成功消息",
            type: "success",
          });
          // this.$message.error('修改失败');
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.configuration {
  width: 100%;
  height: 100%;
  padding-left: 30px;
  padding-top: 30px;

  .Kafka {
    border: 1px solid #dfe4ed;
    padding: 40px 20px;
  }
  .title {
    display: flex;
    align-items: center;
    margin: 0px auto 0px auto;
    // padding-left: 30px;
    .radius {
      width: 7px;
      height: 7px;
      background-color: blue;
      border-radius: 50%;
      margin-right: 10px;
    }
    .title_name {
      font-family: inherit;
      font-weight: 500;
      line-height: 1.1;
    }
  }
  .el-form-item__label {
  }
}
</style>
