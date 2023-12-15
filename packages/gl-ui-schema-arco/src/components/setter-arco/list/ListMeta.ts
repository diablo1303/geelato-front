export default {
  "componentName": "GlList",
  "displayMode": "tile",
  "iconType": "gl-list",
  "group": "dataDisplay",
  "title": "列表",
  "alias": "list",
  "useBy": ["freePage"],
  "properties": [{
    "expanded": true,
    "name": "label",
    "title": "标题",
    "group": "base",
    "placeholder": "",
    "description": "标题",
    "setterComponentName": "AInput",
    "setterComponentVModelName": "modelValue",
    "setterComponentProps": {},
    "type": "props",
    "show": true,
    "_showSub": false,
    "enableValueExpress": false,
    "displayMode": "tile"
  }, {
    "name": "size",
    "group": "base",
    "type": "props",
    "enableValueExpress": false,
    "show": true,
    "expanded": true,
    "displayMode": "tile",
    "setterComponentProps": {
      "options": [{"label": "小", "__Y1UFFOZa65GbrRqn2S": "small", "value": "small"}, {
        "label": "中",
        "__Y1UFFOZa65GbrRqn2S": "medium",
        "value": "medium"
      }, {"label": "大", "__Y1UFFOZa65GbrRqn2S": "large", "value": "large"}], "multiple": false, "allowClear": false
    },
    "setterComponentVModelName": "modelValue",
    "title": "列表大小",
    "setterComponentName": "ASelect",
    "setterDefaultValue": ""
  }, {
    "name": "bordered",
    "group": "base",
    "type": "props",
    "enableValueExpress": false,
    "show": true,
    "expanded": true,
    "displayMode": "tile",
    "setterComponentProps": {"checkedText": "否", "uncheckedText": "是"},
    "setterComponentVModelName": "modelValue",
    "title": "是否显示边框",
    "setterComponentName": "ASwitch",
    "setterDefaultValue": false
  }, {
    "name": "split",
    "group": "base",
    "type": "props",
    "enableValueExpress": false,
    "show": true,
    "expanded": true,
    "displayMode": "tile",
    "setterComponentProps": {"uncheckedText": "是", "checkedText": "否"},
    "setterComponentVModelName": "modelValue",
    "title": "是否显示分割线",
    "setterComponentName": "ASwitch"
  }, {
    "name": "maxHeight",
    "group": "base",
    "type": "props",
    "enableValueExpress": false,
    "show": true,
    "expanded": true,
    "displayMode": "tile",
    "setterComponentProps": {},
    "setterComponentVModelName": "modelValue",
    "_showSub": false,
    "title": "列表的最大高度",
    "setterComponentName": "AInputNumber"
  }, {
    "name": "entityReader",
    "group": "base",
    "type": "props",
    "enableValueExpress": false,
    "show": true,
    "expanded": true,
    "setterComponentProps": {
      "options": [{"label": "标题", "value": "title", "__E75ekDE9sgE0hlbrMV": "title"}, {
        "label": "描述",
        "value": "description",
        "__E75ekDE9sgE0hlbrMV": "description"
      }, {"label": "图标", "value": "icon", "__E75ekDE9sgE0hlbrMV": "icon"}]
    },
    "setterComponentVModelName": "modelValue",
    "title": "数据实体",
    "setterComponentName": "GlEntityReaderSetter",
    "description": "树数据实体",
    "displayMode": "tile",
    "_showSub": false
  }, {
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
    "_showSub": false,
    "enableValueExpress": false,
    "displayMode": "tile"
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
  }],
  "actions": [{"name": "click", "title": "点击"}, {"name": "reachBottom", "title": "当列表到达底部时触发"}, {
    "eventName": "onMounted",
    "name": "onMounted",
    "description": "组件加载完时触发，和Vue的onMounted一致",
    "title": "加载完"
  }, {"eventName": "onUpdated", "name": "onUpdated", "description": "组件更新时触发，和Vue的onUpdated一致", "title": "更新完"}, {
    "eventName": "onMounted",
    "name": "onMounted",
    "description": "组件加载完时触发，和Vue的onMounted一致",
    "title": "加载完"
  }, {"eventName": "onUpdated", "name": "onUpdated", "description": "组件更新时触发，和Vue的onUpdated一致", "title": "更新完"}]
}