export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  // menuAlign: 'center',
  // menuWidth: 150,
  // align: 'center',
  refreshBtn: false,
  columnBtn: false,
  searchShowBtn: false,
  showClomnuBtn: false,
  menu: false,
  searchSize: 'small',
  searchMenuSpan: 6,
  addBtn: false,
  labelWidth: 150,
  editBtn: false,
  viewBtn: false,
  delBtn: false,
  delBtnIcon: ' ',
  viewBtnIcon: ' ',
  labelSuffix: ' ',
  props: {
    label: 'label',
    value: 'value'
  },
  column: [{
      label: '类型',
      prop: 'type',
      type: 'select',
      dicUrl: '/admin/dict/type/log_type',
      search: true
    }, {
      label: '标题',
      prop: 'title'
    }, {
      label: 'IP地址',
      prop: 'remoteAddr'
    }, {
      label: '请求方式',
      prop: 'method'
    }, {
      label: '操作人员',
      prop: 'createBy'
    },
    // {
    //   label: '客户端',
    //   prop: 'serviceId'
    // },
    //  {
    //   width: 110,
    //   label: '请求时间(ms)',
    //   prop: 'time'
    // },
    {
      width: 150,
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      search: true,
      searchRange: true
    }
  ]
}
