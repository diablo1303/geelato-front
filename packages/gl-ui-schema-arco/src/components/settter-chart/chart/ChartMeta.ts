export default {
  componentName: 'GlChart',
  displayMode: 'tile',
  iconType: 'gl-piechart',
  group: 'chart',
  title: '图形',
  alias: 'chart',
  useBy: ['freePage'],
  properties: [
    {
      name: 'label',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '主标题',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      displayMode: 'tile',
      _showSub: false,
      properties: []
    },
    {
      name: 'subText',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '副标题',
      setterComponentName: 'AInput'
    },
    {
      name: 'hideLabel',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: { checkedText: '' },
      setterComponentVModelName: 'modelValue',
      title: '隐藏标题',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'titleProps',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'collapse',
      setterComponentProps: {},
      setterComponentVModelName: '',
      _showSub: false,
      properties: [
        {
          name: 'left',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              {
                label: '向左对齐',
                value: 'left',
                __gzT7j6K9cmuDFWxySi: 'left'
              },
              { label: '居中对齐', value: 'center', __gzT7j6K9cmuDFWxySi: 'center' },
              {
                label: '向右对齐',
                value: 'right',
                __gzT7j6K9cmuDFWxySi: 'right'
              }
            ],
            allowClear: true
          },
          setterComponentVModelName: 'modelValue',
          title: '水平位置',
          description: "如果 left 的值为 'left', 'center', 'right'，组件会根据相应的位置自动对齐。",
          setterComponentName: 'ASelect',
          setterDefaultValue: 'center'
        },
        {
          name: 'top',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              { label: '向上对齐', value: 'top' },
              {
                label: '居中对齐',
                value: 'middle'
              },
              { label: '向下对齐', value: 'bottom' }
            ],
            allowClear: true
          },
          setterComponentVModelName: 'modelValue',
          title: '垂直位置',
          description: "如果 top 的值为 'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。",
          setterComponentName: 'ASelect'
        },
        {
          name: 'padding',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: { modelValue: [5, 5, 5, 5] },
          setterComponentVModelName: 'modelValue',
          title: '四周边距',
          description:
            '标题内边距，单位px，接受数组分别设定上右下左边距,如：两项时[5, 10]表示上下的内边距为 5，左右的内边距为 10；如四项时[5,10,15,20]表示上5，右10，下15，左20。',
          setterComponentName: 'GlArrayNumberSetter'
        },
        {
          name: 'textAlign',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              { label: '自动', value: 'auto' },
              {
                label: '向左对齐',
                value: 'left'
              },
              { label: '向右对齐', value: 'right' },
              { label: '居中对齐', value: 'center' }
            ],
            multiple: false,
            allowClear: true
          },
          setterComponentVModelName: 'modelValue',
          description: '主副标题之间水平对齐',
          title: '主副水平',
          setterComponentName: 'ASelect'
        },
        {
          name: 'textVerticalAlign',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              { label: '自动', value: 'auto' },
              {
                label: '向上对齐',
                value: 'top'
              },
              { label: '向下对齐', value: 'bottom' },
              { label: '居中对齐', value: 'middle' }
            ],
            allowClear: true
          },
          setterComponentVModelName: 'modelValue',
          description: '主副标题之间垂直对齐',
          title: '主副垂直',
          setterComponentName: 'ASelect'
        },
        {
          name: 'itemGap',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          description: '主副标题之间的间距，默认为10',
          title: '主副间距',
          setterComponentName: 'AInputNumber'
        }
      ],
      title: '标题属性',
      setterComponentName: 'GlSimpleObjectSetter'
    },
    {
      name: 'legend',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'collapse',
      setterComponentProps: {},
      setterComponentVModelName: '',
      _showSub: true,
      properties: [
        {
          name: 'type',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              {
                label: '缺省',
                value: 'plain',
                __pOPPjDFi5MVrbua4E0: 'plain'
              },
              { label: '滚动', value: 'scroll', __pOPPjDFi5MVrbua4E0: 'scroll' }
            ],
            allowClear: true,
            type: 'button'
          },
          setterComponentVModelName: 'modelValue',
          title: '类型',
          setterComponentName: 'ARadioGroup',
          description: '缺省就是普通图例。可滚动翻页的图例，当图例数量较多时可以使用。'
        },
        {
          name: 'show',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: { checkedText: '显示', uncheckedText: '不显示' },
          setterComponentVModelName: 'modelValue',
          title: '显示',
          setterComponentName: 'ASwitch',
          setterDefaultValue: true
        },
        {
          name: 'left',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              {
                label: '向左对齐',
                value: 'left',
                __gzT7j6K9cmuDFWxySi: 'left'
              },
              { label: '居中对齐', value: 'center', __gzT7j6K9cmuDFWxySi: 'center' },
              {
                label: '向右对齐',
                value: 'right',
                __gzT7j6K9cmuDFWxySi: 'right'
              }
            ],
            allowClear: true
          },
          setterComponentVModelName: 'modelValue',
          title: '水平位置',
          description: "如果 left 的值为 'left', 'center', 'right'，组件会根据相应的位置自动对齐。",
          setterComponentName: 'ASelect',
          setterDefaultValue: 'center'
        },
        {
          name: 'top',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            options: [
              { label: '向上对齐', value: 'top' },
              {
                label: '居中对齐',
                value: 'middle'
              },
              { label: '向下对齐', value: 'bottom' }
            ],
            allowClear: true
          },
          setterComponentVModelName: 'modelValue',
          title: '垂直位置',
          description: "如果 top 的值为 'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。",
          setterComponentName: 'ASelect',
          setterDefaultValue: 'bottom'
        },
        {
          name: 'orient',
          setterComponentProps: {
            options: [
              {
                label: '水平',
                value: 'horizontal',
                __g90UueTXqDVZrANX2q: 'horizontal'
              },
              { label: '垂直', value: 'vertical', __g90UueTXqDVZrANX2q: 'vertical' }
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
          title: '布局朝向',
          description: '图例列表的布局朝向',
          setterComponentName: 'ARadioGroup',
        }
      ],
      setterComponentName: 'GlSimpleObjectSetter',
      title: '图例'
    }
  ],
  actions: [
    { name: 'click', title: '点击' },
    {
      eventName: 'onMounted',
      name: 'onMounted',
      description: '组件加载完时触发，和Vue的onMounted一致',
      title: '加载完'
    },
    {
      eventName: 'onUpdated',
      name: 'onUpdated',
      description: '组件更新时触发，和Vue的onUpdated一致',
      title: '更新完'
    }
  ]
}
