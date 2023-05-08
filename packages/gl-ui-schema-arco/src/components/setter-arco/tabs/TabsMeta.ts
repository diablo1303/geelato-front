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
        "title": "子项",
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
            "setterComponentName": "GlIconfontSetter"
        }],
        "titleField": "title"
    }],
    "actions": []
}