export default {
    "componentName": "AMentions",
    "displayMode": "Tile",
    "iconType":"gl-mentions",
    "group": "dataEntry",
    "title": "提及",
    "alias": "mention",
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
