export default {
  componentName: 'GlSetRulesBlock',
  displayMode: 'tile',
  iconType: 'gl-rules',
  group: 'block_page',
  title: '设置组件规则',
  useBy: ['freePage'],
  blockContent: '设置组件:${componentId}，规则模式为:${ruleMode}',
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
      title: '调用的组件',
      setterComponentName: 'GlPageComponentSelect',
      enableValueExpress: false
    },
    {
      name: 'ruleMode',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentVModelName: 'modelValue',
      title: '规则模式',
      setterComponentName: 'ASelect',
      setterComponentProps: {
        options: [
          { label: '清空组件已配置的验证规则', value: 'clear' },
          { label: '自定义组件验证规则', value: 'custom' }
        ]
      },
      enableValueExpress: false,
      placeholder: ''
    },
    {
      name: 'customRules',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '自定义规则',
      setterComponentName: 'GlValidateRulesSetter'
    }
  ],
  actions: []
}