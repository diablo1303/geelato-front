export default {
    "componentName": "GlOpRecord",
    "displayMode": "tile",
    "iconType": "gl-log",
    "group": "dataDisplay",
    "title": "操作记录",
    "alias": "op",
    "useBy": ["freePage"],
    "properties": [
        {
            "expanded": true,
            "name": "recordIdPageParamName",
            "title": "页面参数名",
            "group": "base",
            "placeholder": "",
            "description": "基于该页面参数名从页面参数中获取表单实例的ID值，用于获取该表单的操作记录",
            "setterComponentName": "AInput",
            "setterComponentVModelName": "modelValue",
            "setterComponentProps": {},
            "type": "props",
            "show": true
        }
    ],
    "actions": [],
    "methods": []
}