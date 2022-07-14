var startTime = undefined
var endTime = undefined

var validateEndTime = (rule, value, callback) => {
  endTime = Date.parse(value);
  if (startTime >= endTime) {
    callback(new Error('开始时间不能大于结束时间'))
  } else {
    callback()
  }
}
var validateStartTime = (rule, value, callback) => {
  startTime = Date.parse(value);
  if (endTime <= startTime) {
    callback(new Error('开始时间不能大于结束时间'))
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
  align: 'center',
  refreshBtn: false,
  columnBtn: false,
  searchShowBtn: false,
  labelSuffix: ' ',
  column: [{
      label: '租户id',
      prop: 'id',
      hide: true,
      editDisabled: true,
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '租户名称',
      prop: 'name',
      search: true,
      searchSlot: true,
      rules: [{
          required: true,
          message: '请输入租户名称',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 32,
          message: '长度在 3 到 32 个字符',
          trigger: 'blur'
        }
      ]
    },
    {
      label: '租户类型',
      prop: 'tenantType',
      type: 'select',
      search: true,
      searchSlot: true,
      rules: [{
        required: true,
        message: '请选择租户类型',
        trigger: 'blur'
      }],
      dicData: [{
        label: '个人',
        value: 1
      }, {
        label: '企业',
        value: 2
      }, {
        label: '主管部门',
        value: 3
      }]
    },
    {
      label: '租户编号',
      type: 'number',
      prop: 'code',
      rules: [{
        required: true,
        message: '请输入租户编号',
        trigger: 'blur'
      }],
      minRows: 0,
      maxRows: 999,
    },
    {
      label: '开始时间',
      prop: 'startTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      rules: [{
          required: true,
          message: '请输入结束时间',
          trigger: 'blur'
        },
        {
          validator: validateStartTime,
          trigger: 'blur'
        }
      ]
    },
    {
      label: '结束时间',
      prop: 'endTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      rules: [{
          required: true,
          message: '请输入结束时间',
          trigger: 'blur'
        },
        {
          validator: validateEndTime,
          trigger: 'blur'
        }
      ]
    },
    {
      label: '状态',
      prop: 'status',
      type: 'radio',
      border: true,
      dicUrl: '/admin/dict/type/status_type',
      search: true,
      searchSlot: true
    }
  ]
}
