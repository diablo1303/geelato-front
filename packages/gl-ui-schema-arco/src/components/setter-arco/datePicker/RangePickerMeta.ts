export default {
  componentName: 'GlRangePicker',
  displayMode: 'tile',
  iconType: 'gl-datePicker',
  group: 'dataEntry',
  title: '日期范围',
  alias: 'dateRange',
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
      setterComponentName: 'AInput',
      enableValueExpress: false,
      displayMode: 'tile'
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
      setterComponentName: 'GlEntityFieldSelect',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'mode',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        options: [
          { label: '年份选择', __LAbgbUsqn9De6YGjw8: 'year', value: 'year' },
          { label: '季度选择', __LAbgbUsqn9De6YGjw8: 'quarter', value: 'quarter' },
          { label: '月份选择', __LAbgbUsqn9De6YGjw8: 'month', value: 'month' },
          { label: '周次选择', __LAbgbUsqn9De6YGjw8: 'week', value: 'week' },
          { label: '日期选择', __LAbgbUsqn9De6YGjw8: 'date', value: 'date' }
        ],
        multiple: false
      },
      setterComponentVModelName: 'modelValue',
      title: '类型',
      description: '范围选择器的类型',
      setterComponentName: 'ASelect',
      setterDefaultValue: 'date'
    },
    {
      name: 'format',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'AInput',
      setterDefaultValue: 'YYYY-MM-DD HH:mm',
      placeholder: 'YYYY-MM-DD HH:mm',
      description: '日期格式：YYYY-MM-DD，日期时间格式：YYYY-MM-DD HH:mm',
      title: '展示格式'
    }
  ],
  actions: [
    { name: 'valueChange', description: '', title: '值改变' ,params: [
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
      ]},
    {
      eventName: 'mounted',
      name: 'mounted',
      description: '组件加载完时触发，和Vue的onMounted一致',
      title: '加载完'
    },
    {
      eventName: 'updated',
      name: 'updated',
      description: '组件更新时触发，和Vue的onUpdated一致',
      title: '更新完'
    }
  ]
}