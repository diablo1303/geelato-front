export default {
  "componentName": "GlTinymce",
  "displayMode": "tile",
  "iconType": "gl-form",
  "group": "dataDisplay",
  "title": "富文本",
  "alias": "tinymce",
  "useBy": ["freePage"],
  "properties": [
    {
      "name": "height",
      "group": "base",
      "type": "props",
      "enableValueExpress": false,
      "show": true,
      "expanded": true,
      "displayMode": "tile",
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "title": "高度",
      "setterComponentName": "AInput",
      "setterDefaultValue": "320px"
    },
    {
      "name": "menubar",
      "group": "base",
      "type": "props",
      "enableValueExpress": false,
      "show": true,
      "expanded": true,
      "displayMode": "tile",
      "setterComponentProps": {
        "uncheckedText": "禁用",
        "checkedText": "启用"
      },
      "setterComponentVModelName": "modelValue",
      "title": "菜单栏",
      "setterComponentName": "ASwitch"
    },
    {
      "name": "resize",
      "group": "base",
      "type": "props",
      "enableValueExpress": false,
      "show": true,
      "expanded": true,
      "displayMode": "tile",
      "setterComponentProps": {
        "checkedText": "启用",
        "uncheckedText": "禁用"
      },
      "setterComponentVModelName": "modelValue",
      "title": "调整大小",
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
      "expanded": true,
      "enableValueExpress": false,
      "displayMode": "tile",
      "_showSub": false
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
    }
  ],
  "actions": [
    {"name": "click", "title": "点击"},
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
  ]
}
