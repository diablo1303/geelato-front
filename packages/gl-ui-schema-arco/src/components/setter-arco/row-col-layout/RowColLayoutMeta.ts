export default {
    "componentName": "GlRowColLayout",
    "displayMode": "Tile",
    "iconType": "gl-layout",
    "group": "layout",
    "title": "行列布局",
    "alias": "rclayout",
    "useBy": ["freePage"],
    "properties": [{
        "name": "spans",
        "setterComponentProps": {"min": 1, "max": 24},
        "setterComponentVModelName": "modelValue",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "title": "项",
        "setterComponentName": "GlArrayNumberSetter"
    }, {
        "name": "gutter",
        "group": "base",
        "type": "props",
        "show": true,
        "expanded": true,
        "setterComponentProps": {},
        "setterComponentVModelName": "modelValue",
        "title": "间隔",
        "setterComponentName": "AInputNumber"
    }],
    "displayOnStage": "block"
}