export default {
    "id": "",
    "group": "dataEntry",
    "useBy": ["freePage"],
    "componentName": "GlEntityTableSub",
    "props": {
        "base": {
            "label": "子表单",
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
        "columns": [
            {
                "id": "",
                "_component": {
                    "id": "",
                    "title": "",
                    "componentName": "GlText",
                    "group": "",
                    "props": {
                        "label": "ID",
                        "bindField": {
                            "appCode": "",
                            "entityName": "",
                            "fieldName": "id"
                        }
                    },
                    "propsExpressions": {},
                    "slots": {},
                    "slotsExpressions": {},
                    "children": [],
                    "actions": [],
                    "style": {},
                    "propsWrapper": "",
                    "i18n": [],
                    "__validateError": null,
                    "__dragFlag": ""
                },
                "sortable": {}
            }],
        "columnActions": []
    },
    "actions": []
}