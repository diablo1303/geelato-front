export default {
  componentName: 'GlConfirmBlock',
  displayMode: 'tile',
  iconType: 'gl-checkbox',
  group: 'block_feedback',
  title: '弹出确认',
  useBy: ['freePage'],
  blockContent: '弹出确认框，标题为:${title}，内容为:${content}',
  properties: [
    {
      name: 'title',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '标题',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      placeholder: ''
    },
    {
      name: 'content',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '内容',
      enableValueExpress: true,
      setterComponentName: 'AInput'
    },
    {
      name: 'varName',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      isBlockVarProp: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '结果回写变量',
      placeholder: '结果回写变量名称',
      description: '点确认或取消时，值回写的变量，若点确认，值为true，则点取消或关闭，值为false',
      setterComponentName: 'AInput',
      enableValueExpress: false
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
            label: '确认时触发',
            __x0jZAUg6KzxyPrBkaf: 'onOk',
            value: 'onOk'
          },
          { label: '取消时触发', __x0jZAUg6KzxyPrBkaf: 'onCancel', value: 'onCancel' }
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
