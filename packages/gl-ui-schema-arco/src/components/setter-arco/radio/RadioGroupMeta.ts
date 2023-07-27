export default {
    "componentName": "ARadioGroup",
    "displayMode": "Tile",
    "iconType": "gl-radio",
    "group": "dataEntry",
    "title": "单选框",
    "alias": "radio",
    "useBy": ["freePage"],
    "properties": [{
        "name": "label",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "标题",
        "setterComponentName": "AInput"
    }, {
        "name": "bindField",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "绑定字段",
        "setterComponentName": "GlEntityFieldSelect"
    }, {
        "name": "type",
        "setterComponentProps": {
            "type": "button",
            "options": [{"label": "默认", "v_uRO8QeIdHMEVfSq8": "radio", "value": "radio"}, {
                "label": "按钮",
                "v_uRO8QeIdHMEVfSq8": "button",
                "value": "button"
            }],
            "defaultValue": "radio"
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "单选类型",
        "setterComponentName": "ARadioGroup"
    }, {
        "name": "options",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "选项",
        "setterComponentName": "GlOptionsSetter"
    }, {
        "name": "size",
        "setterComponentProps": {
            "options": [{
                "label": "迷你",
                "v_4xTO1UDcHYF3J7fA": "mini",
                "value": "mini"
            }, {"label": "小", "v_4xTO1UDcHYF3J7fA": "small", "value": "small"}, {
                "label": "中",
                "v_4xTO1UDcHYF3J7fA": "medium",
                "value": "medium"
            }, {"label": "大", "v_4xTO1UDcHYF3J7fA": "large", "value": "large"}], "allowClear": false
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "大小",
        "setterComponentName": "ASelect"
    }, {
        "name": "direction",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {
            "type": "radio",
            "options": [{"label": "水平", "v_y2YdErykBVuNFkV7": "horizontal", "value": "horizontal"}, {
                "label": "垂直",
                "v_y2YdErykBVuNFkV7": "vertical",
                "value": "vertical"
            }],
            "defaultValue": "horizontal"
        },
        "setterComponentVModelName": "modelValue",
        "title": "方向",
        "setterComponentName": "ARadioGroup"
    }, {
        "name": "disabled",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "禁用",
        "setterComponentName": "ASwitch"
    }],
    "actions": [{"name": "onValueChange", "description": "", "title": "值改变"}]
}