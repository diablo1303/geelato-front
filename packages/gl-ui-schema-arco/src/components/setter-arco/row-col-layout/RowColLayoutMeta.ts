export default {
    "componentName": "GlRowColLayout",
    "displayMode": "tile",
    "iconType": "gl-grid",
    "group": "layout",
    "title": "栅格布局",
    "alias": "rclayout",
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
        "enableValueExpress": true,
        "description": "此布局组件的标题不会出现在最终用户页面上，用于设计时展示，如动作编排时展示。"
    }, {
        "name": "showLabel",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "description": "作为表单字段，显示label的内容",
        "title": "显示标题",
        "setterComponentName": "ASwitch"
    }, {
        "name": "spans",
        "setterComponentProps": {"min": 1, "max": 24},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "项",
        "setterComponentName": "GlArrayNumberSetter",
        "enableValueExpress": false
    }],
    "displayOnStage": "block"
}