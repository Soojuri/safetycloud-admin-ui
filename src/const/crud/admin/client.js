import {
  getObj
} from '@/api/admin/client'
import {
  rule
} from '@/util/validateRules'
const DIC = {
  vaild: [{
    label: '否',
    value: 'false'
  }, {
    label: '是',
    value: 'true'
  }]
}

var validateClient = (rule, value, callback) => {
  getObj(value).then(response => {
    if (window.boxType === 'edit') {
      return callback()
    }
    const result = response.data.data
    if (result.length !== 0) {
      callback(new Error('客户端已存在'))
    } else {
      callback()
    }
  })
}

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  searchMenuSpan: 6,
  viewBtn: true,
  refreshBtn: false,
  columnBtn: false,
  searchShowBtn: false,
  labelSuffix: ' ',
  column: [{
    width: 150,
    label: '编号',
    prop: 'clientId',
    align: 'center',
    sortable: true,
    columnBtn: false,
    editDisabled: true,
    rules: [{
      required: true,
      message: '请输入编号',
      trigger: 'blur'
    }, {
      validator: validateClient,
      trigger: 'blur'
    }, rule.checkLen()]
  }, {
    label: '密钥',
    prop: 'clientSecret',
    align: 'center',
    sortable: true,
    overHidden: true,
    width: 120,
    rules: [{
      required: true,
      message: '请输入密钥',
      trigger: 'blur'
    }, rule.checkLen()]
  }, {
    label: '域',
    prop: 'scope',
    align: 'center',
    rules: [{
      required: true,
      message: '请输入域',
      trigger: 'blur'
    }, rule.checkLen()]
  }, {
    label: '自动放行',
    prop: 'autoapprove',
    align: 'center',
    type: 'radio',
    border: true,
    dicData: DIC.vaild,
    rules: [{
      required: true,
      message: '请选择是否放行',
      trigger: 'blur'
    }]
  }, {
    label: '授权模式',
    prop: 'authorizedGrantTypes',
    type: 'checkbox',
    dicUrl: '/admin/dict/type/grant_types',
    align: 'center',
    overHidden: true,
    row: true,
    span: 24,
    rules: [{
      required: true,
      message: '请选择授权模式',
      trigger: 'blur'
    }]
  }, {
    label: '令牌时效',
    type: 'number',
    prop: 'accessTokenValidity',
    align: 'center'
  }, {
    label: '刷新时效',
    type: 'number',
    prop: 'refreshTokenValidity',
    align: 'center'
  }, {
    label: '回调地址',
    prop: 'webServerRedirectUri',
    align: 'center',
    hide: true
  }, {
    label: '权限',
    prop: 'authorities',
    align: 'center',
    hide: true
  }, {
    label: '扩展信息',
    prop: 'additionalInformation',
    align: 'center',
    type: 'textarea',
    placeholder: 'JSON格式数据',
    hide: true,
    minRows: 2,
    row: true,
    span: 24,
  }],
  group: [{
    icon: 'el-icon-info',
    label: '安全属性',
    prop: 'group2',
    column: [{
        label: '验证码开关',
        labelWidth: 100,
        border: true,
        prop: 'captchaFlag',
        align: 'center',
        type: 'radio',
        dicUrl: '/admin/dict/type/captcha_flag_types',
      },
      {
        label: '前端密码加密',
        labelWidth: 100,
        border: true,
        prop: 'encFlag',
        align: 'center',
        type: 'radio',
        dicUrl: '/admin/dict/type/enc_flag_types',
      }
    ]
  }]
}
