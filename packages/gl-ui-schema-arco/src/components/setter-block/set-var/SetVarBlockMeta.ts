export default {
    "componentName": "GlSetVarBlock",
    "displayMode": "tile",
    "iconType": "gl-var",
    "group": "block_var",
    "title": "设置变量",
    "useBy": ["freePage"],
    "blockContent": "设置变量：${varName} 值为：${varValue}。",
    "properties": [{
        "name": "varName",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "变量名称",
        "setterComponentName": "AInput"
    }, {
        "name": "varValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "变量值",
        "setterComponentName": "AInput",
        "enableValueExpress": true
    }]
}