export default {
    "componentName": "ADivider",
    "displayMode": "tile",
    "iconType": "gl-divider",
    "group": "layout",
    "title": "分割线",
    "alias": "divider",
    "useBy": ["freePage"],
    "properties": [{
        "name": "dashed",
        "setterComponentProps": {},
        "setterComponentVModelName": "checked",
        "group": "base",
        "type": "props",
        "title": "是否虚线",
        "setterComponentName": "ASwitch"
    }, {
        "name": "orientation",
        "setterComponentProps": {
            "options": [{"label": "左边", "value": "left"}, {
                "label": "中间",
                "value": "center"
            }, {"label": "右边", "value": "right"}], "mode": "SECRET_COMBOBOX_MODE_DO_NOT_USE", "optionType": "button"
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "title": "标题位置",
        "description": "分割线标题的位置",
        "setterComponentName": "ARadioGroup",
        "placeholder": ""
    }, {
        "name": "orientationMargin",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "标题和最近 left/right 边框之间的距离，去除了分割线，同时 orientation 必须为 left 或 right",
        "title": "标题距离",
        "setterComponentName": "AInputNumber"
    }, {
        "name": "plain",
        "setterComponentProps": {},
        "setterComponentVModelName": "checked",
        "group": "base",
        "type": "props",
        "description": "文字是否显示为普通正文样式",
        "title": "普通正文",
        "setterComponentName": "ASwitch"
    }, {
        "name": "type",
        "setterComponentProps": {
            "optionType": "button",
            "options": [{"label": "水平", "value": "horizontal"}, {"label": "垂直", "value": "vertical"}],
            "buttonStyle": "outline"
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "水平还是垂直类型",
        "title": "方向类型",
        "setterComponentName": "ARadioGroup"
    }]
}
