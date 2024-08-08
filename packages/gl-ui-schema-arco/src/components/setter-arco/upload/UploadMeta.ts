export default {
  "componentName": "GlUpload",
  "displayMode": "tile",
  "iconType": "gl-upload",
  "group": "dataEntry",
  "title": "上传",
  "alias": "upload",
  "useBy": ["freePage"],
  "properties": [
    {
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
    },
    {
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
      "enableValueExpress": false
    },
    {
      "name": "acceptArray",
      "group": "base",
      "type": "props",
      "enableValueExpress": true,
      "show": true,
      "expanded": true,
      "setterComponentProps": {
        "multiple": true,
        "options": [
          {
            "label": "办公文档",
            "__XUTvPkyOYDLpO5f8xh": ".pdf,.doc,.docx,xls,xlsx",
            "value": ".pdf,.doc,.docx,xls,xlsx"
          },
          {
            "label": "图片类型",
            "__XUTvPkyOYDLpO5f8xh": "image/*",
            "value": "image/*"
          },
          {
            "label": "压缩包",
            "__XUTvPkyOYDLpO5f8xh": ".zip,.rar,.7z,.gz,.tar,.tgz,.bz2,.Z",
            "value": ".zip,.rar,.7z,.gz,.tar,.tgz,.bz2,.Z"
          },
          {
            "label": "视频",
            "__XUTvPkyOYDLpO5f8xh": "video/*",
            "value": "video/*"
          },
          {
            "label": "音频",
            "__XUTvPkyOYDLpO5f8xh": "audio/*",
            "value": "audio/*"
          }
        ]
      },
      "setterComponentVModelName": "modelValue",
      "title": "文件类型",
      "setterComponentName": "ASelect",
      "setterDefaultValue": ""
    },
    {
      "name": "limit",
      "group": "base",
      "type": "props",
      "enableValueExpress": true,
      "show": true,
      "expanded": true,
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "description": "限制上传文件的数量。0表示不限制",
      "title": "上传数量",
      "setterDefaultValue": 1,
      "setterComponentName": "AInputNumber"
    },
    {
      "name": "tableType",
      "setterComponentProps": {
        "options": [
          {
            "label": "附件（仅当前环境使用）",
            "__HiLwWYFk2gkBqbArxF": "attach",
            "value": "attach"
          },
          {
            "label": "资源（会打包进版本包）",
            "__HiLwWYFk2gkBqbArxF": "resources",
            "value": "resources"
          }
        ],
        "allowClear": true
      },
      "setterComponentVModelName": "modelValue",
      "group": "base",
      "type": "props",
      "enableValueExpress": false,
      "show": true,
      "expanded": true,
      "displayMode": "tile",
      "title": "归属类型",
      "placeholder": "默认归属“附件”",
      "setterComponentName": "ASelect",
      "setterDefaultValue": "attach"
    },
    {
      "name": "genre",
      "group": "base",
      "type": "props",
      "enableValueExpress": false,
      "show": true,
      "expanded": true,
      "displayMode": "tile",
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "title": "标记",
      "placeholder": "用于分类、查询",
      "setterComponentName": "AInput"
    },
    {
      "name": "multiple",
      "group": "base",
      "type": "props",
      "enableValueExpress": true,
      "show": true,
      "expanded": true,
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "description": "是否支持同时选择多文件上传",
      "title": "选择多个",
      "setterComponentName": "ASwitch"
    },
    {
      "name": "draggable",
      "group": "base",
      "type": "props",
      "enableValueExpress": true,
      "show": true,
      "expanded": true,
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "title": "拖拽上传",
      "description": "是否支持拖拽上传",
      "setterComponentName": "ASwitch"
    },
    {
      "name": "tip",
      "group": "base",
      "type": "props",
      "enableValueExpress": true,
      "show": true,
      "expanded": true,
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "title": "提示文字",
      "setterComponentName": "AInput"
    },
    {
      "name": "showFileList",
      "group": "base",
      "type": "props",
      "enableValueExpress": true,
      "show": false,
      "expanded": true,
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "description": "是否显示文件列表",
      "title": "显示列表",
      "setterComponentName": "ASwitch",
      "setterDefaultValue": true
    },
    {
      "name": "listType",
      "group": "base",
      "type": "props",
      "enableValueExpress": true,
      "show": true,
      "expanded": true,
      "setterComponentProps": {
        "options": [
          {"label": "text", "__3FZbPFjO1B5CDK7t2A": "text", "value": "text"},
          {
            "label": "picture",
            "__3FZbPFjO1B5CDK7t2A": "picture",
            "value": "picture"
          },
          {
            "label": "picture-card",
            "__3FZbPFjO1B5CDK7t2A": "picture-card",
            "value": "picture-card"
          }
        ]
      },
      "setterComponentVModelName": "modelValue",
      "title": "列表类型",
      "setterComponentName": "ASelect"
    },
    {
      "name": "showPreviewButton",
      "group": "base",
      "type": "props",
      "enableValueExpress": true,
      "show": true,
      "expanded": true,
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "description": "照片墙是否显示预览按钮",
      "title": "预览按钮",
      "setterComponentName": "ASwitch"
    },
    {
      "name": "showRemoveButton",
      "group": "base",
      "type": "props",
      "enableValueExpress": true,
      "show": true,
      "expanded": true,
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "description": "是否显示删除按钮",
      "title": "显示删除",
      "setterComponentName": "ASwitch"
    },
    {
      "name": "imagePreview",
      "group": "base",
      "type": "props",
      "enableValueExpress": true,
      "show": true,
      "expanded": true,
      "setterComponentProps": {},
      "setterComponentVModelName": "modelValue",
      "description": "是否使用 ImagePreview 组件进行预览",
      "title": "预览图片",
      "setterComponentName": "ASwitch"
    },
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
      "eventName": "mounted",
      "name": "mounted",
      "description": "组件加载完时触发，和Vue的onMounted一致",
      "title": "加载完"
    },
    {
      "eventName": "updated",
      "name": "updated",
      "description": "组件更新时触发，和Vue的onUpdated一致",
      "title": "更新完"
    }
  ],
  "methods": [
    {
      "async": false,
      "name": "_getValue",
      "title": "获取组件值",
      "description": "获取通过_getValue获取组件的值",
      "params": [],
      "returnInfo": {
        "returnType": "any",
        "description": "获取通过_getValue获取组件的值。"
      }
    },
    {
      "async": false,
      "name": "_setValue",
      "title": "设置组件值",
      "description": "设置组件值",
      "params": [
        {
          "name": "value",
          "type": "string",
          "title": "变量名",
          "required": true,
          "description": ""
        }
      ],
      "returnInfo": {"returnType": "void", "description": "设置组件值。"}
    },
    {
      "async": false,
      "name": "_reRender",
      "title": "重新渲染组件",
      "description": "重新渲染组件，基于nextTick。",
      "params": [],
      "returnInfo": {
        "returnType": "void",
        "description": "重新渲染组件，注意对于组件外部传入的参数并不会重新计算，因为它们不属于本组件的内容，若需重新计算，需重新渲染组件该组件的上一层组件。例如：本组件为页面组件A，在属性面板中设置了参数form.id值为另一个列表的当前选中值，若需要本组件的页面依据列表的当前当中值变化，则需要调用页面组件A的上一级组件进行重新渲染。"
      }
    },
    {
      "async": false,
      "name": "_setVar",
      "title": "设置组件变量",
      "description": "设置组件的临时变量，在组件刷新时或_reRender时会丢失",
      "params": [
        {
          "name": "name",
          "type": "string",
          "title": "变量名",
          "required": true,
          "description": ""
        },
        {
          "name": "value",
          "type": "any",
          "title": "变量值",
          "required": true,
          "description": ""
        }
      ],
      "returnInfo": {
        "returnType": "void",
        "description": "设置组件的临时变量，在组件刷新时或_reRender时会丢失。"
      }
    },
    {
      "async": false,
      "name": "_getVar",
      "title": "获取组件变量",
      "description": "获取通过_setVar设置的组件临时变量值",
      "params": [
        {
          "name": "name",
          "type": "string",
          "title": "变量名",
          "required": true,
          "description": ""
        }
      ],
      "returnInfo": {
        "returnType": "any",
        "description": "获取通过_setVar设置的组件临时变量值。"
      }
    },
    {
      "async": false,
      "name": "_setReadonlyAndDisabled",
      "title": "设置组件只读和禁用",
      "description": "设置组件只读和禁用",
      "params": [
        {
          "name": "readonly",
          "type": "boolean",
          "title": "只读",
          "required": false,
          "description": "只能填写布尔值true或false，其它值无效"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "title": "禁用",
          "required": false,
          "description": "只能填写布尔值true或false，其它值无效"
        }
      ],
      "returnInfo": {
        "returnType": "void",
        "description": "设置组件只读和禁用，可以只设置只读为true，不设置禁用，也可以只读和禁用一起设置。"
      }
    }
  ]
}
