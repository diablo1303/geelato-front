export default {
    "props": {
        "entityName": "platform_role",
        "query": {
            "items": [{
                "id": "name",
                "name": "名称",
                "cop": "contains",
                "isAdvanceQuery": false,
                "colspan": 6,
                "component": {
                    "componentName": "AInput",
                    "props": {}
                }
            }, {
                "id": "code",
                "name": "编码",
                "isAdvanceQuery": false,
                "colspan": 6,
                "component": {
                    "componentName": "AInput",
                    "props": {}
                }
            }, {
                "id": "enableStatus",
                "name": "启用状态",
                "isAdvanceQuery": false,
                "colspan": 6,
                "component": {
                    "componentName": "ASelect",
                    "props": {
                        "options": [{"value": 1, "label": "已启用"}, {"value": 0, "label": "已停用"}],
                        "allowClear": true
                    }
                }
            }]
        },
        "toolbar": {
            "leftColSpan": 12,
            "centerColSpan": 0,
            "rightColSpan": 12,
            "leftItems": [],
            "centerItems": [],
            "rightItems": []
        },
        "columns": [{"title": "ID", "dataIndex": "id", "slotName": "index"}, {
            "title": "名称",
            "dataIndex": "name",
            "fixed": "right",
            "sortable": {"sortDirections": ["ascend", "descend"]}
        }, {"title": "编码", "dataIndex": "code"}, {
            "title": "类型",
            "dataIndex": "type",
            "xRenderScript": "ctx.record.type === '1' ? '平台级' : '应用级'"
        }, {
            "title": "启用",
            "dataIndex": "enableStatus",
            "slotName": "enableStatus",
            "xRenderScript": "ctx.record.enableStatus === 1 ? '已启用' : '未启用'"
        }, {"title": "描述", "dataIndex": "description"}, {
            "title": "创建时间",
            "dataIndex": "createAt"
        }, {"title": "操作", "dataIndex": "optional", "slotName": "optional"}],
        "columnActions": []
    },
    "slots": {},
    "children": [],
    "actions": [],
    "componentName": "GlEntityTablePlus",
    "title": "表格",
    "group": "dataDisplay",
    "useBy": ["freePage"],
    "style": {},
    "id": "dXcmbHQxujC9dKAR"
}