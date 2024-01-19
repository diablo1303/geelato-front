export default {
  componentName: 'GlBpmnBoundaryTimerEvent',
  displayMode: 'tile',
  iconType: 'gl-intermediate-event-catch-timer',
  group: 'bpmn',
  title: '时间边界',
  alias: 'bpmn_t_b',
  useBy: ['bpmnPage'],
  properties: [{
    "name": "id",
    "group": "base",
    "type": "props",
    "show": true,
    "expanded": true,
    "setterComponentProps": {"readonly": true},
    "setterComponentVModelName": "modelValue",
    "title": "ID",
    "setterComponentName": "AInput",
    "enableValueExpress": false
  }, {
    "name": "text",
    "group": "base",
    "type": "props",
    "show": true,
    "expanded": true,
    "setterComponentProps": {},
    "setterComponentVModelName": "modelValue",
    "title": "名称",
    "setterComponentName": "AInput",
    "enableValueExpress": false
  }, {
    "name": "timerType",
    "setterComponentProps": {
      "options": [
        {"label": "timeCycle", "__EvSxYyYuU5E1KEVYKJ": "timeCycle", "value": "timeCycle"},
        {"label": "timeDuration", "__EvSxYyYuU5E1KEVYKJ": "timeDuration", "value": "timeDuration"},
        {"label": "timeDate", "__EvSxYyYuU5E1KEVYKJ": "timeDate", "value": "timeDate"}
      ]
    },
    "setterComponentVModelName": "modelValue",
    "group": "base",
    "type": "props",
    "enableValueExpress": false,
    "show": true,
    "expanded": true,
    "displayMode": "tile",
    "title": "计时器类型",
    "setterComponentName": "ASelect"
  }, {
    "name": "timerValue",
    "group": "base",
    "type": "props",
    "enableValueExpress": false,
    "show": true,
    "expanded": true,
    "displayMode": "tile",
    "setterComponentProps": {},
    "setterComponentVModelName": "modelValue",
    "title": "计时器值",
    "setterComponentName": "AInput"
  }]
}