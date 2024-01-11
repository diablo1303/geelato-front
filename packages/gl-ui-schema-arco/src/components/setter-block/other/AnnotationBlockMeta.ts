export default {
    "componentName": "GlAnnotationBlock",
    "displayMode": "tile",
    "iconType": "gl-info-circle",
    "group": "block_other",
    "title": "注释",
    "useBy": ["freePage"],
    "blockContent": "${content}",
    "properties": [{
        "name": "content",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "注释",
        "setterComponentName": "ATextarea",
        "enableValueExpress": false,
        "placeholder": "注释"
    }],
    "actions": []
}