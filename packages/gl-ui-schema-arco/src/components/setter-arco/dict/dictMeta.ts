export default {
    "componentName": "GlDict",
    "displayMode": "Tile",
    "iconType": "gl-select",
    "group": "dataEntry",
    "title": "数据字典",
    "alias": "dict",
    "useBy": ["freePage"],
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
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "隐藏标题",
        "setterComponentName": "ASwitch",
        "enableValueExpress": true
    },{
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
        "name": "dictId",
        "setterComponentProps": {
            "entityName": "platform_dict",
            "labelFieldName": "dictName",
            "valueFieldName": "id",
            "ascOrDesc": "+",
            "orderFieldName": "seq_no"
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "title": "数据字典名",
        "description": "数据字典选项集",
        "setterComponentName": "GlDynamicSelect"
    }, {
        "name": "dictAscOrDesc",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {
            "type": "button",
            "options": [{"label": "升序 asc", "__FuNUUHKrAdsec1H3gt": "+", "value": "+"}, {
                "label": "降序 desc",
                "__FuNUUHKrAdsec1H3gt": "-",
                "value": "-"
            }],
            "defaultValue": "+"
        },
        "setterComponentVModelName": "modelValue",
        "title": "字典排序",
        "setterComponentName": "ARadioGroup",
        "placeholder": "",
        "description": "依据字典表的seqNo字段进行排序"
    }, {
        "name": "displayType",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {
            "options": [{
                "label": "下拉单选",
                "__o4MjAffwf6JXJF09HC": "select",
                "value": "select"
            }, {"label": "展开单选", "__o4MjAffwf6JXJF09HC": "radio", "value": "radio"}, {"label": "展开复选",  "value": "checkbox"}]
        },
        "setterComponentVModelName": "modelValue",
        "title": "显示类型",
        "setterComponentName": "ARadioGroup",
        "setterDefaultValue": ""
    }, {
        "name": "showValueInLabel",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "显示值字段",
        "setterComponentName": "ASwitch"
    }, {
        "name": "size",
        "setterComponentProps": {
            "mode": "SECRET_COMBOBOX_MODE_DO_NOT_USE",
            "optionType": "button",
            "options": [{"label": "大", "value": "large", "__LlZ1Rnur2LSKVgPC2B": "large"}, {
                "label": "默认",
                "value": "medium",
                "__LlZ1Rnur2LSKVgPC2B": "medium"
            }, {"label": "小", "value": "small", "__LlZ1Rnur2LSKVgPC2B": "small"}, {
                "label": "迷你",
                "value": "mini",
                "__LlZ1Rnur2LSKVgPC2B": "mini"
            }],
            "defaultValue": "medium"
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "title": "大小",
        "setterComponentName": "ARadioGroup",
        "show": true,
        "expanded": true,
        "enableValueExpress": false
    }, {
        "name": "allowClear",
        "setterComponentProps": {"defaultChecked": false},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "title": "点击清除",
        "setterComponentName": "ASwitch",
        "show": true,
        "expanded": true
    }],
    "actions": [{"name": "onValueChange", "description": "", "title": "值改变"}],
    "displayOnStage": "inline-block"
}