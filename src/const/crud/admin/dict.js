import {
  rule
} from '@/util/validateRules'
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: false,
  columnBtn: false,
  searchShowBtn: false,
  showClomnuBtn: false,
  searchMenuSpan: 6,
  searchSize: 'small',
  delBtnIcon: ' ',
  editBtnIcon: ' ',
  labelSuffix: ' ',
  column: [{
    label: '类型',
    prop: 'type',
    search: true,
    editDisabled: true,
    rules: [{
        required: true,
        message: '请输入类型',
        trigger: 'blur'
      },
      rule.checkLen(50),
      {
        validator: rule.checkSpace,
        trigger: 'blur'
      }
    ]
  }, {
    label: '描述',
    prop: 'description',
    rules: [{
        required: true,
        message: '请输入字典描述',
        trigger: 'blur'
      },
      rule.checkLen(),
      {
        validator: rule.checkSpace,
        trigger: 'blur'
      }
    ]
  }, {
    label: '字典类型',
    prop: 'system',
    type: 'select',
    dicUrl: '/admin/dict/type/dict_type',
    rules: [{
      required: true,
      message: '请选择字典类型',
      trigger: 'blur'
    }],
    search: true
  }, {
    label: '备注信息',
    prop: 'remarks',
    type: 'textarea',
    rules: [rule.checkLen(100)]
  }, {
    width: 150,
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    addDisplay: false,
    editDisabled: true,
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  }]
}

export const tableDictItemOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: false,
  columnBtn: false,
  showClomnuBtn: false,
  searchSize: 'small',
  column: [{
    label: '类型',
    prop: 'type',
    addDisabled: true,
    editDisabled: true
  }, {
    width: 150,
    label: '数据值',
    prop: 'value',
    rules: [{
      required: true,
      message: '请输入数据值',
      trigger: 'blur'
    }, rule.checkLen()]
  }, {
    label: '标签名',
    prop: 'label',
    rules: [{
      required: true,
      message: '请输入标签名',
      trigger: 'blur'
    }, rule.checkLen()]
  }, {
    label: '描述',
    prop: 'description',
    rules: [{
      required: true,
      message: '请输入字典描述',
      trigger: 'blur'
    }, rule.checkLen()]
  }, {
    label: '排序',
    prop: 'sort',
    dataType: 'number',
    rules: [{
      required: true,
      message: '请输入排序',
      trigger: 'blur'
    }]
  }, {
    label: '备注信息',
    prop: 'remarks',
    rules: [rule.checkLen(100)],
    type: 'textarea'
  }]
}
