export default {
    "componentName": "GlTabs",
    "displayMode": "Tile",
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
        "_showSub": false,
        "properties": [{
            "name": "title",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "标题",
            "setterComponentName": "AInput"
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
        }],
        "titleField": "title",
        "enableValueExpress": false
    }, {
        "name": "extra",
        "group": "base",
        "type": "slots",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "额外",
        "setterComponentName": "GlComponentSelect",
        "slotComponentName": "GlComponent",
        "slotComponentBindTarget": "v-model",
        "slotComponentBindName": "glComponentInst"
    }],
    "actions": [{"name": "change", "description": "切换选项卡", "title": "切换选项卡"}]
}