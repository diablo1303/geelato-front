export default {
    "componentName": "AButton",
    "displayMode": "Tile",
    "iconType": "gl-button",
    "group": "dataDisplay",
    "title": "按钮",
    "alias": "btn",
    "useBy": ["freePage"],
    "properties": [{
        "expanded": true,
        "style": "",
        "name": "type",
        "title": "类型",
        "group": "base",
        "placeholder": "",
        "description": "类型",
        "setterComponentName": "ASelect",
        "setterComponentVModelName": "modelValue",
        "setterComponentProps": {
            "options": [{"label": "主要", "value": "primary"}, {
                "label": "次要",
                "value": "secondary"
            }, {"label": "虚框", "value": "outline"}, {
                "label": "线性",
                "value": "dashed"
            }, {"label": "文字", "value": "text"}], "type": "button"
        },
        "type": "props",
        "show": true
    },{
        "type": "slots",
        "expanded": true,
        "style": "",
        "name": "icon",
        "title": "图标文字",
        "group": "base",
        "placeholder": "",
        "description": "",
        "setterComponentName": "GlIconfontTextSetter",
        "setterComponentVModelName": "modelValue",
        "setterComponentProps": {},
        "show": true,
        "slotComponentName": "GlIconfont",
        "slotComponentBindTarget": "v-bind"
    }, {
        "name": "shape",
        "setterComponentProps": {
            "options": [{"label": "默认", "value": "default"}, {
                "label": "圆形",
                "value": "circle"
            }, {"label": "圆角", "value": "round"}]
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "设置按钮形状",
        "title": "形状",
        "setterComponentName": "ARadioGroup",
        "placeholder": "",
        "show": true,
        "expanded": true
    }, {
        "name": "status",
        "setterComponentProps": {
            "options": [{"label": "正常（默认）", "value": "normal"}, {
                "label": "成功",
                "value": "success"
            }, {"label": "警告", "value": "warning"}, {"label": "危险", "value": "danger"}]
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "状态",
        "setterComponentName": "ASelect"
    }, {
        "expanded": true,
        "style": "",
        "name": "size",
        "title": "按钮大小",
        "group": "base",
        "placeholder": "",
        "description": "按钮大小",
        "setterComponentName": "ARadioGroup",
        "setterComponentVModelName": "modelValue",
        "setterComponentProps": {
            "options": [{"label": "大", "value": "large"}, {
                "label": "中",
                "value": "medium"
            }, {"label": "小", "value": "small"}, {"label": "极小", "value": "mini"}],
            "type": "radio"
        },
        "type": "props",
        "show": true
    }, {
        "name": "long",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "description": "按钮的宽度是否随容器自适应",
        "title": "宽度自适应",
        "setterComponentName": "ASwitch"
    }, {
        "name": "loading",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "description": "按钮是否为加载中状态",
        "title": "加载状态",
        "setterComponentName": "ASwitch"
    },  {
        "expanded": true,
        "style": "",
        "name": "disabled",
        "title": "是否失效",
        "group": "base",
        "placeholder": "",
        "description": "按钮失效状态",
        "setterComponentName": "ASwitch",
        "setterComponentVModelName": "modelValue",
        "setterComponentProps": {},
        "type": "props",
        "show": true
    }, {
        "name": "href",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "设置跳转链接。设置此属性时，按钮渲染为a标签。",
        "setterComponentName": "AInput",
        "title": "链接",
        "show": true,
        "expanded": true
    }],
    "actions": [
        {
            "name": "click",
            "title": "点击"
        }
    ]
}