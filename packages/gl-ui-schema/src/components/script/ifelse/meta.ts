export default {
    "componentName": "GlScriptIfElse",
    "displayMode": "Tile",
    "iconType": "gl-button",
    "group": "condition",
    "title": "IF条件",
    "useBy": ["scriptPage"],
    "properties": [{
        "name": "mode",
        "setterComponentProps": {
            "mode": "SECRET_COMBOBOX_MODE_DO_NOT_USE",
            "options": [{"label": "满足以下全部条件", "value": "and"}, {"label": "满足以下任一条件", "value": "or"}],
            "defaultValue": ""
        },
        "setterComponentVModelName": "value",
        "group": "base",
        "type": "props",
        "title": "条件与或",
        "setterComponentName": "ASelect"
    }, {
        "name": "conditions",
        "setterComponentProps": {},
        "setterComponentVModelName": "",
        "group": "base",
        "type": "props",
        "title": "条件",
        "_showSub": true,
        "properties": [{
            "name": "name",
            "setterComponentProps": {},
            "setterComponentVModelName": "value",
            "group": "base",
            "type": "props",
            "title": "名称",
            "setterComponentName": "AInput"
        }, {
            "name": "va",
            "setterComponentProps": {},
            "setterComponentVModelName": "value",
            "group": "base",
            "type": "props",
            "title": "条件值",
            "setterComponentName": "AInput"
        }, {
            "name": "compare",
            "setterComponentProps": {
                "mode": "SECRET_COMBOBOX_MODE_DO_NOT_USE",
                "options": [{"label": "大于", "value": "gt"}, {"label": "大于等于", "value": "gte"}],
                "defaultValue": ""
            },
            "setterComponentVModelName": "value",
            "group": "base",
            "type": "props",
            "title": "比较",
            "setterComponentName": "ASelect"
        }, {
            "name": "vb",
            "setterComponentProps": {},
            "setterComponentVModelName": "value",
            "group": "base",
            "type": "props",
            "title": "比较值",
            "setterComponentName": "AInput"
        }],
        "setterComponentName": "GlObjectArraySetter"
    }]
}
