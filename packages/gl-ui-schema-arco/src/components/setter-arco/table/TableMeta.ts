export default {
    "componentName": "GlEntityTablePlus",
    "displayMode": "collapse",
    "iconType": "gl-table",
    "group": "dataDisplay",
    "title": "表格",
    "useBy": ["freePage"],
    "alias": "table",
    "properties": [{
        "name": "base",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "",
        "_showSub": false,
        "properties": [{
            "name": "tableTitle",
            "group": "base",
            "type": "props",
            "enableValueExpress": true,
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "_showSub": false,
            "title": "标题",
            "setterComponentName": "AInput"
        }, {
            "name": "entityName",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "绑定数据源",
            "setterComponentName": "GlEntitySelect"
        }, {
            "name": "showQuery",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "setterComponentProps": {"defaultChecked": true},
            "setterComponentVModelName": "modelValue",
            "title": "显示查询",
            "setterComponentName": "ASwitch"
        }, {
            "name": "showPagination",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "显示分页",
            "setterComponentName": "ASwitch"
        }, {
            "name": "showToolbar",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "setterComponentProps": {"defaultChecked": true},
            "setterComponentVModelName": "modelValue",
            "title": "显示工具条",
            "setterComponentName": "ASwitch"
        }, {
            "name": "tablePadding",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "title": "外框间距",
            "setterComponentName": "AInput",
            "placeholder": "如：0px、8px"
        }, {
            "name": "enableEdit",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "title": "启用表格编辑",
            "setterComponentName": "ASwitch"
        }, {
            "name": "showSeqNo",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": false,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "显示序号",
            "setterComponentName": "ASwitch"
        }, {
            "name": "leftFixedCount",
            "setterComponentProps": {
                "options": [{
                    "label": "0",
                    "value": "0",
                    "__G12mDt0WMK0DpquHK1": "0"
                }, {"label": "1", "value": "1", "__G12mDt0WMK0DpquHK1": "1"}, {
                    "label": "2",
                    "value": "2",
                    "__G12mDt0WMK0DpquHK1": "2"
                }, {"label": "3", "value": "3", "__G12mDt0WMK0DpquHK1": "3"}], "type": "button"
            },
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": false,
            "expanded": true,
            "title": "左侧冻结列数",
            "setterComponentName": "ARadioGroup"
        }, {
            "name": "checkType",
            "setterComponentProps": {
                "type": "button",
                "options": [{"label": "无", "value": "null", "__xJvT8pskAbMdRLoi7C": "null"}, {
                    "label": "单选",
                    "value": "radio",
                    "__xJvT8pskAbMdRLoi7C": "radio"
                }, {"label": "复选", "value": "checkbox", "__xJvT8pskAbMdRLoi7C": "checkbox"}]
            },
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "title": "选择类型",
            "setterComponentName": "ARadioGroup"
        }, {
            "name": "showCheckAll",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "显示全选",
            "setterComponentName": "ASwitch",
            "description": "该属性在选择类型为复选时有效"
        }],
        "title": "基本设置",
        "setterComponentName": "GlSimpleObjectSetter"
    }, {
        "name": "query",
        "setterComponentProps": {},
        "setterComponentVModelName": "",
        "group": "base",
        "type": "props",
        "title": "查询条件",
        "_showSub": false,
        "properties": [{
            "name": "name",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "setterComponentName": "GlFieldSelect",
            "title": "绑定字段",
            "show": true,
            "expanded": true
        }, {
            "name": "title",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "title": "标题",
            "setterComponentName": "AInput"
        }, {
            "name": "cop",
            "setterComponentProps": {
                "mode": "SECRET_COMBOBOX_MODE_DO_NOT_USE",
                "options": [{"label": "等于", "value": "eq"}, {"label": "不等于", "value": "neq"}, {
                    "label": "小于",
                    "value": "lt"
                }, {"label": "小于等于", "value": "lte"}, {"label": "大于", "value": "gt"}, {
                    "label": "大于等于",
                    "value": "gte"
                }, {"label": "开头包括", "value": "sw"}, {"label": "结尾包括", "value": "ew"}, {
                    "label": "包括",
                    "value": "contains"
                }],
                "buttonStyle": "solid"
            },
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "title": "操作",
            "setterComponentName": "ASelect",
            "show": true,
            "expanded": true
        }, {
            "name": "colspan",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "setterComponentName": "AInputNumber",
            "title": "列间距",
            "show": true,
            "expanded": true
        }, {
            "name": "isAdvanceQuery",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "title": "高级查询",
            "expanded": true,
            "setterComponentName": "ASwitch",
            "show": true,
            "enableValueExpress": false
        }, {
            "name": "isHidden",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "是否隐藏",
            "setterComponentName": "ASwitch",
            "description": "是否隐藏该查询条件，一般用于设置内置的参数"
        }, {
            "name": "component",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "setterComponentName": "GlComponentSelect",
            "title": "选择组件",
            "show": true,
            "expanded": true
        }],
        "setterComponentName": "GlObjectArraySetter",
        "show": true,
        "expanded": false,
        "titleField": "title",
        "enableValueExpress": false
    }, {
        "name": "toolbar",
        "setterComponentProps": {},
        "setterComponentVModelName": "",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": false,
        "_showSub": false,
        "properties": [{
            "name": "leftItems",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "_showSub": false,
            "properties": [],
            "setterComponentName": "GlArrayComponentSetter",
            "titleField": "componentName",
            "title": "左边组件"
        }, {
            "name": "rightItems",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "_showSub": true,
            "properties": [],
            "title": "左边组件",
            "setterComponentName": "GlArrayComponentSetter",
            "titleField": ""
        }, {
            "name": "leftColSpan",
            "setterComponentProps": {"defaultValue": 12},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "title": "左栅格数",
            "setterComponentName": "AInputNumber",
            "placeholder": "12",
            "description": "一行按24栅格划分，占的栅格数"
        }, {
            "name": "rightColSpan",
            "setterComponentProps": {"defaultValue": 12},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "title": "右栅格数",
            "placeholder": "12",
            "setterComponentName": "AInputNumber",
            "description": "一行按24栅格划分，占的栅格数"
        }],
        "title": "工具条",
        "setterComponentName": "GlSimpleObjectSetter",
        "titleField": "",
        "enableValueExpress": false
    }, {
        "name": "columns",
        "setterComponentProps": {},
        "setterComponentVModelName": "",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "_showSub": true,
        "properties": [{
            "name": "dataIndex",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "title": "绑定字段",
            "setterComponentName": "GlFieldSelect"
        }, {
            "name": "title",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "title": "字段标题",
            "setterComponentName": "AInput",
            "enableValueExpress": false
        }, {
            "name": "xShow",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "setterComponentProps": {"defaultChecked": true},
            "setterComponentVModelName": "modelValue",
            "title": "是否显示",
            "setterComponentName": "ASwitch"
        },  {
            "name": "xRenderScript",
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "group": "base",
            "type": "props",
            "show": true,
            "expanded": true,
            "description": "对字段值进行处理，示例：\"$ctx.record.enableStatus == 1 ? '已启用' : '未启用'\"。",
            "title": "显示脚本",
            "setterComponentName": "AInput",
            "enableValueExpress": false
        }, {
            "name": "sortable",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "",
            "_showSub": false,
            "properties": [{
                "name": "sortDirections",
                "group": "base",
                "type": "props",
                "enableValueExpress": false,
                "show": true,
                "expanded": true,
                "setterComponentProps": {
                    "options": [{
                        "label": "升序",
                        "value": "ascend",
                        "__tIT53h6CwaIY5gI5Tg": "ascend"
                    }, {"label": "降序", "value": "descend", "__tIT53h6CwaIY5gI5Tg": "descend"}], "multiple": true
                },
                "setterComponentVModelName": "modelValue",
                "title": "支持的排序",
                "setterComponentName": "ASelect"
            }, {
                "name": "sortOrder",
                "group": "base",
                "type": "props",
                "enableValueExpress": false,
                "show": true,
                "expanded": true,
                "setterComponentProps": {
                    "options": [{
                        "label": "升序",
                        "value": "ascend",
                        "__ZdVwo6BfhrvLj0GlaI": "ascend"
                    }, {"label": "降序", "value": "descend", "__ZdVwo6BfhrvLj0GlaI": "descend"}, {"label": "无"}],
                    "type": "radio"
                },
                "setterComponentVModelName": "modelValue",
                "title": "排序方向",
                "setterComponentName": "ARadioGroup"
            }],
            "setterComponentName": "GlSimpleObjectSetter",
            "title": "排序"
        }, {
            "name": "width",
            "group": "base",
            "type": "props",
            "enableValueExpress": false,
            "show": true,
            "expanded": true,
            "setterComponentProps": {},
            "setterComponentVModelName": "modelValue",
            "title": "宽度",
            "setterComponentName": "AInputNumber",
            "placeholder": "单位象素(px)"
        }],
        "setterComponentName": "GlObjectArraySetter",
        "title": "表格列",
        "titleField": "title",
        "enableValueExpress": false
    }, {
        "name": "columnActions",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "_showSub": false,
        "properties": [],
        "setterComponentName": "GlArrayComponentSetter",
        "title": "列操作",
        "enableValueExpress": false
    }],
    "actions": [{
        "name": "fetchSuccess",
        "title": "成功加载完数据",
        "description": "从服务端成功加数据（0到多条）后触发。"
    }, {
        "name": "changeRecord",
        "title": "行记录更改",
        "description": "在数据表的行内编辑模式下，当数据表的行记录信息更换时触发"
    }],
    "methods": [{"name": "refresh", "title": "刷新", "description": "刷新表格", "params": []}, {
        "name": "deleteRow",
        "title": "删除行",
        "params": [{
            "name": "id",
            "type": "String",
            "description": "在表格行操作中，值示例：$ctx.record.id",
            "title": "记录ID",
            "defaultValue": ""
        }]
    }]
}