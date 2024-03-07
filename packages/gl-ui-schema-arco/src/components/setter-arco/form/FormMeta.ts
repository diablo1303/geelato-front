export default {
  componentName: 'GlEntityForm',
  displayMode: 'tile',
  iconType: 'gl-form',
  group: 'dataEntry',
  title: '实体表单',
  alias: 'form',
  useBy: ['freePage'],
  properties: [
    {
      expanded: true,
      style: '',
      name: 'label',
      title: '标题',
      group: 'base',
      placeholder: '',
      description: '标题',
      setterComponentName: 'AInput',
      setterComponentVModelName: 'modelValue',
      setterComponentProps: {},
      type: 'props',
      show: true,
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'bindEntity',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '绑定实体',
      setterComponentName: 'GlAppEntitySelect',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'immediate',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterDefaultValue: true,
      setterComponentVModelName: 'modelValue',
      title: '立即加载',
      setterComponentName: 'ASwitch',
      description:
        '默认立即从服务端中加载数据，若选择为否，则打开表单时，不从服务端加载表单数据，一般是用于由外部传参数并填充表单的场景'
    },
    {
      name: 'isSubForm',
      setterComponentProps: { checkedText: '子表单', uncheckedText: '非子表单' },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      title: '作为子表单',
      setterComponentName: 'ASwitch',
      description:
        '类型作为子表单，若是，在保存主表单时，需会同构建该子表单的内容作为关联子项进行保存，需与“主表单ID字段”一起使用。'
    },
    {
      name: 'subFormPidName',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '关联主表单ID',
      description: '子表单中，对应主表单主键ID的字段，需与“作为子表单”一起使用。',
      setterComponentName: 'GlFieldSelect'
    },
    {
      name: 'layout',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        type: 'button',
        options: [
          { label: '水平', value: 'horizontal' },
          {
            label: '垂直',
            value: 'vertical'
          },
          { label: '行内', value: 'inline' }
        ],
        defaultValue: 'horizontal'
      },
      setterComponentVModelName: 'modelValue',
      title: '表单布局',
      setterComponentName: 'ARadioGroup'
    },
    {
      name: 'autoLabelWidth',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '自动标签宽',
      setterComponentName: 'ASwitch',
      description: '设置 auto-label-width 开启自动标签宽度。仅在 layout="horizontal" 布局下生效。'
    },
    {
      name: '_valueExpression',
      setterComponentProps: { showInput: true },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '默认值',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      description: '基于表达式计算默认值'
    },
    {
      name: '_labelColFlex',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '标题宽度',
      setterComponentName: 'AInput',
      description: '标题的宽度，默认的标题占比20%（精确值应为20.83%，这里需填整数去掉.83）',
      placeholder: '如：6% 或 100px'
    },
    {
      name: 'placeholder',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '占位提示',
      setterComponentName: 'AInput',
      enableValueExpress: true
    },
    {
      name: 'description',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '描述',
      setterComponentName: 'AInput',
      enableValueExpress: true
    },
    {
      name: 'alarmWhenReadInRuntime',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        uncheckedText: '表单只读未传id时不提醒',
        checkedText: '表单只读未传id时提醒'
      },
      setterComponentVModelName: 'modelValue',
      title: '告警提醒',
      description:
        '在表单为只读状态时，若未传相应的表单id，是否告警提醒；默认为否，在开发调试阶段可以配置为true，便于及时发现问题（如漏了传表单id）',
      setterComponentName: 'ASwitch'
    }
  ],
  actions: [
    {
      name: 'onLoadedData',
      description: '表单加载完成数据并设置到各表单项之后触发,可以在此事件之后进一步设置组件的值。',
      title: '加载完数据并更新到页面'
    },
    {
      name: 'creatingEntitySavers',
      description: '完成实体保存对象创建之后（表单验证已通过），关闭创建方法前调用，例于对实体保存对象进行处理。',
      title: '保存对象完成前'
    }
  ],
  methods: [
    { name: 'submitForm', title: '提交表单', description: '', params: [] },
    {
      name: 'getValue',
      title: '获取表单值',
      description: "获取表单值对象，如：{id,'xx',name:'xxx'}",
      params: []
    },
    {
      name: 'getEntitySavers',
      title: '获取实体保存对象',
      description: '获取实体保存对象',
      params: [],
      returnInfo: {
        returnType: 'GetEntitySaversResult',
        description: 'GetEntitySaversResult的格式：{error:boolean,values:EntitySaver[]}',
        docId: '4919301630853255168'
      }
    }
  ]
}
