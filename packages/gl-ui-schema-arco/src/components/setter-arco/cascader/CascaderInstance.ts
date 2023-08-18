export default {
    "id": "",
    "componentName": "GlEntityCascader",
    "group": "dataEntry",
    "props": {
        "label": "级联选择",
        "entityReader": {
            "entity": "platform_dict_item",
            "fields": [
                {"name": "id", "title": "序号", "alias": ""},
                {"name": "pid", "title": "字典项父级", "alias": ""},
                {"name": "itemCode", "title": "字典项编码", "alias": "value"},
                {"name": "itemName", "title": "字典项文本", "alias": "label"}
            ],
            "params": [
                {"name": "dictId", "cop": "eq", "value": "3746095853593992980"}
            ],
            "pageNo": 0,
            "pageSize": 1000,
            "order": [],
            "withMeta": false,
            "resultMapping": {"items": [], "mapping": {}},
            "immediate": true,
            "lazyLoad": false
        },
        "maxTagCount": 0,
        "pathMode": false
    },
    "propsExpressions": {},
    "slots": {},
    "slotsExpressions": {},
    "children": [],
    "actions": [],
    "style": {},
    "i18n": []
}