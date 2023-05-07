export default {
    "componentName": "GlUserSelect",
    "displayMode": "Tile",
    "iconType": "gl-user",
    "group": "dataEntry",
    "title": "人员选择",
    "alias": "userselect",
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
        "name": "multipleSelect",
        "setterComponentProps": {"defaultValue": false},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "是否多选",
        "setterComponentName": "ASwitch"
    }],
    "actions": []
}