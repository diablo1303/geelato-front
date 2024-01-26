export default {
  componentName: 'GlPagination',
  displayMode: 'tile',
  iconType: 'gl-pagination',
  group: 'navigation',
  title: '分页',
  alias: 'pagination',
  useBy: ['freePage'],
  properties: [
    {
      name: 'defaultPageSize',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '默认每页展示的数据条数',
      title: '每页记录数',
      setterComponentName: 'AInputNumber'
    },
    {
      name: 'hideOnSinglePage',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '单页时是否隐藏分页',
      title: '单页时隐藏',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'simple',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '是否为简单模式',
      title: '简单模式',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'showTotal',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '是否显示数据总数',
      title: '显示总数',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'showMore',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '是否显示更多按钮',
      title: '显示更多',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'showJumper',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '是否显示跳转',
      title: '显示跳转',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'showPageSize',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        checkedText: '显示数据条数选择器',
        uncheckedText: '不显示数据条数选择器'
      },
      setterComponentVModelName: 'modelValue',
      description: '是否显示数据条数选择器',
      title: '记录选择器',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'pageSizeOptions',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: { options: [] },
      setterComponentVModelName: 'modelValue',
      description: '数据条数选择器的选项列表',
      setterComponentName: 'GlArrayNumberSetter',
      setterDefaultValue: [5, 10, 15, 20, 30, 40, 50, 100],
      title: '可选分页数'
    },
    {
      name: 'size',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        options: [
          {
            label: 'mini',
            value: 'mini',
            __vOdVHUjHXCUl38OBhY: 'mini'
          },
          { label: 'small', value: 'small', __vOdVHUjHXCUl38OBhY: 'small' },
          {
            label: 'medium',
            value: 'medium',
            __vOdVHUjHXCUl38OBhY: 'medium'
          },
          { label: 'large', value: 'large', __vOdVHUjHXCUl38OBhY: 'large' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      description: '分页选择器的大小',
      title: '大小',
      setterComponentName: 'ASelect'
    },
    {
      name: 'bufferSize',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '显示省略号时，当前页码左右显示的页码个数',
      title: '页码左右个数',
      setterComponentName: 'AInputNumber'
    },
    {
      name: 'baseSize',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '计算显示省略的基础参数，显示省略的个数为 baseSize + 2 * bufferSize',
      title: '省略基础参数',
      setterComponentName: 'AInputNumber'
    }
  ],
  actions: []
}
