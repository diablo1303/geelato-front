export default {
    "componentName": "GlBlockNotification",
    "displayMode": "Tile",
    "iconType": "gl-notification",
    "group": "block_feedback",
    "title": "通知提醒",
    "useBy": ["freePage"],
    "blockContent": "全局展示通知提醒，内容为：${content}",
    "properties": [{
        "name": "content",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "内容",
        "setterComponentName": "AInput",
        "enableValueExpress": true,
    }, {
        "name": "title",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "标题",
        "setterComponentName": "AInput",
        "enableValueExpress": true,
    }, {
        "name": "closable",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "可关闭",
        "setterComponentName": "ASwitch"
    }, {
        "name": "method",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {
            "options": [
                {"label": "信息提醒", "value": "info"},
                {"label": "成功提醒", "value": "success"},
                {"label": "警告提醒", "value": "warning"},
                {"label": "错误提醒", "value": "error"}
            ]
        },
        "setterComponentVModelName": "modelValue",
        "title": "提醒类型",
        "setterComponentName": "ASelect"
    }],
    "actions": []
}