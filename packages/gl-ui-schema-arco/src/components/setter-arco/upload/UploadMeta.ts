export default {
    "componentName": "GlUpload",
    "displayMode": "Tile",
    "iconType":"gl-upload",
    "group": "dataEntry",
    "title": "上传",
    "alias": "upload",
    "useBy": ["freePage"],
    "properties": [
        {
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
            "name": "hideLabel",
            "group": "base",
            "type": "props",
            "enableValueExpress": true,
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "隐藏标题",
            "setterComponentName": "ASwitch"
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
        }
    ]
}
