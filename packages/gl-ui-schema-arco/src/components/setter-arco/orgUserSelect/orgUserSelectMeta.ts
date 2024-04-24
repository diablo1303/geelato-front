export default {
  "componentName": "GlOrgUserSelect",
  "displayMode": "tile",
  "iconType": "gl-user",
  "group": "dataEntry",
  "title": "组织人员选择",
  "alias": "org-user-select",
  "useBy": [
    "freePage"
  ],
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
    },
    {
      "name": "bindField",
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "group": "base",
      "type": "props",
      "show": true,
      "expanded": true,
      "title": "绑定字段",
      "setterComponentName": "GlEntityFieldSelect",
      "_showSub": false,
      "enableValueExpress": false,
      "displayMode": "tile"
    },
    {
      "name": "nameFieldBindComponentId",
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "group": "base",
      "type": "props",
      "show": true,
      "expanded": true,
      "title": "名称组件",
      "setterComponentName": "AInput",
      "description": "人员选择时，人员id绑定到本组件，人员名称需绑定到另一个组件，在此设置目标组件的唯一标识。",
      "placeholder": "名称组件的唯一标识",
      "enableValueExpress": false,
      "displayMode": "tile"
    },
    {
      "name": "_valueExpression",
      "setterComponentProps": {
        "showInput": true
      },
      "setterComponentVModelName": "modelValue",
      "group": "base",
      "type": "props",
      "show": true,
      "expanded": true,
      "title": "默认值",
      "setterComponentName": "AInput",
      "enableValueExpress": true,
      "description": "基于表达式计算默认值"
    },
    {
      "name": "maxCount",
      "group": "base",
      "type": "props",
      "enableValueExpress": false,
      "show": true,
      "expanded": true,
      "displayMode": "tile",
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "_showSub": false,
      "title": "取值数量",
      "setterComponentName": "AInputNumber",
      "setterDefaultValue": 0,
      "properties": []
    },
    {
      "name": "rootOrgId",
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "group": "base",
      "type": "props",
      "enableValueExpress": false,
      "show": true,
      "expanded": true,
      "displayMode": "tile",
      "placeholder": "输入组织ID，展示组织及子组织",
      "title": "根组织",
      "setterComponentName": "GlOrgSelect"
    },
    {
      "name": "onlySelect",
      "group": "base",
      "type": "props",
      "enableValueExpress": false,
      "show": true,
      "expanded": true,
      "displayMode": "tile",
      "setterComponentProps": {
        "checkedText": "仅选择",
        "uncheckedText": "手动输入"
      },
      "setterComponentVModelName": "modelValue",
      "title": "可输入",
      "setterComponentName": "ASwitch",
      "setterDefaultValue": true
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
  ],
  "actions": [
    {
      "name": "onValueChange",
      "description": "",
      "title": "值改变"
    },
    {
      "eventName": "onMounted",
      "name": "onMounted",
      "description": "组件加载完时触发，和Vue的onMounted一致",
      "title": "加载完"
    },
    {
      "eventName": "onUpdated",
      "name": "onUpdated",
      "description": "组件更新时触发，和Vue的onUpdated一致",
      "title": "更新完"
    },
    {
      "eventName": "onMounted",
      "name": "onMounted",
      "description": "组件加载完时触发，和Vue的onMounted一致",
      "title": "加载完"
    },
    {
      "eventName": "onUpdated",
      "name": "onUpdated",
      "description": "组件更新时触发，和Vue的onUpdated一致",
      "title": "更新完"
    },
    {
      "eventName": "onMounted",
      "name": "onMounted",
      "description": "组件加载完时触发，和Vue的onMounted一致",
      "title": "加载完"
    },
    {
      "eventName": "onUpdated",
      "name": "onUpdated",
      "description": "组件更新时触发，和Vue的onUpdated一致",
      "title": "更新完"
    }
  ],
  "methods": [
    {
      "async": false,
      "name": "_reRender",
      "title": "重新渲染组件",
      "description": "重新渲染组件，基于nextTick。",
      "params": []
    },
    {
      "async": false,
      "name": "_reRender",
      "title": "重新渲染组件",
      "description": "重新渲染组件，基于nextTick。",
      "params": []
    }
  ]
}