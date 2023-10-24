export default {
    "componentName": "GlImportExcelBlock",
    "displayMode": "tile",
    "iconType": "gl-file-excel",
    "group": "block_file",
    "title": "导入Excel",
    "useBy": ["freePage"],
    "blockContent": '将Excel数据（${fileName}）导入系统。',
    "properties": [{
        "name": "fileTemplate",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "Excel模板",
        "setterComponentName": "GlAppFileTemplateSelect",
        "enableValueExpress": false,
        "displayMode": "tile"
    }, {
        "name": "importType",
        "setterComponentProps": {
            "multiple": false,
            "options": [{
                "label": "异常时保存已导入记录",
                "value": "part",
            }, {"label": "异常时不保存已导入记录", "value": "all"}]
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "enableValueExpress": false,
        "show": true,
        "expanded": true,
        "displayMode": "tile",
        "title": "数据导入方式",
        "description": "在导入的过程中若有异常是否中断，是否回滚并取消导入",
        "setterComponentName": "GlSelect",
        "setterDefaultValue": "part"
    }]
}