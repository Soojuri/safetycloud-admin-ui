<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='140px' ref='form'>
            <div class="g-card" v-if="!id">
              <div class="g-tit">账户信息</div>
              <el-form-item label='登录账号' prop='username'>
                <el-input size='small' v-model='form.username' placeholder='请输入登录账号'></el-input>
              </el-form-item>
              <el-form-item label='登录密码' prop='password'>
                <el-input :type="passwordType" v-model="form.password" placeholder='请输入登录密码' auto-complete="off">
                  <i slot="suffix" class="el-icon-view el-input__icon"
                     @click="passwordType == '' ? (passwordType = 'password') : (passwordType = '')" />
                </el-input>
              </el-form-item>
              <el-form-item label='密码确认' prop='password2'>
                <el-input :type="passwordType1" v-model="form.password2" placeholder='请输入密码确认' auto-complete="off">
                  <i slot="suffix" class="el-icon-view el-input__icon"
                     @click="passwordType1 == '' ? (passwordType1 = 'password') : (passwordType1 = '')" />
                </el-input>
              </el-form-item>
            </div>
            <div class="g-card">
              <div class="g-tit">企业信息</div>
              <el-form-item label='统一社会信用代码' prop='enterpriseCode'>
                <el-input size='small' v-model='form.enterpriseCode' placeholder='请输入统一社会信用代码'></el-input>
              </el-form-item>
              <el-form-item label='企业名称' prop='enterpriseName'>
                <el-input size='small' v-model='form.enterpriseName' placeholder='请输入企业名称'></el-input>
              </el-form-item>
              <!-- <el-form-item label="所属省市区" prop="selectedOptions">
                <el-cascader style="width:100%" size="large" :options="options" v-model="form.selectedOptions">
                </el-cascader>
              </el-form-item> -->
              <el-form-item label="企业类型" prop="enterpriseType">
                <el-select v-model="form.enterpriseType" placeholder="请选择企业类型">
                  <!-- <el-option v-for="item in dict.enterpriseType" :label="item.label" :value="parseInt(item.value)"
                             :key="item.value">
                  </el-option> -->
                  <el-option label="其它行业" :value="0" />
                  <el-option label="金属冶炼行业" :value="1" />
                  <el-option label="有色金属行业" :value="2" />
                  <el-option label="建筑行业" :value="3" />
                  <el-option label="机械行业" :value="4" />
                  <el-option label="轻业行业" :value="5" />
                  <el-option label="纺织行业" :value="6" />
                  <el-option label="烟草行业" :value="7" />
                  <el-option label="商贸行业" :value="8" />
                  <el-option label="危险化学品" :value="9" />
                  <el-option label="化工行业" :value="10" />
                  <el-option label="非煤矿山" :value="11" />
                  <el-option label="建筑施工行业" :value="12" />
                  <el-option label="民爆类" :value="13" />
                  <el-option label="烟花爆竹" :value="14" />
                  <el-option label="燃气类" :value="15" />
                  <el-option label="食品、药品、医疗器械行业" :value="16" />
                  <el-option label="渔业行业" :value="17" />
                  <el-option label="电力行业" :value="18" />
                  <el-option label="学校" :value="19" />
                  <el-option label="旅游行业" :value="20" />
                  <el-option label="交通行业" :value="21" />
                  <el-option label="海上运输" :value="22" />
                  <el-option label="医疗行业" :value="23" />
                  <el-option label="农机行业" :value="24" />
                  <el-option label="通信行业" :value="25" />
                </el-select>
              </el-form-item>
              <el-form-item label="经济类型" prop="economicType">
                <el-select v-model="form.economicType" placeholder="请选择经济类型">
                  <!-- <el-option v-for="item in dict.economicType" :label="item.label" :value="parseInt(item.value)"
                             :key="item.value">
                  </el-option> -->
                  <el-option label="其它经济" :value="0" />
                  <el-option label="股份制经济" :value="1" />
                  <el-option label="集体经济" :value="2" />
                  <el-option label="港澳台投资经济" :value="3" />
                  <el-option label="民营经济" :value="4" />
                  <el-option label="联营经济" :value="5" />
                  <el-option label="外商投资经济" :value="6" />
                  <el-option label="国有经济" :value="7" />
                </el-select>
              </el-form-item>
              <el-form-item label="主要危险类型" prop="mainRiskType">
                <el-select v-model="form.mainRiskType" placeholder="请选择主要危险类型">
                  <!-- <el-option v-for="item in dict.mainRiskType" :label="item.label" :value="parseInt(item.value)"
                             :key="item.value">
                  </el-option> -->
                  <el-option label="其它危险类型" :value="0" />
                  <el-option label="煤矿行业危险" :value="1" />
                  <el-option label="非煤矿行业危险" :value="2" />
                  <el-option label="危化行业危险" :value="3" />
                  <el-option label="工贸行业危险" :value="4" />
                </el-select>
              </el-form-item>
              <el-form-item label="企业性质" prop="businessNature">
                <el-select v-model="form.businessNature" placeholder="请选择企业性质">
                  <!-- <el-option v-for="item in dict.businessNature" :label="item.label" :value="parseInt(item.value)"
                             :key="item.value">
                  </el-option> -->
                  <el-option label="其它企业" :value="0" />
                  <el-option label="省属企业" :value="1" />
                  <el-option label="市属企业" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label='成立时间' prop='establishmentDate'>
                <el-date-picker v-model="form.establishmentDate" type="datetime" value-format="timestamp"
                                placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label='通讯地址' prop='address'>
                <el-input size='small' v-model='form.address' placeholder='请输入通讯地址'></el-input>
              </el-form-item>
              <el-form-item label='邮政编码' prop='postCode'>
                <el-input size='small' v-model='form.postCode' placeholder='请输入邮政编码'></el-input>
              </el-form-item>
              <el-form-item label='企业电话' prop='enterprisePhone'>
                <el-input size='small' v-model='form.enterprisePhone' placeholder='请输入企业电话'></el-input>
              </el-form-item>
              <el-form-item label='传真' prop='fax'>
                <el-input size='small' v-model='form.fax' placeholder='请输入传真'></el-input>
              </el-form-item>
              <el-form-item label='电子邮箱' prop='email'>
                <el-input size='small' v-model='form.email' placeholder='请输入电子邮箱'></el-input>
              </el-form-item>
              <el-form-item label='从业人数' prop='staffNum'>
                <el-input-number size='small' v-model='form.staffNum' :min="0" :max="100000" placeholder='请输入从业人数'>
                </el-input-number>
              </el-form-item>
              <el-form-item label='主要负责人' prop='enterpriseLeader'>
                <el-input size='small' v-model='form.enterpriseLeader' placeholder='请输入主要负责人'></el-input>
              </el-form-item>
              <el-form-item label='主要负责人电话' prop='enterpriseLeaderPhone'>
                <el-input size='small' v-model='form.enterpriseLeaderPhone' placeholder='请输入主要负责人电话'></el-input>
              </el-form-item>
              <el-form-item label='主要负责人手机' prop='enterpriseLeaderCellPhone'>
                <el-input size='small' v-model='form.enterpriseLeaderCellPhone' placeholder='请输入主要负责人手机'></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入至少五个字符" show-word-limit minlength="5" maxlength="200"
                          type="textarea" :rows="5">
                </el-input>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { rule } from '@/util/validateRules'
import { encrypt, decrypt, serveEncrypt } from '@/util/jsencrypt'
import { getPublicKey } from '@/api/publicKey.js'
import { addEnterprise, putEnterprise, getEnterprise } from '@/api/app/enterprise/enterprise.js'
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    dict: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (this.form.password !== '') {
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      form: {
        username: '',
        password: '',
        password2: '',
        enterpriseCode: null,
        enterpriseName: null,
        establishmentDate: null,
        address: null,
        postCode: null,
        enterprisePhone: null,
        staffNum: null,
        fax: null,
        enterprisePhone: null,
        enterpriseLeader: null,
        enterpriseLeaderPhone: null,
        enterpriseLeaderCellPhone: null,
        enterpriseType: null,
        economicType: null,
        mainRiskType: null,
        businessNature: null,
        remark: null,
        type: 0,
      },
      id: null,
      options: regionData,
      publicKey: '',
      passwordType: 'password',
      passwordType1: 'password',
      rules: {
        username: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入登录账号')],
        password: [
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
          this.$formRules.checkNecessary('请输入登录密码'),
        ],
        password2: [
          this.$formRules.checkNecessary('请输入密码确认'),
          { required: false, validator: validatePass, trigger: 'blur' },
        ],
        enterpriseCode: [
          { validator: this.$formRules.validatorCredit, trigger: 'blur' },
          this.$formRules.checkLen(32),
          this.$formRules.checkNecessary('请输入统一社会信用代码'),
        ],
        enterpriseName: [this.$formRules.checkLen(100), this.$formRules.checkNecessary('请输入企业名称')],
        // selectedOptions: [this.$formRules.checkNecessary('请选择省市区')],
        enterpriseType: [this.$formRules.checkNecessary('请选择企业类型')],
        mainRiskType: [this.$formRules.checkNecessary('请选择主要危险类型')],
        businessNature: [this.$formRules.checkNecessary('请选择企业性质')],
        enterprisePhone: [
          this.$formRules.checkNecessary('请输入企业电话'),
          { validator: this.$formRules.checkPhone, trigger: 'blur' },
        ],
        address: [this.$formRules.checkLen(100), this.$formRules.checkNecessary('请输入通讯地址')],
        postCode: [this.$formRules.checkLen()],
        enterpriseLeader: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入主要负责人')],
        enterpriseLeaderCellPhone: [
          this.$formRules.checkNecessary('请输入负责人手机'),
          { validator: this.$formRules.checkPhone, trigger: 'blur' },
        ],
        enterpriseLeaderPhone: [
          this.$formRules.checkLen(50),
          { validator: this.$formRules.checkTel, trigger: 'blur' },
          this.$formRules.checkNecessary('请输入主要负责人电话'),
        ],
        fax: [
          this.$formRules.checkNecessary('请输入传真'),
          this.$formRules.checkLen(50),
          { validator: this.$formRules.checkFax, trigger: 'blur' },
        ],
        email: [
          this.$formRules.checkLen(50),
          { validator: this.$formRules.checkEmail, trigger: 'blur' },
          this.$formRules.checkNecessary('请输入通讯地址'),
        ],
      },
    }
  },
  computed: {
    title() {
      return this.id ? '编辑' : '企业注册'
    },
  },
  watch: {},
  created() {
    this.id = this.data ? this.data.id : null
  },
  mounted() {
    this.getList()
    getPublicKey().then((res) => {
      this.publicKey = res.data.data
    })
  },
  methods: {
    getList() {
      if (this.id) {
        getEnterprise(this.id).then((res) => {
          this.form = res.data.data
          // this.form.selectedOptions = [
          //   TextToCode[this.form.province].code,
          //   TextToCode[this.form.province][this.form.city].code,
          //   TextToCode[this.form.province][this.form.city][this.form.county].code,
          // ]
        })
      }
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const that = this
          this.form.password = serveEncrypt(this.form.password, this.publicKey)
          this.form.password2 = serveEncrypt(this.form.password2, this.publicKey)
          // this.form.province = CodeToText[this.form.selectedOptions[0]]
          // this.form.city = CodeToText[this.form.selectedOptions[1]]
          // this.form.county = CodeToText[this.form.selectedOptions[2]]
          if (that.id) {
            putEnterprise(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addEnterprise(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('注册成功')
              }
            })
          }
        }
      })
    },
  },
}
</script>
<style lang='scss' scoped>
::v-deep .dialog-footer {
  text-align: center;
}
.g-tit {
  font-size: 16px !important;
  color: #339dff;
  border-bottom: 1px solid #339dff;
}
</style>
