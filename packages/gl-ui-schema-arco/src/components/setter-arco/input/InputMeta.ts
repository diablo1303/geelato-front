export default {
    "componentName": "AInput",
    "displayMode": "Tile",
    "iconType": "gl-input",
    "group": "dataEntry",
    "title": "字符输入",
    "alias": "input",
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
        "name": "prefix",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "slots",
        "show": true,
        "expanded": true,
        "title": "前缀",
        "setterComponentName": "AInput",
        "slotComponentName": "GlText",
        "slotComponentBindTarget": "v-model",
        "enableValueExpress": true
    }, {
        "name": "suffix",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "slots",
        "show": true,
        "expanded": true,
        "title": "后缀",
        "setterComponentName": "AInput",
        "slotComponentName": "GlText",
        "slotComponentBindTarget": "v-model",
        "enableValueExpress": true
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
    }, {
        "name": "disabled",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "是否禁用状态，默认为 false",
        "title": "是否禁用",
        "setterComponentName": "ASwitch",
        "show": true,
        "expanded": true
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
        "name": "placeholder",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "占位提示",
        "setterComponentName": "AInput",
        "enableValueExpress": true
    }, {
        "name": "maxlength",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "title": "最大长度",
        "setterComponentName": "AInputNumber",
        "show": true,
        "expanded": true
    }, {
        "name": "showWordLimit",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "显示字数",
        "setterComponentName": "ASwitch"
    }, {
        "name": "rules",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "验证规则",
        "setterComponentName": "GlValidateRulesSetter"
    }],
    "actions": [{"name": "change", "description": "仅在输入框失焦或按下回车时触发", "title": "值改变"}],
    "displayOnStage": "inline-block"
}