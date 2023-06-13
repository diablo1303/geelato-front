export default {
    "componentName": "ATreeSelect",
    "displayMode": "Tile",
    "iconType":"gl-treeSelect",
    "group": "dataEntry",
    "title": "树选择",
    "alias": "treeselect",
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
