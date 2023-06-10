export default {
    "componentName": "ASlider",
    "displayMode": "Tile",
    "iconType":"gl-slider",
    "group": "dataEntry",
    "title": "滑动输入条",
    "alias": "slider",
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
