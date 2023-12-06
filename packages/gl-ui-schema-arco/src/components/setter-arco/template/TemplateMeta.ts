export default {
  componentName: 'GlTemplate',
  displayMode: 'tile',
  iconType: 'gl-vue',
  group: 'layout',
  title: '自定模板',
  alias: 'tmpl',
  useBy: ['freePage'],
  properties: [
    {
      name: 'content',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: { },
      setterComponentVModelName: 'modelValue',
      title: '模板内容',
      setterComponentName: 'GlVueEditor',
      description: 'vue模板（template），样式可以采用内联的方式写在标签中。如果模板用于循环组件内，可以使用变量：loopItem，loopIndex。',
      displayMode: 'tile'
    }
  ],
  actions: [{ name: 'clickTemplate', title: '点击' }]
}
