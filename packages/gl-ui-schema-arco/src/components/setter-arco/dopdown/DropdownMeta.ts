export default {
    "componentName": "ADropdown",
    "displayMode": "Tile",
    "iconType":"gl-dropdown",
    "group": "dataEntry",
    "title": "下拉菜单",
    "alias": "dropdown",
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
