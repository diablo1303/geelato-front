export default {
  componentName: 'AAutoComplete',
  displayMode: 'tile',
  iconType: 'gl-autoComplete',
  group: 'dataEntry',
  title: '自动完成',
  alias: 'autoc',
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
      name: 'hideLabel',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '隐藏标题',
      setterComponentName: 'ASwitch'
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
      name: 'allowClear',
      setterComponentProps: {},
      setterComponentVModelName: 'checked',
      group: 'base',
      type: 'props',
      description: '支持清除, 单选模式有效',
      title: '清除',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'autofocus',
      setterComponentProps: {},
      setterComponentVModelName: 'checked',
      group: 'base',
      type: 'props',
      description: '自动获取焦点',
      setterComponentName: 'ASwitch',
      title: '自动焦点'
    },
    {
      name: 'backfill',
      setterComponentProps: {},
      setterComponentVModelName: 'checked',
      group: 'base',
      type: 'props',
      description: '使用键盘选择选项的时候把选中项回填到输入框中',
      setterComponentName: 'ASwitch',
      title: '键盘选择回填'
    },
    {
      name: 'defaultActiveFirstOption',
      setterComponentProps: {},
      setterComponentVModelName: 'checked',
      group: 'base',
      type: 'props',
      description: '是否默认高亮第一个选项。',
      title: '高亮第一项',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'defaultOpen',
      setterComponentProps: {},
      setterComponentVModelName: 'checked',
      group: 'base',
      type: 'props',
      description: '是否默认展开下拉菜单',
      title: '默认展开下拉',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'disabled',
      setterComponentProps: {},
      setterComponentVModelName: 'checked',
      group: 'base',
      type: 'props',
      description: '是否禁用',
      title: '禁用',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'dropdownMatchSelectWidth',
      setterComponentProps: {},
      setterComponentVModelName: 'checked',
      group: 'base',
      type: 'props',
      description:
        '下拉菜单和选择器同宽。默认将设置 min-width，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动',
      title: '同宽',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'options',
      setterComponentProps: {},
      setterComponentVModelName: '',
      group: 'base',
      type: 'props',
      _showSub: false,
      properties: [
        {
          name: 'text',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          setterComponentName: 'AInput',
          title: '标题'
        },
        {
          name: 'value',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          setterComponentName: 'AInput',
          title: '值'
        }
      ],
      setterComponentName: 'GlObjectArraySetter',
      description: '自动完成的数据源',
      title: '数据源'
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
    ]}]
}
