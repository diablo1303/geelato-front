export default {
    "componentName": "GlText",
    "displayMode": "Tile",
    "iconType": "gl-text",
    "group": "dataEntry",
    "title": "文本",
    "alias": "text",
    "useBy": ["freePage"],
    "properties": [{
        "name": "label",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "title": "标题",
        "setterComponentName": "AInput"
    }, {
        "name": "bindField",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "setterComponentName": "GlEntityFieldSelect",
        "title": "编写对象"
    }, {
        "name": "_content",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "title": "内容",
        "setterComponentName": "AInput"
    }, {
        "name": "bold",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "粗体",
        "setterComponentName": "ASwitch",
        "enableValueExpress": true
    }, {
        "name": "mark",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "标记样式",
        "setterComponentName": "ASwitch"
    }, {
        "name": "underline",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "下划线",
        "setterComponentName": "ASwitch"
    }, {
        "name": "delete",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "删除线",
        "setterComponentName": "ASwitch"
    }, {
        "name": "code",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "代码块",
        "setterComponentName": "ASwitch"
    }, {
        "name": "editable",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "可编辑",
        "setterComponentName": "ASwitch"
    }, {
        "name": "copyable",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "可复制",
        "setterComponentName": "ASwitch"
    }],
    "actions": [{"name": "onValueChange", "description": "", "title": "值改变"}],
    "displayOnStage": "inline-block"
}