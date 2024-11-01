<template>
  <div class="configuration">
    <el-form ref="form" :model="form" label-width="80px">
      <!-- 选择线路 -->
      <el-form-item label="列车线路">
        <el-select v-model="line" placeholder="请选择线路">
          <el-option label="190021" value="shanghai" />
          <el-option label="190022" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="Kafka">
      <div class="title">
        <div class="radius" />
        <h3 class="title_name">卡夫卡地址配置</h3>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="地址" style="width: 400px">
          <el-input v-model="form_tmp.address" />
        </el-form-item>
        <el-form-item label="主题" style="width: 400px">
          <el-input v-model="form_tmp.topic" />
        </el-form-item>
        <el-form-item label="主id" style="width: 400px">
          <el-input v-model="form_tmp.primaryID" />
        </el-form-item>
      </el-form>
      <!-- 接口api -->
      <div class="title">
        <div class="radius" />
        <h3 class="title_name">接口地址</h3>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="接口api" style="width: 400px">
          <el-input v-model="form_tmp.interface" />
        </el-form-item>
      </el-form>
      <!-- 预警/报警 -->
      <div class="title">
        <div class="radius" />
        <h3 class="title_name">预警推送地址</h3>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="预警" style="width: 400px">
          <el-input v-model="form_tmp.forewarn" />
        </el-form-item>
      </el-form>

      <el-button type="primary" style="background-color: #1890ff; margin: 20px 0 27px 100px"
        @click="dispositionUpdate">保存</el-button>
    </div>
    <!-- 保存  -->
  </div>
</template>

<script>
// import path from 'path'
// import { deepClone } from '@/utils'
import {
  getConfig, Update
} from '@/api/system_administration/configuration_management'
import i18n from '@/lang'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      // 配置数据
      form: {
        address: "",
        topic: "",
        primaryID: "",
        interface: "",
        forewarn: "",
      },
      form_tmp: {
        address: "",
        topic: "",
        primaryID: "",
        interface: "",
        forewarn: "",
      },
      // form: {
      //   address: 'kafuka:8086',
      //   topic: 'user_behavior',
      //   primaryID: 'Broker',
      //   interface: 'https://10.35.47:9527',
      //   forewarn: 'https://forewarn.con',
      // },
      //   线路
      line: ''
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
    getList() {
      getConfig().then((res) => {
        console.log('系统配置管理：', res);
        if (res.success) {
          let data = res.data
          this.form.address = data[4].data
          this.form.topic = data[3].data
          this.form.primaryID = data[2].data
          this.form.interface = data[1].data
          this.form.forewarn = data[0].data
          // 暂存form_tmp
          this.form_tmp = JSON.parse(JSON.stringify(this.form))
        }
      })
    },
    dispositionUpdate(file) {
      this.$alert('是否确定进行修改？', '修改配置', {
        confirmButtonText: '确定',
        callback: (action) => {

          if (action === 'confirm') {
            // 点击确定开始判断修改后的id
            if (this.form_tmp.address !== this.form.address) {
              this.xxx(1, this.form_tmp.address, '地址')
            }
            if (this.form_tmp.topic !== this.form.topic) {
              this.xxx(3, this.form_tmp.topic, '主题')
            }
            if (this.form_tmp.primaryID !== this.form.primaryID) {
              this.xxx(4, this.form_tmp.primaryID, '主id')
            }
            if (this.form_tmp.interface !== this.form.interface) {
              this.xxx(5, this.form_tmp.interface, '接口api')
            }
            if (this.form_tmp.forewarn !== this.form.forewarn) {
              this.xxx(6, this.form_tmp.forewarn, '预警')
            }else{
              this.getList()
            }

            // Update().then((res) => {
            //   console.log('进行了修改', res);
            //   this.$message({
            //     message: '修改成功',
            //     type: 'success'
            //   })
            // })
          }

        }
      })
    },

    // 发起修改请求
    xxx(id, data, name) {
      Update({ id: id, data: data }).then((res) => {
        console.log('进行了修改', res);
        if(name === '预警'){
          this.getList()
        }
        if (res.success) {
          this.$message({
            message: name + ' 修改成功',
            type: 'success'
          })
        }else{
          this.$message.error(name+' 修改失败');
        }
      })
    }
  }
}
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

  .el-form-item__label {}
}
</style>
