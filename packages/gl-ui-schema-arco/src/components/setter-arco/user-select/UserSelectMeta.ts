export default {
  componentName: 'GlUserSelect',
  displayMode: 'tile',
  iconType: 'gl-user',
  group: 'dataEntry',
  title: '人员选择',
  alias: 'userselect',
  useBy: ['freePage'],
  properties: [
    {
      name: 'label',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '标题',
      setterComponentName: 'AInput'
    },
    {
      name: 'bindField',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '绑定字段',
      setterComponentName: 'GlEntityFieldSelect'
    },
    {
      name: 'userTypes',
      setterComponentProps: {
        placeholder: '请选择',
        multiple: true,
        options: [
          { value: '0', label: '内部账号' },
          { value: '1', label: '系统账号' },
          { value: '2', label: '外部账号' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '用户范围',
      description: '用户范围，默认不选择时为内部账号',
      setterComponentName: 'GlSelect'
    },
    {
      name: 'nameFieldBindComponentId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '名称组件',
      setterComponentName: 'AInput',
      description:
        '人员选择时，人员id绑定到本组件，人员名称需绑定到另一个组件，在此设置目标组件的唯一标识。',
      placeholder: '名称组件的唯一标识'
    }
  ],
  actions: [{ name: 'valueChange', description: '', title: '值改变' ,params: [
      {
        name: 'value',
        title: '修改后的值',
        required: true,
        type: 'any',
        description: '修改后的值。'
      },
      {
        name: 'oldValue',
        title: '修改前的值',
        required: true,
        type: 'any',
        description: '修改前的值，如是值是对象引用，修改后和修改前的是同一个，值相同。'
      }
    ] }]
}
