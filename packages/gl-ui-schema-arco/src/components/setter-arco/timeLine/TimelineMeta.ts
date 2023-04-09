export default {
    "componentName": "ATimeline",
    "displayMode": "Tile",
    "iconType": "gl-timeline",
    "group": "dataDisplay",
    "title": "时间轴",
    "useBy": ["freePage"],
    "properties": [{
        "name": "children",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "children",
        "show": true,
        "expanded": true,
        "title": "节点",
        "_showSub": true,
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
        }],
        "setterComponentName": "GlSubComponentSetter",
        "subComponentName": "ATimelineItem"
    }, {
        "name": "reverse",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "是否倒序",
        "setterComponentName": "ASwitch"
    }, {
        "name": "direction",
        "setterComponentProps": {
            "options": [{"label": "水平", "value": "horizontal"}, {
                "label": "垂直",
                "value": "vertical"
            }], "type": "radio"
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "方向",
        "setterComponentName": "ARadioGroup"
    }, {
        "name": "mode",
        "setterComponentProps": {
            "multiple": false,
            "options": [{"label": "时间轴在左侧", "value": "left"}, {
                "label": "时间轴在右侧",
                "value": "right"
            }, {"label": "交替出现", "value": "alternate"}, {
                "label": "时间轴在上方",
                "value": "top"
            }, {"label": "时间轴在下方", "value": "bottom"}]
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "展示类型",
        "setterComponentName": "ASelect"
    }, {
        "name": "pending",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "幽灵节点",
        "description": "是否展示幽灵节点，设置为 true 时候只展示幽灵节点。",
        "setterComponentName": "ASwitch"
    }, {
        "name": "labelPosition",
        "setterComponentProps": {
            "options": [{"label": "相对", "value": "relative"}, {
                "label": "相同",
                "value": "same"
            }]
        },
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "description": "设置标签文本的位置",
        "title": "标签位置",
        "setterComponentName": "ARadioGroup"
    }, {
        "name": "dot",
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "slots",
        "show": true,
        "expanded": true,
        "title": "幽灵节点插槽",
        "setterComponentName": "GlIconfontSetter",
        "slotComponentName": "GlIconfont",
        "slotComponentBindTarget": "v-bind"
    }],
    "actions": []
}