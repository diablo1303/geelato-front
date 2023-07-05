export default {
    "id": "",
    "title": "子表单",
    "group": "dataEntry",
    "useBy": ["freePage"],
    "componentName": "GlEntityTableSub",
    "props": {
        "base": {
            "tableTitle": "子表单",
            "entityName": "platform_demo_sub_entity",
            "isFormSubTable": true,
            "subTablePidName": "demoEntityId",
            "showQuery": false,
            "showPagination": false,
            "enableEdit": true
        },
        "query": [],
        "toolbar": {
            "leftColSpan": 12,
            "rightColSpan": 12,
            "leftItems": [],
            "rightItems": []
        },
        "columns": [{"title": "ID", "dataIndex": "id"}, {
            "title": "名称",
            "dataIndex": "name",
            "fixed": "right",
            "sortable": {"sortDirections": ["ascend", "descend"]},
            "xEditComponent": {
                "id": "",
                "title": "",
                "componentName": "AInput",
                "group": "",
                "props": {},
                "propsExpressions": {},
                "slots": {
                    "prefix": {
                        "componentName": "GlText",
                        "propsTarget": "v-model"
                    },
                    "suffix": {
                        "componentName": "GlText",
                        "propsTarget": "v-model"
                    }
                },
                "slotsExpressions": {},
                "children": [],
                "actions": [],
                "style": {},
                "propsWrapper": "",
                "i18n": [],
                "valueExpression": ""
            },
        }, {
            "title": "描述",
            "dataIndex": "description"
        }, {
            "title": "状态",
            "dataIndex": "delStatus",
            "xRenderScript": "$gl.ctx.record.delStatus == 1 ? '已启用' : '未启用'"
        }, {
            "title": "创建时间",
            "dataIndex": "createAt"
        }],
        "columnActions": []
    },
    "slots": {},
    "style": {},
    "children": [],
    "actions": []
}