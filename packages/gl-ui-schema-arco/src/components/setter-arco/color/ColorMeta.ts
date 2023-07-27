export default {
    "componentName": "GlColor",
    "displayMode": "Tile",
    "iconType": "gl-color",
    "group": "dataEntry",
    "title": "颜色",
    "alias": "color",
    "useBy": ["freePage"],
    "properties": [{
        "name": "mode",
        "setterComponentProps": {"options": [{"label": "精简", "value": "simple"},{"label": "完全", "value": "full"}]},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "模式",
        "setterComponentName": "ARadioGroup"
    }, {
        "name": "colorFormat",
        "setterComponentProps": {"options": [{"label": "Hex", "v_hm58XpkVsSPBVlyw": "hex", "value": "hex"}]},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "格式",
        "setterComponentName": "ARadioGroup"
    }],
    "displayOnStage": "inline-block",
    "actions": [{"name": "onValueChange", "description": "", "title": "值改变"}]
}