export default {
  componentName: 'GlImportExcelBlock',
  displayMode: 'tile',
  iconType: 'gl-file-excel',
  group: 'block_file',
  title: '导入Excel',
  useBy: ['freePage'],
  blockContent: '将Excel数据（${fileName}）导入系统。',
  properties: [
    {
      name: 'fileTemplate',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        useType:'import'
      },
      setterComponentVModelName: 'modelValue',
      title: 'Excel模板',
      setterComponentName: 'GlAppFileTemplateSelect',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'importType',
      setterComponentProps: {
        multiple: false,
        options: [
          {
            label: '异常时保存已导入记录（无事务）',
            value: 'part'
          },
          { label: '异常时不保存已导入记录（带事务，容易数据库死锁）', value: 'all' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      title: '数据导入方式',
      description: '在导入的过程中若有异常是否中断，是否回滚并取消导入',
      setterComponentName: 'GlSelect',
      setterDefaultValue: 'part'
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
            label: '点击确认操作时触发，在此可配置表单保存操作等',
            value: 'onBeforeOk'
          },
          {
            label: '页面关闭后触发，在此可配置列表刷新操作等',
            value: 'onClose'
          }
        ],
        multiple: true,
        allowClear: false
      },
      setterComponentVModelName: 'modelValue',
      title: '调用指令',
      setterComponentName: 'ASelect',
      displayMode: 'tile'
    }
  ]
}