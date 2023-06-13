export default {
    "componentName": "ACalendar",
    "displayMode": "Tile",
    "iconType": "gl-calendar",
    "group": "dataDisplay",
    "title": "日历",
    "alias": "cal",
    "useBy": ["freePage"],
    "properties": [
        {
            "name": "rules",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "验证规则",
            "setterComponentName": "GlValidateRulesSetter"
        }
    ],
    "actions": [{"name": "change", "description": "", "title": "值改变"}]
}
