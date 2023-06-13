export default {
    "props": {
        "id": "",
        "componentName": "GlEntityTablePlus",
        "title": "表格",
        "group": "dataDisplay",
        "useBy": ["freePage"],
        "style": {},
        "query": [],
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
        }],
        "columnActions": []
    },
    "slots": {},
    "children": [],
    "actions": []
}