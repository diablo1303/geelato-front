export default {
    "componentName": "GlGenerateMqlBlock",
    "displayMode": "tile",
    "iconType": "gl-api",
    "group": "block_data",
    "title": "实体查询mql",
    "useBy": ["freePage"],
    "blockContent": "构建基于元数据的实体查询对象（mql），并存到变量：${varName}。",
    "properties": [{
        "name": "entityReader",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {"options": []},
        "setterComponentVModelName": "modelValue",
        "title": "实体查询",
        "setterComponentName": "GlEntityReaderSetter",
        "enableValueExpress": true,
        "displayMode": "tile"
    }, {
        "name": "varName",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "存到变量",
        "setterComponentName": "AInput"
    }]
}