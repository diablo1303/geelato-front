export default {
    "componentName": "GlLogBlock",
    "displayMode": "tile",
    "iconType": "gl-log",
    "group": "block_other",
    "title": "输出日志",
    "useBy": ["freePage"],
    "blockContent": "控制台输出日志内容${content}",
    "properties": [{
        "name": "content",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "日志内容",
        "setterComponentName": "AInput",
        "enableValueExpress": true,
        "placeholder": "控制台输出日志内容"
    }],
    "actions": []
}