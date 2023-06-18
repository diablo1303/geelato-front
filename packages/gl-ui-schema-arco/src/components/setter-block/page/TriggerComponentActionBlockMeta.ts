export default {
    "componentName": "GlTriggerComponentActionBlock",
    "displayMode": "Tile",
    "iconType": "gl-file",
    "group": "block_page",
    "title": "触发组件动作",
    "useBy": ["freePage"],
    "blockContent": "触发组件${componentId}的动作事件${actionName}",
    "properties": [{
        "name": "appId",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "应用ID",
        "setterComponentName": "AInput",
        "placeholder": "不填写表示当前应用"
    }, {
        "name": "extendId",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "页面",
        "setterComponentName": "GlPageSelect",
        "enableValueExpress": false
    }, {
        "name": "componentId",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "触发的组件",
        "setterComponentName": "GlPageComponentSelect",
        "enableValueExpress": false
    }, {
        "name": "actionName",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "触发组件动作",
        "setterComponentName": "GlComponentActionSelect",
        "enableValueExpress": false
    }],
    "actions": []
}