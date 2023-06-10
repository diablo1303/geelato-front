export default {
    "componentName": "ACheckbox",
    "displayMode": "Tile",
    "iconType":"gl-checkbox",
    "group": "dataEntry",
    "title": "多选框",
    "alias": "cb",
    "useBy": ["freePage"],
    "properties": [{
        "name": "rules",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "验证规则",
        "setterComponentName": "GlValidateRulesSetter"
    }],
    "actions": [{"name": "change", "description": "", "title": "值改变"}]
}
