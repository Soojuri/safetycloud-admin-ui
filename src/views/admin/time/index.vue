<!-- 时间配置 -->
<template>
  <div class="sub-page">
    <div class="g-card ">
      <el-col :span="12" class="mt-xl">
        <el-form :model="form" ref="form" label-width="100px" :rules="rules">
          <el-form-item label="时区">
            <el-input v-model="form.timeZone" disabled></el-input>
          </el-form-item>
          <el-form-item label="校时类型">
            <el-radio-group class="mt-s" v-model="form.timingType">
              <el-radio :label="1">NTP校时</el-radio>
              <el-radio :label="2">手动校时</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.timingType === 1">
            <el-form-item label='服务器地址' prop='ntpSever'>
              <el-input size='small' v-model='form.ntpSever' placeholder='请输入服务器地址'></el-input>
            </el-form-item>
            <el-form-item label='NTP端口' prop='ntpPort'>
              <el-input size='small' v-model='form.ntpPort' placeholder='请输入NTP端口'></el-input>
            </el-form-item>
            <el-form-item label='校时时间间隔' prop='timingInterval'>
              <el-input-number size='small' :min="0" :max="100000" v-model='form.timingInterval'>
              </el-input-number> 分钟
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="handleTestNtp">测试</el-button>
            </el-form-item>
          </template>
          <template v-if="form.timingType === 2">
            <el-form-item label="设备时间">
              <el-input :value="parseTime(date)" disabled></el-input>
            </el-form-item>
            <el-form-item label='设置时间' prop='setTime'>
              <el-date-picker v-model="form.setTime" type="datetime" value-format="timestamp" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="synchronous" label="true">与计算机时间同步</el-checkbox>
            </el-form-item>
          </template>
        </el-form>

      </el-col>
      <el-col :span="12" :offset="5">
        <el-button size="medium" type="primary" @click="handleSave()">保存</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getTimeConfig, saveTimeConfig, testNtp } from '@/api/admin/time'

export default {
  components: {},
  data() {
    return {
      form: {
        timeZone: '+08:00',
        timingType: 1,
        setTime: null,
        ntpSever: null,
        ntpPort: null,
        timingInterval: null,
      },
      date: null,
      synchronous: false,
      timer: null,
      rules: {
        ntpPort: [{ validator: this.$formRules.checkPort, trigger: 'blur' }],
      },
    }
  },
  mounted() {
    let _this = this // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.date = new Date().getTime()
    }, 500)
    getTimeConfig().then((res) => {
      if (res.data.data) {
        this.form = res.data.data
      }
    })
  },
  watch: {
    date(val) {
      if (this.synchronous === true) {
        this.form.setTime = val
      }
    },
  },
  methods: {
    handleSave() {
      saveTimeConfig(this.form).then((res) => {
        if (res.data.data) {
          this.msgSuccess('保存成功')
        }
      })
    },
    handleTestNtp() {
      const host = this.form.ntpSever
      const port = this.form.ntpPort
      const address = port ? host + ':' + port : host
      if (!address) return this.msgWarn('测试地址不能为空')
      testNtp({ address }).then((res) => {
        if (res.data.data) {
          this.msgSuccess('请求成功')
        }
      })
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
}
</script>
<style lang='scss' scoped>
.g-card {
  overflow: hidden;
}
</style>