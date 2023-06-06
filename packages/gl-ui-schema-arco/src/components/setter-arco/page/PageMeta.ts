export default {
    "componentName": "GlPage",
    "displayMode": "Tile",
    "iconType": "gl-page",
    "group": "navigation",
    "title": "页面",
    "alias": "page",
    "useBy": ["freePage"],
    "properties": [{
        "name": "pageTitle",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "标题",
        "setterComponentName": "AInput"
    }, {
        "name": "pageMargin",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "外边距",
        "setterComponentName": "AInput",
        "placeholder": "如16px"
    }, {
        "name": "pagePadding",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "内边距",
        "placeholder": "如：14px",
        "setterComponentName": "AInput"
    }],
    "actions": [{"name": "onMounted", "description": "页面加载完时触发，和Vue的onMounted一致", "title": "加载完"}],
}