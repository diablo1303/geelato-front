export default {
    "componentName": "GlMultiComponents",
    "displayMode": "tile",
    "iconType": "gl-component",
    "group": "dataEntry",
    "title": "多组件",
    "alias": "multiCom",
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
        "setterComponentName": "GlEntityFieldSelect"
    }, {
        "name": "items",
        "setterComponentProps": {},
        "setterComponentVModelName": "",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "多组件",
        "setterComponentName": "GlObjectArraySetter",
        "enableValueExpress": false,
        "_showSub": false,
        "properties": [{
            "name": "inst",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "setterComponentName": "GlComponentSelect",
            "title": "单组件"
        }, {
            "name": "showInTag",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "显示",
            "description": "在标签中是否显示",
            "setterComponentName": "ASwitch",
            "setterDefaultValue": true
        }],
        "titleField": "inst.props.label"
    }, {
        "name": "tagSize",
        "setterComponentProps": {
            "mode": "SECRET_COMBOBOX_MODE_DO_NOT_USE",
            "optionType": "button",
            "options": [{"label": "大", "value": "large", "__r5FEZX7xWjGzl3nTe2": "large"}, {
                "label": "默认",
                "value": "medium",
                "__r5FEZX7xWjGzl3nTe2": "medium"
            }, {"label": "小", "value": "small", "__r5FEZX7xWjGzl3nTe2": "small"}, {
                "label": "迷你",
                "value": "mini",
                "__r5FEZX7xWjGzl3nTe2": "mini"
            }],
            "defaultValue": "medium"
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "title": "标签大小",
        "setterComponentName": "ARadioGroup",
        "show": true,
        "expanded": true,
        "enableValueExpress": false
    }, {
        "name": "tagColor",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {
            "options": [{
                "label": "red",
                "value": "red",
                "__3MGPrf64VVPqFtiw6k": "red"
            }, {"label": "orangered", "value": "orangered", "__3MGPrf64VVPqFtiw6k": "orangered"}, {
                "label": "orange",
                "value": "orange",
                "__3MGPrf64VVPqFtiw6k": "orange"
            }, {"label": "gold", "value": "gold", "__3MGPrf64VVPqFtiw6k": "gold"}, {
                "label": "lime",
                "value": "lime",
                "__3MGPrf64VVPqFtiw6k": "lime"
            }, {"label": "green", "value": "green", "__3MGPrf64VVPqFtiw6k": "green"}, {
                "label": "cyan",
                "value": "cyan",
                "__3MGPrf64VVPqFtiw6k": "cyan"
            }, {"label": "blue", "value": "blue", "__3MGPrf64VVPqFtiw6k": "blue"}, {
                "label": "arcoblue",
                "value": "arcoblue",
                "__3MGPrf64VVPqFtiw6k": "arcoblue"
            }, {"label": "purple", "value": "purple", "__3MGPrf64VVPqFtiw6k": "purple"}, {
                "label": "pinkpurple",
                "value": "pinkpurple",
                "__3MGPrf64VVPqFtiw6k": "pinkpurple"
            }, {"label": "magenta", "value": "magenta", "__3MGPrf64VVPqFtiw6k": "magenta"}, {
                "label": "gray",
                "value": "gray",
                "__3MGPrf64VVPqFtiw6k": "gray"
            }]
        },
        "setterComponentVModelName": "modelValue",
        "setterComponentName": "ASelect",
        "title": "标签颜色"
    }, {
        "name": "jointMark",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "连接符",
        "description": "标签中各项属性值的连接符，默认为“-”",
        "setterComponentName": "AInput"
    }, {
        "name": "extraComponent",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "后附组件",
        "setterComponentName": "GlComponentSelect",
        "enableValueExpress": false,
        "description": "跟随在后面的组件，如可以为一个按钮，用于配置点击事件"
    }],
    "actions": [{"name": "valueChange", "description": "仅在输入框失焦或按下回车时触发", "title": "值改变"}],
    "displayOnStage": "inline-block"
}