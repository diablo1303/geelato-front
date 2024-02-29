export default {
  componentName: 'GlEntityTablePlus',
  displayMode: 'collapse',
  iconType: 'gl-table',
  group: 'dataDisplay',
  title: '表格',
  useBy: ['freePage'],
  alias: 'table',
  properties: [
    {
      name: 'base',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: '',
      _showSub: false,
      properties: [
        {
          name: 'label',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          _showSub: false,
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
          name: 'entityName',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '绑定数据源',
          setterComponentName: 'GlEntitySelect'
        },
        {
          name: 'isFormSubTable',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {
            type: 'button',
            options: [{ label: '关联的子表', value: 'subTable' }, { label: '独立的查询列表' }]
          },
          setterComponentVModelName: 'modelValue',
          title: '是否为子表',
          setterComponentName: 'ASwitch',
          description:
            '表格类型是否为子表，若是，在保存表单时，需会同构建保存该表的内容，常用于主表关联已存在的子表记录；选是时，会出一列：记录状态，用于标记数据行的状态。',
          setterDefaultValue: false
        },
        {
          name: 'showQuery',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: { defaultChecked: true },
          setterComponentVModelName: 'modelValue',
          title: '显示查询',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'hideReset',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '隐藏重置',
          description: '隐藏查询条件的重置按钮',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'triggerByValueChange',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            checkedText: '查询条件值改变即刻触发',
            uncheckedText: '查询条件值改变时不触发'
          },
          setterComponentVModelName: 'modelValue',
          title: '改值查询',
          setterComponentName: 'ASwitch',
          setterDefaultValue: true,
          description: '为了优化查询，可以控制在什么条件下触发'
        },
        {
          name: 'triggerByInit',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            checkedText: '组件初始后即刻查询',
            uncheckedText: '组件初始后不查询'
          },
          setterComponentVModelName: 'modelValue',
          title: '初始查询 ',
          description: '在组件初始加载之后触发查询，可控制查询时机，减少不必要的查询',
          setterComponentName: 'ASwitch',
          setterDefaultValue: true
        },
        {
          name: 'showToolbar',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: { defaultChecked: true },
          setterComponentVModelName: 'modelValue',
          title: '显示工具条',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'showPagination',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '显示分页',
          setterComponentName: 'ASwitch',
          setterDefaultValue: true,
          description: '如果为显示时，可以在分页专项配置中进行详细配置；如果为否，则不显示'
        },
        {
          name: 'tablePadding',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          title: '外框间距',
          setterComponentName: 'AInput',
          placeholder: '如：0px、8px'
        },
        {
          name: 'enableEdit',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: false,
          expanded: true,
          title: '启用表格编辑',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'showSeqNo',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '显示序号',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'leftFixedCount',
          setterComponentProps: {
            options: [
              { label: '0', value: '0', __G12mDt0WMK0DpquHK1: '0' },
              { label: '1', value: '1', __G12mDt0WMK0DpquHK1: '1' },
              { label: '2', value: '2', __G12mDt0WMK0DpquHK1: '2' },
              { label: '3', value: '3', __G12mDt0WMK0DpquHK1: '3' }
            ],
            type: 'button'
          },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: false,
          expanded: true,
          title: '左侧冻结列数',
          setterComponentName: 'ARadioGroup'
        },
        {
          name: 'checkType',
          setterComponentProps: {
            type: 'button',
            options: [
              { label: '无', value: 'null', __xJvT8pskAbMdRLoi7C: 'null' },
              { label: '单选', value: 'radio', __xJvT8pskAbMdRLoi7C: 'radio' },
              { label: '复选', value: 'checkbox', __xJvT8pskAbMdRLoi7C: 'checkbox' }
            ]
          },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          title: '选择类型',
          setterComponentName: 'ARadioGroup'
        },
        {
          name: 'showCheckAll',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '显示全选',
          setterComponentName: 'ASwitch',
          description: '该属性在选择类型为复选时有效'
        },
        {
          name: 'clickAsCheck',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '点击选中行',
          setterComponentName: 'ASwitch',
          description: '点击单元格时，选中该行，方便选中一行数据。'
        }
      ],
      title: '总体设置',
      setterComponentName: 'GlSimpleObjectSetter'
    },
    {
      name: 'query',
      setterComponentProps: {},
      setterComponentVModelName: '',
      group: 'base',
      type: 'props',
      title: '查询条件',
      _showSub: false,
      properties: [
        {
          name: 'component',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          setterComponentName: 'GlComponentSelect',
          title: '选择组件',
          show: true,
          expanded: true,
          enableValueExpress: false,
          _showSub: false
        },
        {
          name: 'cop',
          setterComponentProps: {
            mode: 'SECRET_COMBOBOX_MODE_DO_NOT_USE',
            options: [
              { label: '等于', value: 'eq', __sIGch6bIhRKB7cNZod: 'eq' },
              { label: '不等于', value: 'neq', __sIGch6bIhRKB7cNZod: 'neq' },
              { label: '小于', value: 'lt', __sIGch6bIhRKB7cNZod: 'lt' },
              { label: '小于等于', value: 'lte', __sIGch6bIhRKB7cNZod: 'lte' },
              { label: '大于', value: 'gt', __sIGch6bIhRKB7cNZod: 'gt' },
              { label: '大于等于', value: 'gte', __sIGch6bIhRKB7cNZod: 'gte' },
              { label: '开头包括', value: 'sw', __sIGch6bIhRKB7cNZod: 'sw' },
              { label: '结尾包括', value: 'ew', __sIGch6bIhRKB7cNZod: 'ew' },
              { label: '包括', value: 'contains', __sIGch6bIhRKB7cNZod: 'contains' },
              { label: '在数组范围(in)', value: 'in' },
              { label: '不在数组范围(not in)', value: 'nin' },
              { label: '在...两值之间(between)', value: 'bt' },
              { label: '是否空', value: 'nil' }
            ],
            buttonStyle: 'solid'
          },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          title: '值比较',
          setterComponentName: 'ASelect',
          show: true,
          expanded: true,
          enableValueExpress: false
        },
        {
          name: 'colspan',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          setterDefaultValue: 6,
          group: 'base',
          type: 'props',
          setterComponentName: 'AInputNumber',
          title: '宽度',
          description: '24个单位为一行，一般填写6个单位，即一行4个组件',
          show: true,
          expanded: true,
          enableValueExpress: false
        },
        {
          name: 'isAdvanceQuery',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          title: '高级查询',
          expanded: true,
          setterComponentName: 'ASwitch',
          show: true,
          enableValueExpress: false
        },
        {
          name: 'groupName',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          title: '分组名称',
          description:
            '非必填，将该条件加到某一分组中，在同一分组中的条件会用括号()组合，默认括号()内的条件为or关系',
          expanded: true,
          setterComponentName: 'AInput',
          show: true,
          enableValueExpress: false
        }
      ],
      setterComponentName: 'GlObjectArraySetter',
      show: true,
      expanded: false,
      titleField: 'component.props.label',
      enableValueExpress: false,
      subTitleField: 'component.props.bindField.fieldName',
      alarmIfNoSubTitle: '无字段'
    },
    {
      name: 'toolbar',
      setterComponentProps: {},
      setterComponentVModelName: '',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      _showSub: false,
      properties: [
        {
          name: 'leftItems',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          _showSub: false,
          properties: [],
          setterComponentName: 'GlArrayComponentSetter',
          titleField: 'componentName',
          title: '左边组件'
        },
        {
          name: 'rightItems',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          _showSub: true,
          properties: [],
          title: '右边组件',
          setterComponentName: 'GlArrayComponentSetter',
          titleField: ''
        },
        {
          name: 'leftColSpan',
          setterComponentProps: { defaultValue: 12 },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '左栅格数',
          setterComponentName: 'AInputNumber',
          placeholder: '12',
          description: '一行按24栅格划分，占的栅格数'
        },
        {
          name: 'rightColSpan',
          setterComponentProps: { defaultValue: 12 },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '右栅格数',
          placeholder: '12',
          setterComponentName: 'AInputNumber',
          description: '一行按24栅格划分，占的栅格数'
        }
      ],
      title: '工具条',
      setterComponentName: 'GlSimpleObjectSetter',
      titleField: 'title',
      subTitleField: 'name',
      alarmIfNoSubTitle: '未设置',
      enableValueExpress: false
    },
    {
      name: 'columns',
      setterComponentProps: {},
      setterComponentVModelName: '',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      _showSub: false,
      properties: [
        {
          name: 'dataIndex',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '绑定字段',
          setterComponentName: 'GlFieldSelect'
        },
        {
          name: 'title',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '字段标题',
          setterComponentName: 'AInput',
          enableValueExpress: false
        },
        {
          name: '_show',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          setterComponentProps: { defaultChecked: true },
          setterComponentVModelName: 'modelValue',
          title: '是否显示',
          setterComponentName: 'ASwitch'
        },
        {
          name: '_renderScript',
          setterComponentProps: { showInput: true },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          description:
            "对字段值进行处理，示例：\"$gl.ctx.record.enableStatus == 1 ? '已启用' : '未启用'\"。",
          title: '显示脚本',
          setterComponentName: 'GlExpressionSetter',
          enableValueExpress: false
        },
        {
          name: '_component',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '显示组件',
          description: '一般不需选，显示为文本，若需显示为图片等格式时，需选择。',
          setterComponentName: 'GlComponentSelect'
        },
        {
          name: 'sortable',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: '',
          _showSub: false,
          properties: [
            {
              name: 'sortDirections',
              group: 'base',
              type: 'props',
              enableValueExpress: false,
              show: true,
              expanded: true,
              setterComponentProps: {
                options: [
                  { label: '升序', value: 'ascend', __tIT53h6CwaIY5gI5Tg: 'ascend' },
                  { label: '降序', value: 'descend', __tIT53h6CwaIY5gI5Tg: 'descend' }
                ],
                multiple: true
              },
              setterComponentVModelName: 'modelValue',
              title: '方向',
              setterComponentName: 'ASelect'
            },
            {
              name: 'defaultSortOrder',
              group: 'base',
              type: 'props',
              enableValueExpress: false,
              show: true,
              expanded: true,
              displayMode: 'tile',
              setterComponentProps: {
                options: [
                  { label: '升序', value: 'ascend' },
                  { label: '降序', value: 'descend' },
                  { label: '无', value: '' }
                ]
              },
              setterComponentVModelName: 'modelValue',
              title: '初始方向',
              setterComponentName: 'ASelect'
            }
          ],
          setterComponentName: 'GlSimpleObjectSetter',
          title: '排序'
        },
        {
          name: 'align',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {
            type: 'button',
            options: [
              { label: '左', value: 'left' },
              { label: '中', value: 'center' },
              { label: '右', value: 'right' }
            ]
          },
          setterComponentVModelName: 'modelValue',
          title: '对齐方向',
          setterComponentName: 'ARadioGroup'
        },
        {
          name: 'fixed',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {
            type: 'button',
            options: [
              { label: '左', value: 'left' },
              { label: '右', value: 'right' },
              { label: '无', value: '' }
            ]
          },
          setterComponentVModelName: 'modelValue',
          title: '固定位置',
          setterComponentName: 'ARadioGroup'
        },
        {
          name: 'width',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '宽度',
          setterComponentName: 'AInputNumber',
          placeholder: '单位象素(px)'
        },
        {
          name: 'ellipsis',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '文本省略',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'tooltip',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '文本提示',
          setterComponentName: 'ASwitch'
        }
      ],
      setterComponentName: 'GlObjectArraySetter',
      title: '数据列',
      titleField: 'title',
      subTitleField: 'dataIndex',
      alarmIfNoSubTitle: '无字段',
      enableValueExpress: false
    },
    {
      name: 'columnActions',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      _showSub: false,
      properties: [],
      setterComponentName: 'GlArrayComponentSetter',
      title: '操作列',
      enableValueExpress: false
    },
    {
      name: 'pagination',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: false,
      displayMode: 'collapse',
      setterComponentProps: {},
      setterComponentVModelName: '',
      _showSub: true,
      properties: [
        {
          name: 'current',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          description: '当前显示第几页',
          title: '当前的页数',
          setterComponentName: 'AInputNumber',
          setterDefaultValue: 1
        },
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
          setterComponentName: 'AInputNumber',
          setterDefaultValue: 15
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
          setterComponentName: 'ASwitch',
          setterDefaultValue: true
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
          setterComponentName: 'ASwitch',
          setterDefaultValue: true
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
              { label: 'mini', value: 'mini', __vOdVHUjHXCUl38OBhY: 'mini' },
              { label: 'small', value: 'small', __vOdVHUjHXCUl38OBhY: 'small' },
              { label: 'medium', value: 'medium', __vOdVHUjHXCUl38OBhY: 'medium' },
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
      setterComponentName: 'GlSimpleObjectSetter',
      title: '分页'
    }
  ],
  actions: [
    {
      name: 'fetchSuccess',
      title: '成功加载完数据',
      description: '从服务端成功加数据（0到多条）后触发。'
    },
    {
      name: 'creatingEntitySavers',
      description: '完成实体保存对象创建之后，关闭创建方法前调用，例于对实体保存对象进行处理。',
      title: '保存对象完成前'
    },
    {
      name: 'changeRecord',
      title: '行记录(内容)更改',
      description: '在数据表的行内编辑模式下，当数据表的行记录信息更换时触发'
    },
    { name: 'select', title: '点击行选择器', description: '点击行选择器时触发' },
    { name: 'cellClick', title: '点击单元格', description: '点击单元格时触发' },
    { name: 'rowClick', title: '点击行数据', description: '点击行数据时触发' },
    { name: 'cellDblclick', title: '双击单元格', description: '双击单元格时触发' },
    { name: 'rowDblclick', title: '双击行数据', description: '双击行数据时触发' },
    { name: 'cellContextmenu', title: '右击单元格', description: '右击单元格时触发' },
    { name: 'rowContextmenu', title: '右击行数据', description: '右击行数据时触发' },
    { name: 'headerClick', title: '点击表头数据', description: '点击表头数据时触发' },
    { name: 'filterClick', title: '点击过滤器', description: '点击过滤器时触发' },
    { name: 'columnResize', title: '调整列宽', description: '调整列宽时触发' },
    { name: 'pushRecords', title: '给列表引用增加记录', description: '给列表引用增加记录时触发' },
    { name: 'unPushRecords', title: '移除列表引用记录', description: '移除列表引用记录时触发' },
    {
      name: 'pushOrUnPushRecords',
      title: '添加或移除列表引用记录',
      description: '添加或移除列表引用记录时触发'
    }
  ],
  methods: [
    { name: 'refresh', title: '刷新', description: '刷新表格', params: [] },
    {
      name: 'getRenderRecords',
      title: '获取页面展示的记录',
      description: '获取当前列表页面展示的记录，返回记录数据组,没记录时返回空数组[]。',
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
    },
    {
      name: 'getSelectedRecords',
      title: '获取已选的记录',
      description: '获取已选的记录，返回记录数据组,没记录时返回空数组[]。',
      params: []
    },
    {
      name: 'getSelectedKeys',
      title: '获取已选的记录keys',
      description: '获取已选的记录keys，返回记录数据组,没记录时返回空数组[]。',
      params: []
    },
    {
      name: 'getPushedRecords',
      title: '获取通过外部添加进来的记录',
      description:
        '获取通过外部添加进来的记录，用于作为子列表，打开页面选择记录进来的场景，返回记录数据组,没记录时返回空数组[]。',
      params: []
    },
    {
      name: 'getPushedRecordKeys',
      title: '获取通过外部添加进来的记录keys(ids)',
      description: '获取通过外部添加进来的记录keys(ids)，返回记录数据组,没记录时返回空数组[]。',
      params: []
    },
    {
      name: 'getFirstSelectedRecord',
      title: '获取已选第一条记录',
      description: '获取已选第一条记录,没记录时返回空对象{}。',
      params: []
    },
    {
      name: 'getLastSelectedRecord',
      title: '获取已选最后一条记录',
      description: '获取已选最后一条记录,没记录时返回空对象{}。',
      params: []
    },
    {
      name: 'getSelectedEntitySavers',
      title: '获取已选记录的实体保存对象',
      description: '获取已选记录的实体保存对象，返回{error:boolean,values:EntitySaver[]}',
      params: []
    },
    {
      name: 'getColumnSum',
      title: '获取单个列的求和',
      description: '获取多个列的求和,输入参数“{dataIndex:列名1}”，返回数值',
      params: [
        {
          name: 'dataIndex',
          title: '字段名',
          required: true,
          type: 'string',
          description: '需要求和的字段名称'
        }
      ]
    },
    {
      name: 'getColumnsSum',
      title: '获取多个列的求和',
      description:
        '获取多个列的求和,输入参数[{dataIndex:列名1},{dataIndex:列名2}]，返回{列名1:值1,列名2:值2}',
      params: [
        {
          name: 'dataIndexes',
          title: '字段名数组',
          required: true,
          type: 'string[]',
          description: '需要求和的字段名数组'
        }
      ]
    },
    {
      name: 'getColumnJoin',
      title: '获取列值拼接字符串',
      description: '获取列值拼接字符串，空值被排除,输入参数"{dataIndex:列名1}"，返回“值1,值2”',
      params: [
        {
          name: 'dataIndex',
          title: '字段名',
          required: true,
          type: 'string',
          description: '需要拼接的字段名称'
        },
        {
          name: 'separator',
          title: '字段值分隔符',
          required: false,
          type: 'string',
          description: '字段值分隔符，默认为“,”'
        }
      ]
    },
    {
      name: 'getColumnGroupSum',
      title: '分组求和',
      description:
        '分组求和，输入参数[{groupDataIndex:列名1},{sumDataIndex:列名2}],返回{groupName1:value1,groupName2:value2}',
      params: [
        {
          name: 'groupDataIndex',
          title: '分组字段名',
          required: true,
          type: 'string',
          description: ''
        },
        {
          name: 'sumDataIndex',
          title: '求和字段名',
          required: true,
          type: 'string',
          description: ''
        }
      ]
    },
    {
      name: 'pushRecordsByKeys',
      title: '基于ids给列表前端页面添加记录',
      description:
        '给列表添加ids作为or查询条件，以查询出相应的记录在前端进行展示，可用于后续的保存记录当前新添加的记录和主表单的关系。',
      params: [
        {
          name: 'keys',
          title: '记录ids',
          required: true,
          type: 'string[]',
          description: 'id数组'
        }
      ]
    },
    {
      name: 'pushSelectedRecords',
      title: '添加已选的记录',
      description:
        '添加已选的记录，这些记录可能是刚加入前端页面还未保存的，也可能是之前已保存的记录。',
      params: []
    },
    {
      name: 'unPushRecordsByKeys',
      title: '基于ids移除列表前端页面的记录',
      description:
        '基于ids移除列表前端页面的记录，这些记录可能是刚加入前端页面还未保存的，也可能是之前已保存的记录。',
      params: [
        {
          name: 'keys',
          title: '记录ids',
          required: true,
          type: 'string[]',
          description: 'id数组'
        }
      ]
    },
    {
      name: 'unPushSelectedRecords',
      title: '移除已选的记录',
      description:
        '移除已选的记录，这些记录可能是刚加入前端页面还未保存的，也可能是之前已保存的记录。',
      params: []
    },
    {
      name: 'hasSelectedRecords',
      title: '是否选择了记录',
      description: '是否选择了记录，返回true | false',
      params: [
        {
          name: 'enableAlert',
          title: '启用告警提醒',
          required: false,
          type: 'boolean',
          description: '若启用的话，返回值为false时，会弹出告警信息'
        },
        {
          name: 'content',
          title: '告警提醒的内容',
          required: false,
          type: 'string',
          description: '启用告警提醒时才生效，默认为“请先选择记录”'
        }
      ]
    },
    {
      name: 'hasUnSaveRecords',
      title: '是否有未保存的记录',
      description: '如果对表做了push或unPush操作，未保存时，返回true，否则返回false',
      params: []
    },
    {
      name: 'hasRenderRecords',
      title: '是否有展示的记录',
      description: '是否有展示的记录',
      params: []
    },
    {
      name: 'changeColumnsVisible',
      title: '展示/隐藏列',
      description: '更改列的展示/隐藏属性，不指定的列保持原状。',
      params: [
        {
          name: 'hideDataIndexes',
          title: '需隐藏的字段',
          required: true,
          type: 'string[]',
          description: '需隐藏的字段名数组'
        },
        {
          name: 'showDataIndexes',
          title: '需显示的字段',
          required: true,
          type: 'string[]',
          description: '若字段为隐藏，则会被设置为可见；若为其它状态则不保持现状'
        }
      ]
    },
    {
      name: 'batchUpdate',
      title: '批量更新所选',
      description: '批量更新表格的记录值，需要输入对象参数，更新的列键值对',
      params: [
        {
          name: 'record',
          title: '需更新的字段值',
          required: true,
          type: 'Record<string, any>',
          description:
            '需更新的记录字段及值信息，key为字段名，即列名,value为更新后的列值，如{orderNo:“912881”}'
        }
      ]
    },
    {
      name: 'updateRecord',
      title: '更新单条记录',
      description:
        '更新表格的指定一条记录，需要输传递需更新的记录record，该记录需要有id值。在表格行操作中，值示例：$gl.ctx.record',
      params: [
        {
          name: 'record',
          title: '需更新的记录值',
          required: true,
          type: 'Record<string, any>',
          description:
            '需更新的记录字段及值信息，key为字段名，即列名,value为更新后的列值，如{id:"xxx",orderNo:“912881”},【注意】该记录需有id字段，为作更新的依据。'
        }
      ]
    },
    {
      name: 'deleteRecord',
      title: '删除一行记录（基于ID）',
      params: [
        {
          name: 'id',
          type: 'string',
          description: '在表格行操作中，值示例：$gl.ctx.record.id',
          title: '记录ID',
          defaultValue: ''
        }
      ]
    },
    {
      name: 'deleteRecordWithConfirm',
      title: '删除一行记录（基于ID）,带删除确认提醒',
      params: [
        {
          name: 'id',
          type: 'string',
          description: '带删除确认提醒，在表格行操作中，值示例：$gl.ctx.record.id',
          title: '记录ID',
          defaultValue: ''
        }
      ]
    },
    {
      name: 'deleteSelectedRecords',
      title: '删除选择的记录（基于ID）',
      params: []
    },
    {
      name: 'deleteSelectedRecordsWithConfirm',
      title: '删除选择的记录（基于ID）,带删除确认提醒',
      params: []
    }
  ]
}
