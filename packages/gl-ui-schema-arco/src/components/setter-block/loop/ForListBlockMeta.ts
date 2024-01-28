export default {
  componentName: 'GlForListBlock',
  displayMode: 'tile',
  iconType: 'gl-circulate',
  group: 'block_loop',
  title: '列表循环',
  useBy: ['freePage'],
  blockContent: '循环列表的每一项，并将当前循环项保存到${loopItem}',
  properties: [
    {
      name: 'items',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '列表项',
      setterComponentName: 'AInput',
      enableValueExpress: true
    },
    {
      name: 'loopItem',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: { placeholder: '默认为loopItem' },
      setterComponentVModelName: 'modelValue',
      title: '循环项名',
      setterComponentName: 'AInput',
      setterDefaultValue: 'loopItem',
      enableValueExpress: true
    },
    {
      name: 'loopItemIndex',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: { placeholder: '默认为loopItemIndex' },
      setterComponentVModelName: 'modelValue',
      setterDefaultValue: 'loopItemIndex',
      title: '循环索引名',
      setterComponentName: 'AInput'
    }
  ]
}
