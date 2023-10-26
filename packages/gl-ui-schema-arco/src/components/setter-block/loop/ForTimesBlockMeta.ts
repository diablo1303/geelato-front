export default {
  componentName: 'GlForTimesBlock',
  displayMode: 'tile',
  iconType: 'gl-circulate',
  group: 'block_loop',
  title: '次数循环',
  useBy: ['freePage'],
  blockContent: '从开始到结束，递增为${stepNumber}，并将当前循环值保存到${loopIndex}',
  properties: [
    {
      name: 'startNumber',
      setterComponentProps: { placeholder: '默认为0' },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '起始数',
      setterComponentName: 'AInputNumber',
      enableValueExpress: true,
      displayMode: 'tile',
      placeholder: '默认值为0'
    },
    {
      name: 'endNumber',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: { placeholder: '默认为1' },
      setterComponentVModelName: 'modelValue',
      title: '结束数',
      setterComponentName: 'AInputNumber',
      enableValueExpress: true,
      displayMode: 'tile',
      placeholder: '默认值为1'
    },
    {
      name: 'stepNumber',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: { placeholder: '默认为1' },
      setterComponentVModelName: 'modelValue',
      title: '递增值',
      setterComponentName: 'AInputNumber',
      enableValueExpress: false,
      displayMode: 'tile',
      placeholder: '默认值为1'
    },
    {
      name: 'loopIndex',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: { placeholder: '默认为loopIndex' },
      setterComponentVModelName: 'modelValue',
      title: '循环索引名',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      displayMode: 'tile',
      placeholder: '默认值为“loopIndex”',
      setterDefaultValue: 'loopIndex'
    }
  ]
}
