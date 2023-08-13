export default {
    "componentName": "ATimelineItem",
    "displayMode": "tile",
    "iconType": "gl-timeline",
    "group": "dataDisplay",
    "title": "时间轴项",
    "useBy": ["freePage"],
    "properties": [{
        "name": "label",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "标签文本",
        "setterComponentName": "AInput"
    }, {
        "name": "position",
        "setterComponentProps": {
            "multiple": false,
            "options": [{"label": "在左侧", "value": "left"}, {"label": "在右侧", "value": "right"}, {
                "label": "在上方",
                "value": "top"
            }, {"label": "在下方", "value": "bottom"}]
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "位置",
        "setterComponentName": "ASelect"
    }, {
        "name": "dotColor",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "节点颜色",
        "setterComponentName": "AInput"
    }, {
        "name": "dotType",
        "setterComponentProps": {
            "options": [{"label": "空心", "value": "hollow"}, {
                "label": "实心",
                "value": "solid"
            }]
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "节点类型",
        "setterComponentName": "ARadioGroup"
    }, {
        "name": "lineType",
        "setterComponentProps": {
            "options": [{"label": "实线", "value": "solid"}, {
                "label": "虚线",
                "value": "dashed"
            }, {"label": "点状线", "value": "dotted"}]
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "时间轴类型",
        "setterComponentName": "ARadioGroup"
    }, {
        "name": "lineColor",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "时间轴颜色",
        "setterComponentName": "AInput"
    }],
    "actions": []
}