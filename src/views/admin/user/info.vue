<template>
  <div class="avue-crud calendar-list-container">
    <basic-container>
      <template>
        <el-row>
          <el-tabs v-model="activeName">
            <el-tab-pane label="基本资料" name="information">
              <el-form ref="ruleForm1" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item label="头像">
                      <ImageUpload v-model="ruleForm.avatar" />
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                      <el-input v-model="ruleForm.username" type="text" disabled />
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                      <el-input v-model="ruleForm.phone" placeholder="请输入手机号码" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="submitForm1()">提交</el-button>
                      <el-button @click="resetForm()">清 空</el-button>
                    </el-form-item>
                  </div>
                </el-col>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="password">
              <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item label="原密码" prop="password">
                      <el-input :type="passwordType" v-model="ruleForm.password" auto-complete="off">
                        <i slot="suffix" class="el-icon-view el-input__icon"
                           @click="passwordType == '' ? (passwordType = 'password') : (passwordType = '')" />
                      </el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newpassword1">
                      <el-input :type="passwordType1" v-model="ruleForm.newpassword1" auto-complete="off">
                        <i slot="suffix" class="el-icon-view el-input__icon"
                           @click="passwordType1 == '' ? (passwordType1 = 'password') : (passwordType1 = '')" />
                      </el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="newpassword2">
                      <el-input :type="passwordType2" v-model="ruleForm.newpassword2" auto-complete="off">
                        <i slot="suffix" class="el-icon-view el-input__icon"
                           @click="passwordType2 == '' ? (passwordType2 = 'password') : (passwordType2 = '')" />
                      </el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="submitForm()">提交</el-button>
                      <el-button @click="resetForm()">清 空</el-button>
                    </el-form-item>
                  </div>
                </el-col>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <!-- <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="头像">
                  <ImageUpload v-model="ruleForm.avatar" />
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="ruleForm.username" type="text" disabled />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="ruleForm.phone" placeholder="验证码登录使用" />
                </el-form-item> -->

          <!-- <el-form-item label="社交登录" prop="social">
                  <a href="#" class="icon-weixin1" @click="handleClick('wechat')"></a>｜
                  <a href="#" class="icon-qq" @click="handleClick('tencent')"></a> |
                  <a href="#" class="icon-gitee-fill-round" @click="handleClick('gitee')"></a> |
                  <a href="#" class="icon-C" @click="handleClick('osc')"></a>
                </el-form-item> -->
          <!-- <el-form-item label="原密码" prop="password">
                  <el-input v-model="ruleForm.password" type="password" auto-complete="off" />
                </el-form-item>
                <el-form-item label="新密码" prop="newpassword1">
                  <el-input v-model="ruleForm.newpassword1" type="password" auto-complete="off" />
                </el-form-item>
                <el-form-item label="确认密码" prop="newpassword2">
                  <el-input v-model="ruleForm.newpassword2" type="password" auto-complete="off" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm()">提交</el-button>
                  <el-button @click="resetForm()">清 空</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-form> -->
        </el-row>
      </template>
    </basic-container>
  </div>
</template>

<script>
import { handleImg, openWindow } from '@/util/util'
import { mapState } from 'vuex'
import store from '@/store'
import { getStore, setStore } from '@/util/store'
import { isValidateNoneMobile } from '@/util/validate'
import { editInfo, editInformation, getDetails } from '@/api/admin/user'
import ImageUpload from '@/components/ImageUpload'
import { rule } from '@/util/validateRules'
import { getPublicKey } from '@/api/publicKey.js'
import { encrypt, decrypt, serveEncrypt } from '@/util/jsencrypt'
export default {
  components: {
    ImageUpload,
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isValidateNoneMobile(value)[0]) {
        callback(new Error(isValidateNoneMobile(value)[1]))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (this.ruleForm.password !== '') {
        if (value !== this.ruleForm.newpassword1) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      passwordType: 'password',
      passwordType1: 'password',
      passwordType2: 'password',
      activeName: 'information',
      publicKey: '',
      ruleForm: {
        username: '',
        password: '',
        newpassword1: '',
        newpassword2: '',
        avatar: '',
        phone: '',
        userId: '',
      },
      rules: {
        phone: [{ required: false, validator: validatePhone, trigger: 'blur' }],
        newpassword1: [
          {
            min: 8,
            max: 32,
            message: '长度在 8 到 32 个字符',
            trigger: 'blur',
          },
          {
            validator: rule.checkPassword,
            trigger: 'blur',
          },
        ],
        newpassword2: [{ required: false, validator: validatePass, trigger: 'blur' }],
      },
    }
  },
  created() {
    this.resetForm()
    console.log(this.userInfo)
    getPublicKey().then((res) => {
      this.publicKey = res.data.data
    })
    getDetails(this.userInfo.username).then((response) => {
      this.ruleForm.phone = response.data.data.phone
      this.ruleForm.avatar = this.IMAGE_PATH + response.data.data.avatar
    })
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    submitForm1() {
      this.ruleForm.avatar = this.ruleForm.avatar.replace(this.IMAGE_PATH, '')
      this.$refs.ruleForm1.validate((valid) => {
        if (!valid) {
          return false
        }
        this.ruleForm.password = undefined
        this.ruleForm.newpassword1 = undefined
        this.ruleForm.newpassword2 = undefined
        editInformation(this.ruleForm)
          .then((response) => {
            this.msgSuccess('修改成功')
            this.ruleForm.avatar = this.IMAGE_PATH + this.ruleForm.avatar
          })
          .catch(() => {
            this.ruleForm.avatar = this.IMAGE_PATH + this.ruleForm.avatar
          })
      })
    },
    submitForm() {
      this.ruleForm.avatar = this.ruleForm.avatar.replace(this.IMAGE_PATH, '')
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return false
        }

        this.ruleForm.password = serveEncrypt(this.ruleForm.password, this.publicKey)
        this.ruleForm.newpassword1 = serveEncrypt(this.ruleForm.newpassword1, this.publicKey)
        this.ruleForm.newpassword2 = serveEncrypt(this.ruleForm.newpassword2, this.publicKey)

        editInfo(this.ruleForm)
          .then((response) => {
            this.msgSuccess('修改成功')
            this.ruleForm.avatar = this.IMAGE_PATH + this.ruleForm.avatar
            this.ruleForm.password = undefined
            this.ruleForm.newpassword1 = undefined
            this.ruleForm.newpassword2 = undefined
            // 修改后注销当前token,重新登录
            // this.$store.dispatch("LogOut").then(() => {
            //   location.reload()
            // })
          })
          .catch(() => {
            this.ruleForm.avatar = this.IMAGE_PATH + this.ruleForm.avatar
          })
      })
    },
    resetForm() {
      this.ruleForm.password = undefined
      this.ruleForm.newpassword1 = undefined
      this.ruleForm.newpassword2 = undefined
      this.ruleForm.userId = this.userInfo.userId
      this.ruleForm.username = this.userInfo.username
      this.ruleForm.phone = undefined
      // this.ruleForm.phone = this.userInfo.phone
      // this.ruleForm.avatar = this.IMAGE_PATH + this.userInfo.avatar

      //判断是否选择了租户ID
      // const TENANT_ID = getStore({ name: 'tenantId_video' })
      // if (TENANT_ID) {
      //   this.headers['TENANT-ID'] = TENANT_ID // 租户ID
      // }
    },
    // handleClick(thirdpart) {
    //   let appid, client_id, redirect_uri, url
    //   redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect')
    //   if (thirdpart === 'wechat') {
    //     appid = 'wxd1678d3f83b1d83a'
    //     url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${redirect_uri}&state=WX-BIND&response_type=code&scope=snsapi_login#wechat_redirect`
    //   } else if (thirdpart === 'tencent') {
    //     client_id = '101322838'
    //     url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&state=QQ-BIND&client_id=${client_id}&redirect_uri=${redirect_uri}`
    //   } else if (thirdpart === 'gitee') {
    //     client_id = '235ce26bbc59565b82c989aa3a407ce844cf59a7c5e0f9caa9bb3bf32cee5952'
    //     url = `https://gitee.com/oauth/authorize?response_type=code&state=GITEE-BIND&client_id=${client_id}&redirect_uri=${redirect_uri}`
    //   } else if (thirdpart === 'osc') {
    //     client_id = 'neIIqlwGsjsfsA6uxNqD'
    //     url = `https://www.oschina.net/action/oauth2/authorize?response_type=code&client_id=${client_id}&state=OSC-BIND&redirect_uri=${redirect_uri}`
    //   }
    //   openWindow(url, thirdpart, 540, 540)
    // },
  },
}
</script>
<style lang="scss">
@import '@/styles/info.scss';
</style>
