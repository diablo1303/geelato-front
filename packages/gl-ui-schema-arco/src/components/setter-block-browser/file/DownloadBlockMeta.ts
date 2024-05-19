export default {
  componentName: 'GlDownloadBlock',
  displayMode: 'tile',
  iconType: 'gl-file',
  group: 'block_file',
  title: '下载文件',
  useBy: ['freePage'],
  blockContent: '下载文件（${fileId}）。',
  properties: [
    {
      name: 'fileId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '文件ID',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      displayMode: 'tile'
    },
    {
      name: 'toPdf',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '是否转成PDF',
      setterComponentName: 'ASwitch',
      enableValueExpress: false,
      displayMode: 'tile',
      description: '在下载时是否自动转成PDF，对于Word、Excel等文件类型适用。'
    }
  ]
}
