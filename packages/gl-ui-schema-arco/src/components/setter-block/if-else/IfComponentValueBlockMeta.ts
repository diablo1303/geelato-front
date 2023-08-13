export default {
    "componentName": "GlIfComponentValueBlock",
    "displayMode": "tile",
    "iconType": "gl-if",
    "group": "block_condition",
    "title": "IF组件值",
    "useBy": ["freePage"],
    "blockContent": "如果组件${componentId}的值 ${relationship} ${compareValue}",
    "properties": [{
        "name": "mode",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {
            "type": "button",
            "options": [{"label": "如果IF", "value": "if"}, {
                "label": "否则如果ELES IF",
                "value": "else if"
            }]
        },
        "setterComponentVModelName": "modelValue",
        "title": "模式",
        "setterComponentName": "ARadioGroup",
        "setterDefaultValue": "if"
    }, {
        "name": "appId",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "应用",
        "setterComponentName": "AInput",
        "placeholder": "不填写表示当前应用",
        "enableValueExpress": false
    }, {
        "name": "extendId",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "页面",
        "setterComponentName": "GlPageSelect",
        "enableValueExpress": false
    }, {
        "name": "componentId",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "组件",
        "setterComponentName": "GlPageComponentSelect",
        "enableValueExpress": false
    }, {
        "name": "relationship",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {
            "options": [{"label": "等于(==)", "value": "=="}, {
                "label": "恒等于(===)",
                "value": "==="
            }, {"label": "不等于(!=)", "value": "!="}, {"label": "大于(>)", "value": ">"}, {
                "label": "大于等于(>=)",
                "value": ">="
            }, {"label": "小于(<)", "value": "<"}, {"label": "小于等于(<=)", "value": "<="}]
        },
        "setterComponentVModelName": "modelValue",
        "title": "比较关系",
        "setterComponentName": "ASelect"
    }, {
        "name": "compareValue",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "比较值",
        "setterComponentName": "GlCompareValueSetter",
        "enableValueExpress": true
    }],
    "actions": []
}