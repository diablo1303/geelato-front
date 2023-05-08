export default {
    "componentName": "ATimePicker",
    "displayMode": "Tile",
    "iconType":"gl-timePicker",
    "group": "dataEntry",
    "title": "时间选择",
    "alias": "time",
    "useBy": ["freePage"],
    "properties": [
        {
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
        }
    ],"actions": [],
}
