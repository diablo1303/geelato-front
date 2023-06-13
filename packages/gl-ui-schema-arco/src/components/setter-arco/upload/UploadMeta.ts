export default {
    "componentName": "AUpload",
    "displayMode": "Tile",
    "iconType":"gl-upload",
    "group": "dataEntry",
    "title": "上传",
    "alias": "upload",
    "useBy": ["freePage"],
    "properties": [ {
        "name": "rules",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "验证规则",
        "setterComponentName": "GlValidateRulesSetter"
    }],"actions": [],
}
