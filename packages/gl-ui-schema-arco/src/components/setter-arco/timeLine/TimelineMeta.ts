export default {
  componentName: 'GlTimeline',
  displayMode: 'tile',
  iconType: 'gl-timeline',
  group: 'dataDisplay',
  title: '时间轴',
  alias: 'timeline',
  useBy: ['freePage'],
  properties: [
    {
      name: 'direction',
      setterComponentProps: {
        options: [
          {
            label: '水平',
            value: 'horizontal',
            __Giy1pshRB7dz8RhJX0: 'horizontal'
          },
          { label: '垂直', value: 'vertical', __Giy1pshRB7dz8RhJX0: 'vertical' }
        ],
        type: 'radio'
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '方向',
      setterComponentName: 'ARadioGroup',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'mode',
      setterComponentProps: {
        multiple: false,
        options: [
          {
            label: '时间轴在左侧',
            value: 'left',
            __PDA8HRTWN7G6Y4oIOq: 'left'
          },
          { label: '时间轴在右侧', value: 'right', __PDA8HRTWN7G6Y4oIOq: 'right' },
          {
            label: '交替出现',
            value: 'alternate',
            __PDA8HRTWN7G6Y4oIOq: 'alternate'
          },
          { label: '时间轴在上方', value: 'top', __PDA8HRTWN7G6Y4oIOq: 'top' },
          {
            label: '时间轴在下方',
            value: 'bottom',
            __PDA8HRTWN7G6Y4oIOq: 'bottom'
          }
        ],
        allowClear: true
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '展示类型',
      setterComponentName: 'ASelect',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'reverse',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '是否倒序',
      setterComponentName: 'ASwitch',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'pending',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: false,
      expanded: true,
      title: '幽灵节点',
      description: '是否展示幽灵节点，当任务状态正在发生，还在记录过程中，可用幽灵节点来表示当前的时间节点。',
      setterComponentName: 'ASwitch',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'labelPosition',
      setterComponentProps: {
        options: [
          {
            label: '相对',
            value: 'relative',
          },
          { label: '相同', value: 'same'}
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      description: '设置标签文本的位置',
      title: '标签位置',
      setterComponentName: 'ARadioGroup',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'iconSize',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      title: '图标大小',
      placeholder: '3em',
      setterComponentName: 'AInput'
    },
    {
      name: 'dotColor',
      setterComponentProps: {showText:true},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      title: '节点着色',
      setterComponentName: 'GlColor',
      description: '默认地，相关节点的标签文本的值不为空时，为对应节点着色（本属性选择的颜色）；该值可以被具体节点着色设置覆盖。'
    },
    {
      name: 'dotColorRule',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        options: [
          {
            label: '节点标签不为空时着色',
            __iLGzaDrpwr70mFQFRp: 'labelNotEmpty',
            value: 'labelNotEmpty'
          },
          { label: '任何场景都着色', __iLGzaDrpwr70mFQFRp: 'anyScene', value: 'anyScene' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '着色规则',
      setterComponentName: 'ASelect'
    },
    {
      name: 'itemMode',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        options: [
          {
            label: '只采用静态节点数据',
            value: 'static',
            __s6C2T3jKihrJ4BoSjf: 'static'
          },
          {
            label: '只采用动态节点数据',
            value: 'dynamic',
            __s6C2T3jKihrJ4BoSjf: 'dynamic'
          },
          {
            label: '用动态节点更新静态节点',
            value: 'dynamicUpdateStatic',
            __s6C2T3jKihrJ4BoSjf: 'dynamicUpdateStatic'
          }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '节点数据',
      setterComponentName: 'ASelect',
      description: '采用动态节点更新静态节点时，基于数据基于label进行唯一匹配',
      setterDefaultValue: 'dynamic',
      placeholder: ''
    },
    {
      name: 'items',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: '',
      _showSub: false,
      properties: [
        {
          name: 'code',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '编码',
          setterComponentName: 'AInput',
          enableValueExpress: false,
          displayMode: 'tile',
          description: '节点的唯一编码字段，可用作动态节点数据更新静态节点数据的依据'
        },
        {
          name: 'label',
          setterComponentProps: {allowClear:true},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '标签文本',
          setterComponentName: 'AInput',
          enableValueExpress: false,
          displayMode: 'tile',
          placeholder: '如，时间文本'
        },
        {
          name: 'title',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          title: '标题文本',
          setterComponentName: 'AInput'
        },
        {
          name: 'content',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          setterComponentName: 'AInput',
          title: '内容'
        },
        {
          name: 'iconType',
          setterComponentProps: { alwaysEditable: true },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          title: '图标',
          setterComponentName: 'GlIconfontSelect'
        },
        {
          name: 'dotColor',
          setterComponentProps: {showText:true},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '节点颜色',
          setterComponentName: 'GlColor',
          enableValueExpress: true,
          displayMode: 'tile'
        },
        {
          name: 'dotType',
          setterComponentProps: {
            options: [
              {
                label: '空心',
                value: 'hollow',
                __vPVzYlnWANWwkOM3KD: 'hollow'
              },
              { label: '实心', value: 'solid', __vPVzYlnWANWwkOM3KD: 'solid' }
            ],
            allowClear: true
          },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '节点类型',
          setterComponentName: 'ASelect',
          enableValueExpress: false,
          displayMode: 'tile'
        },
        {
          name: 'lineType',
          setterComponentProps: {
            options: [
              {
                label: '实线',
                value: 'solid',
                __xui8bop77MgkDeWIwK: 'solid'
              },
              { label: '虚线', value: 'dashed', __xui8bop77MgkDeWIwK: 'dashed' },
              {
                label: '点状线',
                value: 'dotted',
                __xui8bop77MgkDeWIwK: 'dotted'
              }
            ]
          },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '时间轴类型',
          setterComponentName: 'ASelect',
          enableValueExpress: false,
          displayMode: 'tile'
        },
        {
          name: 'lineColor',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '时间轴颜色',
          setterComponentName: 'GlColor',
          enableValueExpress: true,
          displayMode: 'tile'
        },
        {
          name: 'hide',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '是否隐藏',
          setterComponentName: 'ASwitch',
          enableValueExpress: true,
          displayMode: 'tile'
        }
      ],
      setterComponentName: 'GlObjectArraySetter',
      titleField: 'title',
      subTitleField: 'code',
      alarmIfNoSubTitle: '无编码',
      title: '静态节点',
      description: '若配置了静态节点，则动态节点无效'
    },
    {
      name: 'entityReader',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        options: [
          {
            label: '编码',
            value: 'code',
            __M8Aj4EpkpBOPtGPFaA: 'code'
          },
          { label: '标签', value: 'label', __M8Aj4EpkpBOPtGPFaA: 'label' },
          {
            label: '子标签',
            value: 'title',
            __M8Aj4EpkpBOPtGPFaA: 'title'
          },
          { label: '内容', value: 'content', __M8Aj4EpkpBOPtGPFaA: 'content' },
          {
            label: '图标',
            value: 'iconType',
            __M8Aj4EpkpBOPtGPFaA: 'iconType'
          },
          { label: '节点颜色', value: 'dotColor', __M8Aj4EpkpBOPtGPFaA: 'dotColor' },
          {
            label: '节点类型',
            value: 'dotType',
            __M8Aj4EpkpBOPtGPFaA: 'dotType'
          },
          { label: '连线类型', value: 'lineType', __M8Aj4EpkpBOPtGPFaA: 'lineType' },
          {
            label: '连线颜色',
            value: 'lineColor',
            __M8Aj4EpkpBOPtGPFaA: 'lineColor'
          }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '动态节点',
      setterComponentName: 'GlEntityReaderSetter',
      description: '从服务端动态加载节点'
    }
  ],
  actions: [
    { name: 'onItemClick', title: '点击节点', description: '参数1节点item，参数2节点index' }
  ],
  methods: [{ name: 'fetchData', title: '获取数据' }]
}
