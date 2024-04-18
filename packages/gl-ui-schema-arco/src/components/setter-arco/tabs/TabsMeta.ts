export default {
  componentName: 'GlTabs',
  displayMode: 'tile',
  iconType: 'gl-tabs',
  group: 'layout',
  title: '标签页',
  alias: 'tabs',
  useBy: ['freePage'],
  properties: [
    {
      name: 'items',
      setterComponentProps: {},
      setterComponentVModelName: '',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '标签项',
      setterComponentName: 'GlObjectArraySetter',
      _showSub: true,
      properties: [
        {
          name: 'title',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '标题',
          setterComponentName: 'AInput',
          enableValueExpress: false
        },
        {
          name: 'value',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '值',
          description: '切换tab时，选中的值',
          setterComponentName: 'AInput',
          enableValueExpress: true,
          displayMode: 'tile'
        },
        {
          name: 'iconType',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          setterComponentProps: {alwaysEditable:true},
          setterComponentVModelName: 'modelValue',
          title: '图标',
          setterComponentName: 'GlIconfontSelect',
          enableValueExpress: false
        },
        {
          name: 'disabled',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '禁用',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'lazyLoad',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '懒加载',
          setterComponentName: 'ASwitch',
          description: '选中该面板时才加载，以提高页面性能。如果在动作脚本中引用了该面板的组件，需要注意在引用前确保页面已加载。'
        },
        {
          name: 'hideRightTopSlot',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '隐藏右上插槽',
          setterComponentName: 'ASwitch',
          description: '选中该面板时，隐藏右上插槽，默认不隐藏，该属性在开启了右上插槽时才有效。'
        }
      ],
      titleField: 'title',
      enableValueExpress: false,
      displayMode: 'tile',
      subTitleField: 'value',
      alarmIfNoSubTitle: '值为空'
    },
    {
      name: 'position',
      setterComponentProps: {
        type: 'button',
        options: [
          { label: '上',value: 'top' },
          {
            label: '右',
            value: 'right'
          },
          { label: '下', value: 'bottom' },
          {
            label: '左',
            value: 'left'
          }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '标签位置',
      setterComponentName: 'ARadioGroup',
      setterDefaultValue: ''
    },
    {
      name: 'enableFixedTitle',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '固定标签',
      setterComponentName: 'ASwitch',
      description:'标签位置固定（绝对定位），不受滚动条上下拖动影响。注意，该属性只对标签位置为“上”或“左”时生效。'
    },
    {
      name: 'extra',
      group: 'base',
      type: 'slots',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '右上插槽',
      setterComponentName: 'GlSlotSetter',
      slotComponentName: 'GlComponent',
      slotComponentBindTarget: 'v-model',
      slotComponentBindName: 'glComponentInst'
    },
    {
      name: 'type',
      setterComponentProps: {
        type: 'radio',
        options: [
          { label: 'line', value: 'line', __eGMOjRWzE5POvKO12X: 'line' },
          {
            label: 'card',
            value: 'card',
            __eGMOjRWzE5POvKO12X: 'card'
          },
          {
            label: 'card-gutter',
            value: 'card-gutter',
            __eGMOjRWzE5POvKO12X: 'card-gutter'
          },
          { label: 'text', value: 'text', __eGMOjRWzE5POvKO12X: 'text' },
          {
            label: 'rounded',
            value: 'rounded',
            __eGMOjRWzE5POvKO12X: 'rounded'
          },
          { label: 'capsule', value: 'capsule', __eGMOjRWzE5POvKO12X: 'capsule' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '类型',
      setterComponentName: 'ARadioGroup',
      displayMode: 'tile'
    }
  ],
  actions: [{ name: 'onValueChange', description: '切换选项卡', title: '切换选项卡' }],
  methods: [
    { name: 'getValue', title: '获取当前选中的标签页值', description: '', params: [] },
    {
      name: 'selectByValue',
      title: '通过值选择标签页',
      description: '找到值与参数值一致的标签页，并选中',
      params: [{
        name: 'value',
        type: 'string|number',
        description: '',
        title: '标签值',
        defaultValue: ''
      }]
    },
    {
      name: 'selectByIndex',
      title: '通过索引位置选择标签页',
      description: '索引位置，从0开始，即第一个为0',
      params: [{
        name: 'index',
        type: 'number',
        description: '',
        title: '标签索引',
        defaultValue: '索引从0开始计，即第一个为0。'
      }]
    }
    ]
}