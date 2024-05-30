export default {
    "id": "",
    "group": "dataDisplay",
    "useBy": ["freePage"],
    "componentName": "GlEntityTablePlus",
    "props": {
        "base": {
            "label": "表格",
            "entityName": "demo_entity",
            "isFormSubTable": false,
            "subTablePidName": "",
            "showQuery": true,
            "showPagination": true,
            "enableEdit": false,
            "_propsExpressions": {},
            "checkType": "checkbox",
            "showCheckAll": true
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
                "sortable": {},
                "dataIndex": "id",
                "title": "ID",
                "_show": false,
                "_propsExpressions": {}
            }
        ],
        "columnActions": []
    },
    "actions": []
}