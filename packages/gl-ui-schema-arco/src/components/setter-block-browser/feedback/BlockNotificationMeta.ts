export default {
  componentName: 'GlNotificationBlock',
  displayMode: 'tile',
  iconType: 'gl-notification',
  group: 'block_feedback',
  title: '通知提醒',
  useBy: ['freePage'],
  blockContent: '全局展示通知提醒，内容为：${content}',
  properties: [
    {
      name: 'id',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '消息标识',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      description: '该标识会作为调用指令“关闭时回调”的唯一参数传入，在回调的方法体中可以通过$gl.vars.消息标识值，获取变量名与标识值相同。'
    },
    {
      name: 'title',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '标题',
      setterComponentName: 'AInput',
      enableValueExpress: true
    },
    {
      name: 'content',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '内容',
      setterComponentName: 'AInput',
      enableValueExpress: true
    },
    {
      name: 'method',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          { label: '信息提醒', value: 'info' },
          { label: '成功提醒', value: 'success' },
          { label: '警告提醒', value: 'warning' },
          { label: '错误提醒', value: 'error' },
          { label: '清除全部提醒框', value: 'clear' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '提醒类型',
      setterComponentName: 'ASelect'
    },
    {
      name: 'position',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        allowClear:true,
        options: [
          { label: '右上', value: 'topRight' },
          { label: '左上', value: 'topLeft' },
          { label: '右下', value: 'bottomRight' },
          { label: '左下', value: 'bottomLeft' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '消息的位置',
      setterComponentName: 'ASelect'
    },
    {
      name: 'showIcon',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '显示图标',
      setterComponentName: 'ASwitch',
      setterDefaultValue: true
    },
    {
      name: 'duration',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '持续时间',
      setterComponentName: 'AInputNumber',
      setterDefaultValue: 8000,
      description: '显示的持续时间，单位为 ms'
    },
    {
      name: 'closable',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '可关闭',
      setterComponentName: 'ASwitch'
    },

    {
      name: 'invokeBlocks',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          {
            label: '关闭时回调',
            value: 'onClose'
          }
        ],
        multiple: true
      },
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'ASelect',
      title: '调用指令'
    }
  ],
  actions: []
}
