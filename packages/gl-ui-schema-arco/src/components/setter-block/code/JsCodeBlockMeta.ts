export default {
    "componentName": "GlJsCodeBlock",
    "displayMode": "tile",
    "iconType": "gl-code",
    "group": "block_code",
    "title": "JS代码",
    "useBy": ["freePage"],
    "blockContent": "自定义JS代码，${description} 代码：${code}",
    "properties": [{
        "name": "code",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "代码",
        "setterComponentProps": {"showInput": true},
        "setterComponentVModelName": "modelValue",
        "setterComponentName": "GlExpressionSetter",
        "enableValueExpress": false,
        "placeholder": "代码内容"
    }, {
        "name": "description",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "代码描述",
        "setterComponentName": "AInput",
        "enableValueExpress": false,
        "placeholder": "代码描述"
    }],
    "actions": []
}