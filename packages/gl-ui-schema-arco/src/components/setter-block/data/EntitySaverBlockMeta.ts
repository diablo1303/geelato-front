export default {
  componentName: 'GlEntitySaverBlock',
  displayMode: 'tile',
  iconType: 'gl-save',
  group: 'block_data',
  title: '实体保存',
  useBy: ['freePage'],
  blockContent: '基于元数据的实体保存对象（EntitySaver）进行保存，并返回结果到变量：${resultVar}。',
  properties: [
    {
      name: 'entitySaverVar',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '实体保存对象',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      placeholder: '实体保存对象的变量名entitySaverStr'
    },
    {
      name: 'resultVar',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '结果变量',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      placeholder: '方法调用返回存储的变量'
    },
    {
      name: 'enableAwait',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '同步调用',
      setterComponentName: 'ASwitch',
      enableValueExpress: false,
      description:
        '是否同步调用该方法，对于自身为异步的方法有效，如服务端请求，启用则在方法调用前加await'
    },
    {
      name: 'enableReturn',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '返回结果',
      setterComponentName: 'ASwitch',
      enableValueExpress: false,
      description: '返回该方法的调用执行结果，启用则在方法调用前添加return'
    }
  ]
}
