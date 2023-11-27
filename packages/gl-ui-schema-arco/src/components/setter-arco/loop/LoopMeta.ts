export default {
  componentName: 'GlLoop',
  displayMode: 'tile',
  iconType: 'gl-circulate',
  group: 'layout',
  title: '循环',
  alias: 'loop',
  useBy: ['freePage'],
  properties: [
    {
      name: 'dataSourceType',
      setterComponentProps: {
        options: [
          { label: '静态数据', value: 'staticArray', __dSreZNqjwGolhBEjsc: 'staticArray' },
          { label: '动态数据', value: 'entityReader', __dSreZNqjwGolhBEjsc: 'entityReader' }
        ],
        type: 'button'
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      title: '循环数据源',
      setterComponentName: 'ARadioGroup',
      setterDefaultValue: 'staticArray'
    },
    {
      name: 'staticArray',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'GlOptionsSetter',
      title: '静态数据'
    },
    {
      name: 'entityReader',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: { options: [] },
      setterComponentVModelName: 'modelValue',
      title: '动态数据',
      setterComponentName: 'GlEntityReaderSetter',
      description: '基于实体查询的动态数据源',
      displayMode: 'tile'
    },
    {
      name: 'align',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          { label: 'start', value: 'start', __KSFlMzwzEHxrNeVxH1: 'start' },
          { label: 'end', value: 'end', __KSFlMzwzEHxrNeVxH1: 'end' },
          { label: 'center', value: 'center', __KSFlMzwzEHxrNeVxH1: 'center' },
          { label: 'baseline', value: 'baseline', __KSFlMzwzEHxrNeVxH1: 'baseline' }
        ],
        multiple: false,
        allowClear: true
      },
      setterComponentVModelName: 'modelValue',
      title: '对齐方式',
      setterComponentName: 'ASelect',
      description: 'vue模板（template），样式可以采用内联的方式写在标签中。',
      displayMode: 'tile'
    },
    {
      name: 'direction',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        options: [
          { label: '垂直', value: 'vertical', __zp0tSjJ6erYS20kBbt: 'vertical' },
          { label: '水平', value: 'horizontal', __zp0tSjJ6erYS20kBbt: 'horizontal' }
        ],
        type: 'button'
      },
      setterComponentVModelName: 'modelValue',
      title: '间距方向',
      setterComponentName: 'ARadioGroup'
    },
    {
      name: 'size',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        options: [
          { label: 'none', __6mstj2E9fGlapettXq: 'none', value: 'none' },
          { label: 'mini', __6mstj2E9fGlapettXq: 'mini', value: 'mini' },
          { label: 'small', __6mstj2E9fGlapettXq: 'small', value: 'small' },
          { label: 'medium', __6mstj2E9fGlapettXq: 'medium', value: 'medium' },
          { label: 'large', __6mstj2E9fGlapettXq: 'large', value: 'large' }
        ],
        allowClear: false,
        multiple: false
      },
      setterComponentVModelName: 'modelValue',
      title: '间距大小',
      description: '支持分别制定横向和竖向的间距',
      setterComponentName: 'ASelect'
    },
    {
      name: 'wrap',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '环绕类型的间距，用于折行的场景。',
      title: '是否换行',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'fill',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '充满整行',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'divider',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      title: '分隔符',
      setterComponentName: 'ASwitch'
    }
  ],
  actions: [{ name: 'clickLoopItem', title: '点击循环项' }]
}
