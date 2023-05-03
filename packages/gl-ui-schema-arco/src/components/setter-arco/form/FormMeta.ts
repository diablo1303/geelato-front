export default {
    "componentName": "GlEntityForm",
    "displayMode": "Tile",
    "iconType": "gl-form",
    "group": "dataEntry",
    "title": "实体表单",
    "useBy": ["freePage"],
    "properties": [{
        "expanded": true,
        "style": "",
        "name": "title",
        "title": "标题",
        "group": "base",
        "placeholder": "",
        "description": "标题",
        "setterComponentName": "AInput",
        "setterComponentVModelName": "modelValue",
        "setterComponentProps": {},
        "type": "props",
        "show": true
    }, {
        "name": "bindEntity",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "绑定实体",
        "setterComponentName": "GlAppEntitySelect"
    }, {
        "name": "layout",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {
            "type": "button",
            "options": [{"label": "水平", "value": "horizontal"}, {
                "label": "垂直",
                "value": "vertical"
            }, {"label": "行内", "value": "inline"}],
            "defaultValue": "horizontal"
        },
        "setterComponentVModelName": "modelValue",
        "title": "表单布局",
        "setterComponentName": "ARadioGroup"
    }, {
        "name": "autoLabelWidth",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "自动标签宽",
        "setterComponentName": "ASwitch",
        "description": "设置 auto-label-width 开启自动标签宽度。仅在 layout=\"horizontal\" 布局下生效。"
    }],
    "actions": []
}