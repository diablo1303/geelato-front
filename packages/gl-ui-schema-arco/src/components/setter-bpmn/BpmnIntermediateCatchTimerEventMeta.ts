export default {
  componentName: 'GlBpmnIntermediateCatchTimerEvent',
  displayMode: 'tile',
  iconType: 'gl-intermediate-event-catch-timer',
  group: 'bpmn',
  title: '时间捕获',
  alias: 'bpmn_t_c',
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
        {"label": "timeCycle", "__xeYOJ2wNjLQ3NajOBy": "timeCycle", "value": "timeCycle"},
        {"label": "timeDuration", "__xeYOJ2wNjLQ3NajOBy": "timeDuration", "value": "timeDuration"},
        {"label": "timeDate", "__xeYOJ2wNjLQ3NajOBy": "timeDate", "value": "timeDate"}
      ]
    },
    "setterComponentVModelName": "modelValue",
    "group": "base",
    "type": "props",
    "enableValueExpress": false,
    "show": true,
    "expanded": true,
    "displayMode": "tile",
    "title": "Timer-definition Type",
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