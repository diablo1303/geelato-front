export default {
    "componentName": "GlDownloadBlock",
    "displayMode": "tile",
    "iconType": "gl-file",
    "group": "block_file",
    "title": "下载文件",
    "useBy": ["freePage"],
    "blockContent": '下载文件（${fileId}）。',
    "properties": [{
        "name": "fileId",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "文件ID",
        "setterComponentName": "AInput",
        "enableValueExpress": true,
        "displayMode": "tile"
    }]
}