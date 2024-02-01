export default {
    "componentName": "GlTabs",
    "displayMode": "tile",
    "iconType": "gl-tabs",
    "group": "layout",
    "title": "标签页",
    "alias": "tabs",
    "useBy": ["freePage"],
    "properties": [{
        "name": "items",
        "setterComponentProps": {},
        "setterComponentVModelName": "",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "标签项",
        "setterComponentName": "GlObjectArraySetter",
        "_showSub": true,
        "properties": [{
            "name": "title",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "标题",
            "setterComponentName": "AInput",
            "enableValueExpress": false
        }, {
            "name": "value",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "值",
            "description": "切换tab时，选中的值",
            "setterComponentName": "AInput",
            "enableValueExpress": true,
            "displayMode": "tile"
        }, {
            "name": "iconType",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "图标",
            "setterComponentName": "GlIconfontSelect",
            "enableValueExpress": false
        }, {
            "name": "disabled",
            "group": "base",
            "type": "props",
            "enableValueExpress": true,
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "禁用",
            "setterComponentName": "ASwitch"
        }],
        "titleField": "title",
        "enableValueExpress": false,
        "displayMode": "tile",
        "subTitleField": "value",
        "alarmIfNoSubTitle": "值为空"
    }, {
        "name": "position",
        "setterComponentProps": {
            "type": "button",
            "options": [{"label": "上", "__tSp7EKessXKGubfoAD": "top", "value": "top"}, {
                "label": "右",
                "__tSp7EKessXKGubfoAD": "right",
                "value": "right"
            }, {"label": "下", "__tSp7EKessXKGubfoAD": "bottom", "value": "bottom"}, {
                "label": "左",
                "__tSp7EKessXKGubfoAD": "left",
                "value": "left"
            }]
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "title": "位置",
        "setterComponentName": "ARadioGroup",
        "setterDefaultValue": ""
    }, {
        "name": "extra",
        "group": "base",
        "type": "slots",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "右上操作",
        "setterComponentName": "GlSlotSetter",
        "slotComponentName": "GlComponent",
        "slotComponentBindTarget": "v-model",
        "slotComponentBindName": "glComponentInst"
    }, {
        "name": "type",
        "setterComponentProps": {
            "type": "radio",
            "options": [{"label": "line", "value": "line", "__eGMOjRWzE5POvKO12X": "line"}, {
                "label": "card",
                "value": "card",
                "__eGMOjRWzE5POvKO12X": "card"
            }, {
                "label": "card-gutter",
                "value": "card-gutter",
                "__eGMOjRWzE5POvKO12X": "card-gutter"
            }, {"label": "text", "value": "text", "__eGMOjRWzE5POvKO12X": "text"}, {
                "label": "rounded",
                "value": "rounded",
                "__eGMOjRWzE5POvKO12X": "rounded"
            }, {"label": "capsule", "value": "capsule", "__eGMOjRWzE5POvKO12X": "capsule"}]
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "title": "类型",
        "setterComponentName": "ARadioGroup",
        "displayMode": "tile"
    }],
    "actions": [{"name": "onValueChange", "description": "切换选项卡", "title": "切换选项卡"}]
}