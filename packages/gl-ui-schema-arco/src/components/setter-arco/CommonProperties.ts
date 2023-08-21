export const commonPropsDataEntry = [
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
        "description": "基于表达式计算默认值"
    }, {
        "name": "_labelColFlex",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "标题宽度",
        "setterComponentName": "AInput",
        "description": "标题的宽度，默认的标题占比20%（精确值应为20.83%，这里需填整数去掉.83）",
        "placeholder": "如：6% 或 100px"
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
        "name": "description",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "描述",
        "setterComponentName": "AInput",
        "enableValueExpress": true
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
        "setterComponentName": "ASwitch",
        "enableValueExpress": true
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
        "expanded": true,
        "enableValueExpress": true
    }, {
        "name": "_hidden",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "隐藏",
        "description": "页面中存在该组件，只是不可见",
        "setterComponentName": "ASwitch",
        "enableValueExpress": true
    }, {
        "name": "unRender",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "不渲染",
        "description": "页面中不存在该组件，不渲染，不可见，一般是为了提高性能在一些场景下不渲染。",
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

export const commonPropsOther = [{
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
    "name": "_hidden",
    "setterComponentProps": {},
    "setterComponentVModelName": "modelValue",
    "group": "base",
    "type": "props",
    "show": true,
    "expanded": true,
    "title": "隐藏",
    "description": "页面中存在该组件，只是不可见",
    "setterComponentName": "ASwitch",
    "enableValueExpress": true
}, {
    "name": "unRender",
    "setterComponentProps": {},
    "setterComponentVModelName": "modelValue",
    "group": "base",
    "type": "props",
    "show": true,
    "expanded": true,
    "title": "不渲染",
    "description": "页面中不存在该组件，不渲染，不可见，一般是为了提高性能在一些场景下不渲染。",
    "setterComponentName": "ASwitch",
    "enableValueExpress": true
}]

export const commonActions = [
    {
        "eventName": "refresh",
        "name": "refresh",
        "description": "组件加载完时触发，和Vue的onMounted一致",
        "title": "加载完"
    },
    {
        "eventName": "onUpdated",
        "name": "onUpdated",
        "description": "组件更新时触发，和Vue的onUpdated一致",
        "title": "更新完"
    }
]