export default {
    "componentName": "GlExportWordBlock",
    "displayMode": "tile",
    "iconType": "gl-file-word",
    "group": "block_file",
    "title": "导出Word",
    "useBy": ["freePage"],
    "blockContent": `将数据$\{varName}导出到Word（$\{fileName}）。`,
    "properties": [{
        "name": "fileName",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "文件名",
        "setterComponentName": "AInput",
        "enableValueExpress": true,
        "displayMode": "tile"
    }, {
        "name": "fileTemplate",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "Excel模板",
        "setterComponentName": "GlAppFileTemplateSelect",
        "enableValueExpress": false,
        "displayMode": "tile"
    }, {
        "name": "dataType",
        "setterComponentProps": {
            "multiple": false,
            "options": [{
                "label": "最终数据对象",
                "value": "data",
                "__MSKzjrlvedxBnMhBMm": "data"
            }, {"label": "mql数据查询对象", "value": "mql", "__MSKzjrlvedxBnMhBMm": "mql"}]
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "displayMode": "tile",
        "title": "数据类型",
        "description": "传到服务端的数据类型",
        "setterComponentName": "ASelect",
        "setterDefaultValue": "mql"
    }, {
        "name": "varName",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "displayMode": "tile",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "placeholder": "",
        "description": "上下文中可获取的最终数据对象或GQL查询数据对象的变量名",
        "title": "数据变量名",
        "setterComponentName": "AInput"
    }, {
        "name": "enableAwait",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "displayMode": "tile",
        "description": "是否同步调用该方法，对于自身为异步的方法有效，如服务端请求",
        "title": "同步调用",
        "setterComponentName": "ASwitch"
    }]
}