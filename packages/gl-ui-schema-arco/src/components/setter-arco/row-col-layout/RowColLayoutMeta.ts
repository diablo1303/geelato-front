export default {
    "componentName": "GlRowColLayout",
    "displayMode": "Tile",
    "iconType": "gl-layout",
    "group": "layout",
    "title": "行列布局",
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
        "description":"此布局组件的标题不会出现在最终用户页面上，用于设计时展示，如动作编排时展示。"
    },{
        "name": "spans",
        "setterComponentProps": {"min": 1, "max": 24},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "项",
        "setterComponentName": "GlArrayNumberSetter"
    }],
    "displayOnStage": "block"
}