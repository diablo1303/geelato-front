export default {
    "componentName": "ASwitch",
    "displayMode": "Tile",
    "iconType":"gl-switch",
    "group": "dataEntry",
    "title": "开关",
    "alias": "switch",
    "useBy": ["freePage"],
    "properties": [{
        "name": "label",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "标题",
        "setterComponentName": "AInput"
    }, {
        "name": "bindField",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "绑定字段",
        "setterComponentName": "GlEntityFieldSelect"
    }, {
        "name": "autofocus",
        "setterComponentProps": {},
        "setterComponentVModelName": "checked",
        "group": "base",
        "type": "props",
        "description": "组件自动获取焦点",
        "title": "自动焦点",
        "setterComponentName": "ASwitch"
    }],
    "actions": []
}
