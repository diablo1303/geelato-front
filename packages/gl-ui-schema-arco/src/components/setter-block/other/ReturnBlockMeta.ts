export default {
    "componentName": "GlReturnBlock",
    "displayMode": "tile",
    "iconType": "gl-undo",
    "group": "block_other",
    "title": "返回结果",
    "useBy": ["freePage"],
    "blockContent": "返回结果，表达式为${content}",
    "properties": [{
        "name": "content",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "返回结果",
        "setterComponentName": "AInput",
        "enableValueExpress": true,
        "placeholder": "返回结果表达式"
    }],
    "actions": []
}