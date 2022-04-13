export const tableOption = {
    align: "center",
    index: true,
    border: true,
    column: [
        {
            prop: "deviceId",
            span: 12,
            type: "input",
            label: "设备编号",
            readonly: true
        },
        {
            prop: "deviceName",
            span: 12,
            type: "input",
            label: "设备名称",
            display: true
        },
        {
            prop: "productName",
            span: 12,
            type: "select",
            label: "产品名称",
            props: { label: "label", value: "value" },
            dicUrl: "device/tdeviceproduct/getList",
            display: true,
            dicMethod: "get",
            cascaderItem: []
        },
        {
            prop: "createTime",
            span: 12,
            type: "input",
            label: "注册时间",
            format: "yyyy-MM-dd HH:mm:ss",
            display: false,
            valueFormat: "yyyy-MM-dd HH:mm:ss"
        },
        { prop: "status", span: 12, type: "input", label: "状态", display: true },
        { prop: "remark", span: 12, type: "input", label: "说明", display: true }
    ],
    gutter: 0,
    stripe: true,
    menuBtn: true,
    emptyBtn: true,
    emptyText: "清空",
    menuAlign: "center",
    submitBtn: true,
    indexLabel: "序号",
    labelWidth: 120,
    submitText: "提交",
    labelSuffix: "",
    menuPosition: "center",
    labelPosition: "left",
    searchMenuSpan: 6
}
