export default {
    "componentName": "ADatePicker",
    "displayMode": "tile",
    "iconType": "gl-datePicker",
    "group": "dataEntry",
    "title": "日期选择",
    "alias": "date",
    "useBy": ["freePage"],
    "properties": [
        {
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
            "name": "showTime",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "title": "显示时间",
            "placeholder": "日期是否带明细时间",
            "setterComponentName": "ASwitch"
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
    "actions": [{"name": "onValueChange", "description": "", "title": "值改变"}]
}