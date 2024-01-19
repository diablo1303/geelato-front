export default {
  componentName: 'GlBpmnStartTimerEvent',
  displayMode: 'tile',
  iconType: 'gl-start-event-timer',
  group: 'bpmn',
  title: '时间开始',
  alias: 'bpmn_t_s',
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
        {"label": "timeCycle", "__padZZp0IGRPJzhv5PH": "timeCycle", "value": "timeCycle"},
        {"label": "timeDuration", "__padZZp0IGRPJzhv5PH": "timeDuration", "value": "timeDuration"},
        {"label": "timeDate", "__padZZp0IGRPJzhv5PH": "timeDate", "value": "timeDate"}
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