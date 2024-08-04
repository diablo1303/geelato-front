export default {
    "componentName": "GlUserSelect",
    "displayMode": "tile",
    "iconType": "gl-user",
    "group": "dataEntry",
    "title": "人员选择",
    "alias": "userselect",
    "useBy": ["freePage"],
    "properties": [{
        "name": "label",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "标题",
        "setterComponentName": "AInput"
    }, {
        "name": "bindField",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "绑定字段",
        "setterComponentName": "GlEntityFieldSelect"
    }, {
        "name": "nameFieldBindComponentId",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "名称组件",
        "setterComponentName": "AInput",
        "description": "人员选择时，人员id绑定到本组件，人员名称需绑定到另一个组件，在此设置目标组件的唯一标识。",
        "placeholder": "名称组件的唯一标识"
    }],
    "actions": [{"name": "valueChange", "description": "", "title": "值改变"}]
}