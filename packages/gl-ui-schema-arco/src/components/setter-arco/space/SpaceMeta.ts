export default {
  componentName: 'GlSpace',
  displayMode: 'tile',
  iconType: 'gl-space',
  group: 'layout',
  title: '间距',
  alias: 'space',
  useBy: ['freePage'],
  properties: [
    {
      expanded: true,
      name: 'label',
      title: '标题',
      group: 'base',
      placeholder: '',
      description: '标题',
      setterComponentName: 'AInput',
      setterComponentVModelName: 'modelValue',
      setterComponentProps: {},
      type: 'props',
      show: true,
      enableValueExpress: true
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
          { label: 'start', value: 'start' },
          { label: 'end', value: 'end' },
          { label: 'center', value: 'center' },
          { label: 'baseline', value: 'baseline' }
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
          { label: '垂直', value: 'vertical' },
          { label: '水平', value: 'horizontal' }
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
          { label: 'none', value: 'none' },
          { label: 'mini', value: 'mini' },
          { label: 'small', value: 'small' },
          { label: 'medium', value: 'medium' },
          { label: 'large', value: 'large' }
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
    }
  ],
  actions: []
}
