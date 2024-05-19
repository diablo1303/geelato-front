export default {
  componentName: 'GlMessageBlock',
  displayMode: 'tile',
  iconType: 'gl-message',
  group: 'block_feedback',
  title: '全局提示',
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
      name: 'content',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '消息内容',
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
          { label: '信息提示', value: 'info' },
          { label: '成功提示', value: 'success' },
          { label: '警告提示', value: 'warning' },
          { label: '错误提示', value: 'error' },
          { label: '加载中提示', value: 'loading' },
          { label: '显示提示', value: 'normal' },
          { label: '清空全部提示', value: 'clear' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '提示访求',
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
          { label: '上方', value: 'top' },
          { label: '下方', value: 'bottom' }
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
      name: 'resetOnHover',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '不会自动关闭',
      setterComponentName: 'ASwitch',
      description: '设置鼠标移入后不会自动关闭'
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
