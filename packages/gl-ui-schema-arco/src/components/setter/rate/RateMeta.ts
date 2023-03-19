export default {
    "componentName": "ARate",
    "displayMode": "Tile",
    "iconType": "gl-rate",
    "group": "dataEntry",
    "title": "评分",
    "useBy": ["freePage"],
    "properties": [{
        "name": "count",
        "setterComponentProps": {"defaultValue": 10},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "star 总数",
        "title": "评分总数",
        "setterComponentName": "AInputNumber",
        "show": true,
        "expanded": true
    }, {
        "name": "defaultValue",
        "setterComponentProps": {"defaultValue": 5},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "placeholder": "",
        "setterComponentName": "AInputNumber",
        "title": "默认值"
    }, {
        "name": "allowHalf",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "是否允许半选",
        "title": "半星评分",
        "setterComponentName": "ASwitch",
        "show": true,
        "expanded": true
    }, {
        "name": "allowClear",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "title": "允许清除",
        "description": "是否允许再次点击后清除",
        "setterComponentName": "ASwitch",
        "show": true,
        "expanded": true
    }, {
        "name": "grading",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "placeholder": "是否开启笑脸分级",
        "title": "笑脸分级",
        "setterComponentName": "ASwitch"
    }, {
        "name": "readonly",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "只读",
        "setterComponentName": "ASwitch"
    }, {
        "name": "disabled",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "",
        "title": "禁用",
        "setterComponentName": "ASwitch",
        "show": true,
        "expanded": true
    }, {
        "name": "color",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentName": "AInput",
        "title": "颜色"
    }, {
        "name": "character",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "slots",
        "show": true,
        "expanded": true,
        "title": "符号",
        "setterComponentName": "AInput",
        "slotComponentBindTarget": "v-model"
    }],
    "diplayMode": "Tile"
}