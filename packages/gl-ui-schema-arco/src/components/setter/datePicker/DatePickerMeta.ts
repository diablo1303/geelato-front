export default {
    "componentName": "ADatePicker",
    "displayMode": "Tile",
    "iconType": "gl-datePicker",
    "group": "dataEntry",
    "title": "日期选择",
    "useBy": ["freePage"],
    "properties": [{
        "name": "bindField",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "绑定字段",
        "setterComponentName": "GlFieldSelect"
    }, {
        "name": "allowClear",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "允许清除",
        "placeholder": "是否允许清除",
        "setterComponentName": "ASwitch"
    }, {
        "name": "size",
        "setterComponentProps": {
            "options": [{"label": "迷你", "value": "mini"}, {
                "label": "小",
                "value": "small"
            }, {"label": "中", "value": "medium"}, {"label": "大", "value": "large"}], "type": "radio"
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "placeholder": "日期选择器的尺寸",
        "title": "尺寸",
        "setterComponentName": "ARadioGroup"
    }],
    "actions": []
}