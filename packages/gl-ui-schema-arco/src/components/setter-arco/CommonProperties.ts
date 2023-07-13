export default [
    {
        "name": "_valueExpression",
        "setterComponentProps": {"showInput": true},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "默认值",
        "setterComponentName": "AInput",
        "enableValueExpress": true,
        // "setterComponentName": "GlExpressionSetter",
        "description": "基于表达式计算默认值"
    },
    {
        "name": "readonly",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "只读",
        "setterComponentName": "ASwitch"
    },
    {
        "name": "disabled",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "description": "是否禁用状态，默认为 false",
        "title": "禁用",
        "setterComponentName": "ASwitch",
        "show": true,
        "expanded": true
    }, {
        "name": "unRender",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "不渲染",
        "setterComponentName": "ASwitch",
        "enableValueExpress": true
    },
    {
        "name": "rules",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "验证规则",
        "setterComponentName": "GlValidateRulesSetter"
    }

]