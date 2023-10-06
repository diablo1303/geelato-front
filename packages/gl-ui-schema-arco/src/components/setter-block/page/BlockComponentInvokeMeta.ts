export default {
    "componentName": "GlComponentInvokeBlock",
    "displayMode": "tile",
    "iconType": "gl-api",
    "group": "block_page",
    "title": "调用组件方法",
    "useBy": ["freePage"],
    "blockContent": "调用组件：${componentId}，方法：${methodName}，结果存到变量:${resultVar}",
    "properties": [{
        "name": "appId",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "应用ID",
        "setterComponentName": "AInput",
        "placeholder": "不填写表示当前应用"
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
        "title": "调用的组件",
        "setterComponentName": "GlPageComponentSelect",
        "enableValueExpress": false
    }, {
        "name": "methodName",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "调用的方法",
        "setterComponentName": "GlComponentMethodSelect",
        "enableValueExpress": false
    }, {
        "name": "params",
        "setterComponentProps": {},
        "setterComponentVModelName": "",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "方法参数",
        "_showSub": true,
        "properties": [{
            "name": "name",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "参数名",
            "setterComponentName": "AInput"
        }, {
            "name": "valueExpression",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "setterComponentProps": {"showInput": true},
            "setterComponentVModelName": "modelValue",
            "title": "参数值",
            "setterComponentName": "GlExpressionSetter"
        }],
        "setterComponentName": "GlObjectArraySetter",
        "titleField": "name"
    }, {
        "name": "resultVar",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "结果变量",
        "setterComponentName": "AInput",
        "enableValueExpress": false,
        "placeholder": "方法调用返回存储的变量"
    }, {
        "name": "enableReturn",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "返回结果",
        "setterComponentName": "ASwitch",
        "enableValueExpress": false,
        "description": "返回该方法的调用执行结果，启用则在方法调用前添加return"
    }, {
        "name": "enableAwait",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "同步调用",
        "setterComponentName": "ASwitch",
        "enableValueExpress": false,
        "description": "是否同步调用该方法，对于自身为异步的方法有效，如服务端请求，启用则在方法调用前加await"
    }],
    "actions": []
}