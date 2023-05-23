export default {
    "componentName": "GlBlockSetVar",
    "displayMode": "Tile",
    "iconType": "gl-var",
    "group": "block_var",
    "title": "变量-基于组件",
    "useBy": ["freePage"],
    "blockContent": "设置变量名为：${varName}，值为对象：${componentType}的属性值：${propertyName}",
    "properties": [{
        "name": "varName",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "设置变量",
        "setterComponentName": "AInput"
    }, {
        "name": "componentType",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {
            "options": [{"label": "当前组件", "value": "component"}, {
                "label": "指定组件",
                "value": "specific"
            }, {"label": "当前页面组件", "value": "page"}]
        },
        "setterComponentVModelName": "modelValue",
        "title": "值对象",
        "setterComponentName": "ASelect"
    }, {
        "name": "propertyName",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "值属性",
        "setterComponentName": "AInput"
    }],
    "actions": []
}