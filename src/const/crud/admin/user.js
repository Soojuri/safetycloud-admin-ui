import {
  getDetails
} from '@/api/admin/user'
import {
  rule
} from "@/util/validateRules"
var username = ''
var passwdMaxDays = undefined
var passwdMinDays = undefined
var validateUsername = (rule, value, callback) => {
  username = value
  getDetails(value).then(response => {
    if (window.boxType === 'edit') callback()
    const result = response.data.data
    if (result !== null) {
      callback(new Error('用户名已经存在'))
    } else {
      callback()
    }
  })
}
var validatePassword = (rule, value, callback) => {
  if (username == value) {
    callback(new Error('用户名与密码一致'))
  } else {
    callback()
  }
}
var validatePasswdMinDays = (rule, value, callback) => {
  passwdMinDays = value
  if (value > passwdMaxDays && passwdMaxDays != 0) {
    callback(new Error('最短使用期限不能大于最长使用期限'))
  } else {
    callback()
  }
}
var validatePasswdMaxDays = (rule, value, callback) => {
  passwdMaxDays = value
  if (value != 0 && !value && passwdMinDays) {
    callback(new Error('请输入最长使用期限'))
  } else {
    callback()
  }
}

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  searchSpan: 8,
  labelWidth: 150,
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  labelSuffix: ' ',
  searchShowBtn: false,
  dialogCloseBtn: false,
  dialogEscape: false,
  column: [{
      fixed: true,
      label: 'id',
      prop: 'userId',
      span: 24,
      hide: true,
      editDisabled: true,
      addDisplay: false
    }, {
      fixed: true,
      label: '用户名',
      prop: 'username',
      editDisabled: true,
      slot: true,
      search: true,
      span: 24,
      rules: [{
          required: true,
          message: '请输入用户名'
        },
        {
          min: 6,
          max: 32,
          message: '长度在 6 到 32 个字符',
          trigger: 'blur'
        },
        {
          validator: rule.validatorNameCn,
          trigger: 'blur'
        },
        {
          validator: validateUsername,
          trigger: 'blur'
        },

      ]
    },
    {
      label: '密码',
      prop: 'password',
      type: 'password',
      editDisplay: false,
      value: '',
      hide: true,
      span: 24,
      rules: [{
        required: true,
        message: '请输入密码'
      }, {
        min: 8,
        max: 32,
        message: '长度在 8 到 32 个字符',
        trigger: 'blur'
      }, {
        validator: rule.checkPassword,
        trigger: 'blur'
      }, {
        validator: validatePassword,
        trigger: 'blur'
      }, ]
    },
    {
      width: 100,
      label: "密码最长使用期限(天)",
      prop: "passwdMaxDays",
      // type: 'number',
      hide: true,
      span: 12,
      valueDefault: 0,
      row: true,
      rules: [{
          required: false,
          message: '请输入最长使用期限',
        }, {
          validator: validatePasswdMaxDays,

        }, {
          validator: rule.checkNumber,
          trigger: 'blur',
        },
        {
          min: 0,
          max: 3,
          message: '请输入0-999间的数字',
          trigger: 'blur',
        },
      ]
    }, {
      width: 100,
      label: "密码最短使用期限(天)",
      prop: "passwdMinDays",
      // type: 'number',
      hide: true,
      span: 12,
      valueDefault: 3,
      row: true,
      rules: [{
          validator: rule.checkNumber,
          trigger: 'blur',
        },
        {
          min: 0,
          max: 3,
          message: '请输入0-999间的数字',
          trigger: 'blur',
        }, {
          validator: validatePasswdMinDays,

        },
      ]
    }, {
      label: '所属部门',
      prop: 'deptId',
      formslot: true,
      slot: true,
      span: 24,
      hide: true,
      dataType: "number",
      rules: [{
        required: true,
        message: '请选择部门',
        trigger: 'change'
      }]
    }, {
      label: '手机号',
      prop: 'phone',
      value: '',
      span: 24,
      rules: [{
        min: 11,
        max: 11,
        message: '长度在 11 个字符',
        trigger: 'blur'
      }]
    }, {
      label: '邮箱',
      prop: 'email',
      value: '',
      span: 24,
      rules: [{
        validator: rule.checkEmail,
        trigger: 'blur',
      }, ]
    }, {
      label: '角色',
      prop: 'role',
      formslot: true,
      slot: true,
      overHidden: true,
      span: 24,
      rules: [{
        required: true,
        message: '请选择角色',
        trigger: 'blur'
      }]
    }, {
      label: '状态',
      prop: 'lockFlag',
      type: 'radio',
      slot: true,
      border: true,
      span: 24,
      rules: [{
        required: true,
        message: '请选择状态',
        trigger: 'blur'
      }],
      dicData: [{
        label: '有效',
        value: '0'
      }, {
        label: '锁定',
        value: '9'
      }]
    }, {
      width: 180,
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      editDisabled: true,
      addDisplay: false,
      span: 24
    }
  ]
}
