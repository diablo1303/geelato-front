export default {
  componentName: 'GlTriggerComponentActionBlock',
  displayMode: 'tile',
  iconType: 'gl-thunderbolt',
  group: 'block_page',
  title: '触发组件动作',
  description: '触发组件动作（组件动作是基于脚本配置的，组件方法是组件原生），解发的目标组件动作内可以通过$gl.ctx可以获取当前动作的上下文$gl.ctx。',
  useBy: ['freePage'],
  blockContent: '触发组件${componentId}的动作事件${actionName}',
  properties: [
    {
      name: 'appId',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '应用',
      setterComponentName: 'GlAppSelect',
      placeholder: ''
    },
    {
      name: 'extendId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '页面',
      setterComponentName: 'GlPageSelect',
      enableValueExpress: false
    },
    {
      name: 'componentId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '触发的组件',
      setterComponentName: 'GlPageComponentSelect',
      enableValueExpress: false
    },
    {
      name: 'actionName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '触发组件动作',
      setterComponentName: 'GlComponentActionSelect',
      enableValueExpress: false
    },
    {
      name: 'resultVar',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      isBlockVarProp: true,
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
  ],
  actions: []
}
