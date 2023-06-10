export default {
    "componentName": "ATransfer",
    "displayMode": "Tile",
    "iconType":"gl-transfer",
    "group": "dataEntry",
    "title": "穿梭框",
    "alias": "transfer",
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
    }],"actions": [],
}
