export default {
    "componentName": "GlEntityCascader",
    "displayMode": "tile",
    "iconType": "gl-cascader",
    "group": "dataEntry",
    "title": "级联选择",
    "alias": "cascader",
    "useBy": ["freePage", "formPage", "listPage"],
    "properties": [{
        "name": "label",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "标题",
        "setterComponentName": "AInput",
        "enableValueExpress": true
    }, {
        "name": "hideLabel",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "隐藏标题",
        "setterComponentName": "ASwitch"
    }, {
        "name": "bindField",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "绑定字段",
        "setterComponentName": "GlEntityFieldSelect",
        "enableValueExpress": false
    }, {
        "name": "entityReader",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "displayMode": "tile",
        "setterComponentProps": {
            "options": [
                { "label": "ID",  "value": "id" },
                { "label": "父ID", "value": "pid" },
                {
                    "label": "标题",
                    "value": "label"
                },
                {
                    "label": "值",
                    "value": "value"
                }
            ]
        },
        "setterComponentVModelName": "modelValue",
        "title": "数据实体",
        "setterComponentName": "GlEntityReaderSetter"
    }, {
        "name": "pathMode",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "displayMode": "tile",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "是路径值",
        "placeholder": "绑定值是否为路径格式",
        "description": "值为数组格式",
        "setterComponentName": "ASwitch"
    }, {
        "name": "multiple",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "displayMode": "tile",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "可多选",
        "setterComponentName": "ASwitch",
        "placeholder": "是否为多选状态",
        "description": "是否为多选状态（多选模式默认开启搜索）"
    }, {
        "name": "maxTagCount",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "displayMode": "tile",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "多选数量",
        "description": "多选模式下，最多显示的标签数量。0 表示不限制",
        "setterComponentName": "AInputNumber",
        "setterDefaultValue": 0
    }, {
        "name": "allowSearch",
        "group": "base",
        "type": "props",
        "enableValueExpress": true,
        "show": true,
        "expanded": true,
        "displayMode": "tile",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "description": "",
        "title": "可搜索",
        "setterComponentName": "ASwitch"
    }, {
        "name": "allowClear",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "displayMode": "tile",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "可清除",
        "setterComponentName": "ASwitch"
    }, {
        "name": "size",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "displayMode": "tile",
        "setterComponentProps": {
            "options": [{
                "label": "mini",
                "value": "mini",
                "__pe9FpWDzLjxnnmUBtX": "mini"
            }, {"label": "small", "value": "small", "__pe9FpWDzLjxnnmUBtX": "small"}, {
                "label": "medium",
                "value": "medium",
                "__pe9FpWDzLjxnnmUBtX": "medium"
            }, {"label": "large", "value": "large", "__pe9FpWDzLjxnnmUBtX": "large"}], "allowClear": true
        },
        "setterComponentVModelName": "modelValue",
        "title": "大小",
        "setterComponentName": "ASelect"
    }],
    "actions": [],
    "displayOnStage": "inline-block"
}