export default {
    "componentName": "GlEncode",
    "displayMode": "tile",
    "iconType": "gl-encode",
    "group": "dataEntry",
    "title": "编码",
    "alias": "encode",
    "useBy": ["freePage"],
    "properties": [{
        "name": "label",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "标题",
        "setterComponentName": "AInput",
        "enableValueExpress": true
    }, {
        "name": "bindField",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "绑定字段",
        "setterComponentName": "GlEntityFieldSelect",
        "enableValueExpress": false
    }, {
        "name": "codedId",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {"entityName": "platform_encoding", "labelFieldNames": ["title"], "valueFieldName": "id"},
        "setterComponentVModelName": "modelValue",
        "title": "字段编码",
        "setterComponentName": "GlDynamicSelect",
        "enableValueExpress": false,
        "description": "选择应用配置中定义的字段编码规则",
    }],
    "actions": [{"name": "valueChange", "description": "值改变时触发", "title": "值改变"}]
}