export default {
    "componentName": "GlGroupSumBlock",
    "displayMode": "tile",
    "iconType": "gl-sum",
    "group": "block_data",
    "title": "分组求和",
    "useBy": ["freePage"],
    "blockContent": "依据分组:${groupField}，对字段:${sumFields}进行求和。",
    "properties": [{
        "name": "dataVarName",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "数据变量",
        "placeholder": "用于求和计算的数据集变量",
        "description": "",
        "setterComponentName": "AInput",
        "enableValueExpress": false
    },{
        "name": "groupField",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "分组字段",
        "placeholder": "用于分组的字段名",
        "description": "",
        "setterComponentName": "AInput",
        "enableValueExpress": false
    },{
        "name": "sumFields",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "求和字段",
        "placeholder": "",
        "description": "",
        "setterComponentName": "AInput",
        "enableValueExpress": false
    }]
}