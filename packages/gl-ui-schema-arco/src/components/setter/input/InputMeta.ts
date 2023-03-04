export default {
    "componentName": "AInput",
    "displayMode": "Tile",
    "iconType": "gl-input",
    "group": "dataEntry",
    "title": "字符输入",
    "useBy": ["freePage"],
    "properties": [{
        "name": "addonAfter",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "带标签的 input，设置后置标签",
        "title": "后置标签",
        "setterComponentName": "AInput"
    }, {
        "name": "addonBefore",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "带标签的 input，设置前置标签",
        "title": "前置标签",
        "setterComponentName": "AInput"
    }, {
        "name": "allowClear",
        "setterComponentProps": {},
        "setterComponentVModelName": "checked",
        "group": "base",
        "type": "props",
        "title": "点击清除",
        "setterComponentName": "ASwitch"
    }, {
        "name": "bordered",
        "setterComponentProps": {},
        "setterComponentVModelName": "checked",
        "group": "base",
        "type": "props",
        "description": "是否有边框",
        "setterComponentName": "ASwitch",
        "title": "边框"
    }, {
        "name": "defaultValue",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "输入框默认内容",
        "title": "默认内容",
        "setterComponentName": "AInput"
    }, {
        "name": "disabled",
        "setterComponentProps": {},
        "setterComponentVModelName": "checked",
        "group": "base",
        "type": "props",
        "description": "是否禁用状态，默认为 false",
        "title": "是否禁用",
        "setterComponentName": "ASwitch"
    }, {
        "name": "maxlength",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "title": "最大长度",
        "setterComponentName": "AInputNumber"
    }, {
        "name": "prefix",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "带有前缀图标的 input",
        "title": "前缀图标",
        "setterComponentName": "AInput"
    }, {
        "name": "showCount",
        "setterComponentProps": {},
        "setterComponentVModelName": "checked",
        "group": "base",
        "type": "props",
        "description": "是否展示字数",
        "title": "展示字数",
        "setterComponentName": "ASwitch"
    }, {
        "name": "size",
        "setterComponentProps": {
            "mode": "SECRET_COMBOBOX_MODE_DO_NOT_USE",
            "optionType": "button",
            "options": [{"label": "large", "value": "large"}, {
                "label": "default",
                "value": "default"
            }, {"label": "small", "value": "small"}],
            "defaultValue": "default"
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "title": "控件大小",
        "setterComponentName": "ARadioGroup"
    }, {
        "name": "suffix",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "带有后缀图标的 input",
        "title": "后缀图标",
        "setterComponentName": "AInput"
    }],
    "diplayMode": "Tile"
}