export default {
  componentName: 'GlEntityTableSub',
  displayMode: 'collapse',
  iconType: 'gl-table',
  group: 'dataEntry',
  title: '子表单',
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
          name: 'bordered',
          setterComponentProps: { defaultValue: true },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '带边框',
          setterComponentName: 'ASwitch'
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
          name: 'hoverable',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '悬浮样式',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'size',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          setterComponentProps: {
            type: 'button',
            defaultValue: 'medium',
            options: [
              { label: '一般', v_L0IeSNWMqjSZkU4L: 'medium', value: 'medium' },
              {
                label: '小',
                v_L0IeSNWMqjSZkU4L: 'small',
                value: 'small'
              }
            ]
          },
          setterComponentVModelName: 'modelValue',
          title: '大小',
          setterComponentName: 'ARadioGroup',
          setterDefaultValue: 'small'
        },
        {
          name: 'isFormSubTable',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: false,
          expanded: true,
          setterComponentProps: {
            type: 'button',
            options: [{ label: '子表', value: 'subTable' }, { label: '普通表单' }]
          },
          setterComponentVModelName: 'modelValue',
          title: '是否为子表',
          setterComponentName: 'ASwitch',
          description: '表格类型是否为子表，若是，在保存表单时，需会同构建保存该表的内容，并会依据“关联主表字段”的配置，自动设置关联字段值等于主表Id的值',
          setterDefaultValue: true
        },
        {
          name: 'subTablePidName',
          setterComponentProps: {
            ignoreFields: ['id','creator','creatorName','createAt','updateAt','updater','updaterName','delStatus','deleteAt'],
          },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          title: '关联主表字段',
          description: '本表中指向主表单主键id字段（值相同）。如pId、billId、orderId、nodeId等指向主表的字段，注意这里不能选择id字段，id字段是本表的主键。',
          setterComponentName: 'GlFieldSelect'
        },
        {
          name: 'showQuery',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: false,
          expanded: true,
          setterComponentProps: { defaultChecked: true },
          setterComponentVModelName: 'modelValue',
          title: '显示查询',
          setterComponentName: 'ASwitch',
          _showSub: false,
          setterDefaultValue: false
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
          enableValueExpress: true,
          show: true,
          expanded: true,
          setterComponentProps: { defaultChecked: true },
          setterComponentVModelName: 'modelValue',
          title: '显示工具条',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'showAddRowBtn',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          setterComponentProps: { defaultChecked: true },
          setterComponentVModelName: 'modelValue',
          title: '显示添加一行',
          setterComponentName: 'ASwitch'
        },
        {
          name: 'showActionCopy',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          setterComponentProps: { defaultChecked: true },
          setterComponentVModelName: 'modelValue',
          title: '显示复制操作',
          setterComponentName: 'ASwitch',
          description: '复制一行数据，并插入，若需在插入前对复制的数据进行修改，可以在动作中添加脚本指令'
        },
        {
          name: 'showActionDelete',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          setterComponentProps: { defaultChecked: true },
          setterComponentVModelName: 'modelValue',
          title: '显示删除操作',
          setterComponentName: 'ASwitch',
          description: '点该删除操作，将标记删除该记录，并从前端列表中删除，在整个主表单保存到服务端时，才从数据库中删除该记录，注意不同于解除操作，如果显示删除操作，不需要显示解除操作。'
        },
        {
          name: 'showActionRelease',
          group: 'base',
          type: 'props',
          enableValueExpress: true,
          show: true,
          expanded: true,
          setterComponentProps: { defaultChecked: false },
          setterComponentVModelName: 'modelValue',
          title: '显示解除操作',
          setterComponentName: 'ASwitch',
          description: '点该解除操作，将标记解除该记录，并从前端列表中删除，在整个主表单保存到服务端时，才从数据库中解除该记录与主表单的关系，但本记录不会删除；常用于管理与主表的引用关系，但不能删除数据的场景。'
        },
        {
          name: 'showPagination',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps:  { defaultChecked: true },
          setterComponentVModelName: 'modelValue',
          title: '显示分页',
          setterComponentName: 'ASwitch'
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
          setterComponentName: 'ASwitch',
          setterDefaultValue: true
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
          setterComponentName: 'ASwitch',
          setterDefaultValue: true
        },
        {
          name: 'checkType',
          setterComponentProps: {
            type: 'button',
            options: [
              { label: '无', value: 'null', __xJvT8pskAbMdRLoi7C: 'null' },
              {
                label: '单选',
                value: 'radio',
                __xJvT8pskAbMdRLoi7C: 'radio'
              },
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
          name: 'leftFixedCount',
          setterComponentProps: {
            options: [
              {
                label: '0',
                value: '0',
                __G12mDt0WMK0DpquHK1: '0'
              },
              { label: '1', value: '1', __G12mDt0WMK0DpquHK1: '1' },
              {
                label: '2',
                value: '2',
                __G12mDt0WMK0DpquHK1: '2'
              },
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
          name: 'isRowReadonlyExpression',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {showInput:true},
          setterComponentVModelName: 'modelValue',
          title: '行只读',
          setterComponentName: 'GlExpressionSetter',
          description:
            '控制行是否只讯的表达式，如该行数据已审批或审批中，则不可以进行编辑。表达式的结果为true，表示相应行只读，否则表示行可编辑。' +
            '在本表达式中，可以使用行上线文$gl.ctx.record进行计算，如表达式为：$gl.ctx.record.status==="2"，意思为状态为“2”时，整行只读'
        },
        {
          name: 'tableDraggable',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '启用行拖动',
          setterComponentName: 'ASwitch',
          description: ''
        },
        {
          name: 'autoResetSeqNoAfterDrag',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '拖动自动排序',
          setterComponentName: 'ASwitch',
          description:
            '启用行拖动为true才生效，当行拖动行之后，自动重新设置排序号字段SeqNo的值，从1开始排序。'
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
              {
                label: '不等于',
                value: 'neq',
                __sIGch6bIhRKB7cNZod: 'neq'
              },
              { label: '小于', value: 'lt', __sIGch6bIhRKB7cNZod: 'lt' },
              {
                label: '小于等于',
                value: 'lte',
                __sIGch6bIhRKB7cNZod: 'lte'
              },
              { label: '大于', value: 'gt', __sIGch6bIhRKB7cNZod: 'gt' },
              {
                label: '大于等于',
                value: 'gte',
                __sIGch6bIhRKB7cNZod: 'gte'
              },
              { label: '开头包括', value: 'sw', __sIGch6bIhRKB7cNZod: 'sw' },
              {
                label: '结尾包括',
                value: 'ew',
                __sIGch6bIhRKB7cNZod: 'ew'
              },
              { label: '包括', value: 'contains', __sIGch6bIhRKB7cNZod: 'contains' }
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
      expanded: false,
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
      titleField: '',
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
      _showSub: true,
      properties: [
        {
          name: '_component',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '编辑组件',
          setterComponentName: 'GlComponentSelect',
          placeholder: '',
          description: '若表格启用编辑，则该列选择此组件进行编辑；若该表格不需编辑，则可不选。',
          enableValueExpress: false,
          _showSub: true
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
                  {
                    label: '升序',
                    value: 'ascend',
                    __tIT53h6CwaIY5gI5Tg: 'ascend'
                  },
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
        }
      ],
      setterComponentName: 'GlObjectArraySetter',
      title: '数据列',
      titleField: '_component.props.label',
      subTitleField: '_component.props.bindField.fieldName',
      enableValueExpress: false,
      alarmIfNoSubTitle: '无字段'
    },
    {
      name: 'pagination',
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
          name: 'current',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: false,
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
          setterDefaultValue: 1000
        },
        {
          name: 'hideOnSinglePage',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: false,
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
          show: false,
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
          show: false,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          description: '是否显示数据总数',
          title: '显示总数',
          setterComponentName: 'ASwitch',
          setterDefaultValue: false
        },
        {
          name: 'showMore',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: false,
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
          show: false,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          description: '是否显示跳转',
          title: '显示跳转',
          setterComponentName: 'ASwitch',
          setterDefaultValue: false
        },
        {
          name: 'showPageSize',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: false,
          expanded: true,
          displayMode: 'tile',
          setterComponentProps: {
            checkedText: '显示数据条数选择器',
            uncheckedText: '不显示数据条数选择器'
          },
          setterComponentVModelName: 'modelValue',
          description: '是否显示数据条数选择器',
          title: '记录选择器',
          setterComponentName: 'ASwitch',
          setterDefaultValue:true
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
          setterDefaultValue: [1000],
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
          show: false,
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
          show: false,
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
      name: 'readonly',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: false,
      title: '只读',
      setterComponentName: 'ASwitch',
      enableValueExpress: true
    },
    {
      name: '_hidden',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: false,
      title: '隐藏',
      description: '页面中存在该组件，只是不可见',
      setterComponentName: 'ASwitch',
      enableValueExpress: true
    },
    {
      name: 'unRender',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: false,
      title: '不渲染',
      description: '页面中不存在该组件，不渲染，不可见，一般是为了提高性能在一些场景下不渲染。',
      setterComponentName: 'ASwitch',
      enableValueExpress: true
    }
  ],
  actions: [
    {
      name: 'fetchSuccess',
      title: '成功加载完数据',
      description: '从服务端成功加数据（0到多条）后触发，本组件在表单组件内，且表单组件存在主键（id）值时才会触发加载子表数据'
    },
    {
      name: 'fetchFails',
      title: '加载数据失败',
      description: '从服务端加数据出错。'
    },
    {
      name: 'fetchInterdict',
      title: '加载数据被阻断',
      description: '因某此原因加载数据请求被阻断，此时未向服务端发起数据请求，如本组件作为子表时，若无主表ID则会阻断查询。'
    },
    {
      name: 'changeRecord',
      title: '行记录更改',
      description: '在数据表的行内编辑模式下，当数据表的行记录信息更换时触发'
    },
    {
      name: 'deleteRecord',
      title: '行记录删除成功',
      description: '从前端的列表中点了删除按钮，且前端已正常删除，则触发此事件。不管后续是否有进行服务端删除操作，无返回结果。'
    },
    {
      name: 'copyRecord',
      title: '复制记录',
      description: '当点击行的复制操作时触发，参数{record:Record<string,any>,rowIndex:number}'
    },
    {
      name: 'change',
      title: '表格行增删移动时变更',
      description:
        '添加行、删除行、拖动行时触发发（表格内置表单字段输入控件值改变时，不会触发）'
    },
    {
      name: 'creatingEntitySavers',
      description:
        '完成实体保存对象创建之后（表单验证已通过），关闭创建方法前调用，例于对实体保存对象进行处理。',
      title: '保存对象完成前'
    }
  ],
  methods: [
    { name: 'refresh', title: '刷新', description: '刷新表格', params: [] },
    {
      name: 'addRecordsByTitle',
      title: '添加记录（基于列标题）',
      description: '添加记录，常用于excel复制数据插入',
      params: [
        {
          name: 'records',
          title: '记录集',
          required: true,
          type: 'Record<string,any>[]',
          description: '每条记录的属性为title，如：[{\'名称\': \'张三\', \'年龄\': 18}]'
        }
      ],
      returnInfo: {
        returnType: 'void',
        description: '添加一到多条记录到当前的列表中，常用于excel复制数据插入',
        docId: ''
      }
    },
    {
      name: 'addRecordsByDataIndex',
      title: '添加记录（基于列字段名）',
      description: '添加记录',
      params: [
        {
          name: 'records',
          title: '记录集',
          required: true,
          type: 'Record<string,any>[]',
          description: '每条记录的属性为dataIndex，如：[{\'name\': \'张三\', \'age\': 18}]'
        }
      ],
      returnInfo: {
        returnType: 'void',
        description: '可添加一到多条记录到当前的列表中',
        docId: ''
      }
    },
    {
      name: 'getEntitySavers',
      title: '获取实体保存对象',
      description: '获取当前表格页面实体保存对象',
      params: [],
      returnInfo: {
        returnType: 'GetEntitySaversResult，格式：{error:boolean,values:EntitySaver[]}。',
        description: '将当前表格的数据转换成实体保存对象（EntitySaver），便于用脚本的方式组合成新的实体保存对象，一起进行保存。另外，若需对列表值进行修改再保存，一般建议可以通过表格的creatingEntitySavers动作（详见动作面板）中，获取实体保存对象（EntitySaver）,并对其进行相应的值修改。',
        docId: '4919301630853255168'
      }
    },
    {
      name: 'getSelectedEntitySavers',
      title: '获取已选记录的实体保存对象',
      description: '获取已选记录的实体保存对象，返回{error:boolean,values:EntitySaver[]}',
      params: [],
      returnInfo: {
        returnType: 'GetEntitySaversResult，格式：{error:boolean,values:EntitySaver[]}。',
        description: '将当前表格已选的数据转换成实体保存对象（EntitySaver），便于用脚本的方式组合成新的实体保存对象，一起进行保存。另外，若需对列表值进行修改再保存，一般建议可以通过表格的creatingEntitySavers动作（详见动作面板）中，获取实体保存对象（EntitySaver）,并对其进行相应的值修改。',
        docId: '4919301630853255168'
      }
    },
    {
      name: 'getRenderRecords',
      title: '获取页面展示的记录',
      description: '获取当前列表页面展示的记录，返回记录数据组,没记录时返回空数组[]。',
      params: [],
      returnInfo: {
        returnType: 'Array<Record<string,any>>',
        description: '获取当前列表页面展示的记录，返回记录数据组,没记录时返回空数组[]，例如：[{id:"1234567890123456789",name:"xxx"}]。'
      }
    },
    {
      name: 'getSelectedRecords',
      title: '获取已选的记录',
      description: '获取已选的记录，返回记录数据组,没记录时返回空数组[]。',
      params: [],
      returnInfo: {
        returnType: 'Array<Record<string,any>>',
        description: '获取已选的记录，返回记录数据组,没记录时返回空数组[]，例如：[{id:"1234567890123456789",name:"xxx"}]。'
      }
    },
    {
      name: 'getSelectedKeys',
      title: '获取已选的记录keys',
      description: '获取已选的记录keys，返回记录数据组,没记录时返回空数组[]。',
      params: [],
      returnInfo: {
        returnType: 'Array<string>',
        description: '获取已选的记录keys，返回记录数据组,没记录时返回空数组[]，例如：["1234567890123456789","2234567890123456789"]。',
      }
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
      ],
      returnInfo: {
        returnType: 'boolean，值为：true | false',
        description: '是否选择了记录。',
      }
    },
    {
      name: 'isColumnHasValue',
      description:
        '检查表格列是否包含某值',
      title: '列是否包含某值',
      params: [
        {
          name: 'dataIndex',
          title: '字段名',
          required: true,
          type: 'string',
          description: '列名'
        },
        {
          name: 'value',
          title: '字段名',
          required: true,
          type: 'any',
          description: '列值'
        },
        {
          name: 'recordsScope',
          title: '数据范围',
          required: false,
          type: 'string',
          description: 'All：当前展示的所有数据，Selected：当前已选中的数据，默认为当前所选的数据'
        }
      ],
      returnInfo: {
        returnType: 'boolean，值为：true | false',
        description:
          '检查表格列是否包含某值，如果存在，返回true，否则返回false。'
      }
    },
    {
      name: 'getColumnMax',
      title: '获取单个列的最大值',
      description: '获取当前列表单个列的最大值，可以是字符串、日期或数值',
      params: [
        {
          name: 'dataIndex',
          title: '字段名',
          required: true,
          type: 'string',
          description: '需要求最大值的列字段名称'
        }
      ],
      returnInfo: {
        returnType: 'any',
        description: '获取当前列表单个列的最大值，可以是字符串、日期或数值。'
      }
    },
    {
      name: 'getColumnMin',
      title: '获取单个列的最小值',
      description: '获取当前列表单个列的最小值，可以是字符串、日期或数值',
      params: [
        {
          name: 'dataIndex',
          title: '字段名',
          required: true,
          type: 'string',
          description: '需要求最小值的列字段名称'
        }
      ],
      returnInfo: {
        returnType: 'any',
        description: '获取当前列表单个列的最小值，可以是字符串、日期或数值。'
      }
    },
    {
      name: 'getColumnSum',
      title: '获取单个列的求和',
      description: '获取单个列的求和，返回数值',
      params: [
        {
          name: 'dataIndex',
          title: '字段名',
          required: true,
          type: 'string',
          description: '需要求和的列字段名称'
        }
      ],
      returnInfo: {
        returnType: 'number',
        description: '获取当前列表中，某一列的值求和。',
      }
    },
    {
      name: 'getColumnsSum',
      title: '获取多个列的分别求和',
      description:
          '获取多个列的分别求和',
      params: [
        {
          name: 'dataIndexes',
          title: '字段名数组',
          required: true,
          type: 'Array<string>',
          description: '需要求和的字段名数组，如：["money","count"]'
        }
      ],
      returnInfo: {
        returnType: 'Record<string, number>,key为列名，value为该列的求和值',
        description: '获取当前列表中，多个列的值分别求和，返回求和值对象，如：{money:100,count:200}。',
      }
    },
    {
      name: 'getColumnGroupSum',
      title: '分组求和',
      description:
          '分组求和，返回{groupName1:value1,groupName2:value2}',
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
      ],
      returnInfo: {
        returnType: 'Record<string, number>,key为分组的列名，value为值列的求和值',
        description: '分组求和，以某列作为组名，求另一列的汇总值，如在一个班级人员清单中（班级、人员名称、费用），统计各年级的费用，{班级1:100,班级2:102,班级3:300}。',
      }
    },
    {
      name: 'getColumnJoin',
      title: '获取列值拼接字符串',
      description: '获取列值拼接字符串',
      params: [
        {
          name: 'dataIndex',
          title: '字段名',
          required: true,
          type: 'string',
          description: '需要拼接的字段名称，如："ecoNo"'
        },
        {
          name: 'separator',
          title: '字段值分隔符',
          required: false,
          type: 'string',
          description: '字段值分隔符，默认为“,”'
        },
        {
          name: 'onlySelected',
          title: '只拼接选择的记录',
          required: false,
          type: 'boolean',
          description: 'true时，只拼接选择的记录，false时，拼接当前展示的所有记录，默认为false'
        }
      ],
      returnInfo: {
        returnType: 'string，如“值1,值2,值3”',
        description: '获取列值拼接字符串，空值被排除，例如，4行记录，列值分别为100、60、undefined、40，返回："100,60,40"。',
      }
    },
    { name: 'reRender', title: '重新渲染', description: '基于当前的表格数据重新渲染', params: [] },
    {
      name: 'insertRecords',
      title: '插入记录',
      description: '向表格插入记录，纯客户端操作，未保存到服务器，目标列表组件中有的字段才会插入，如目标列表有ID、name字段，则插入的记录中，只有ID和name字段会被插入。',
      params: [
        {
          name: 'records',
          type: 'Record<string, any>',
          description: '需要插入的记录集',
          title: '记录数组',
          defaultValue: []
        },
        {
          name: 'ignoreDataIndexes',
          type: 'string[]',
          description: '需要插入的记录集中，忽略掉的字段，如：["id"]，只插入需要的字段（可插入的字段范围，以目标表中的字段为准，包括隐藏字段）。',
          title: '忽略的字段',
          defaultValue: []
        },
        {
          name: 'uniqueDataIndexes',
          type: 'string[]',
          description: '需要插入的记录集中，唯一约束的字段，多个字段时，表示联合唯一，如：["aId","bId"]，不是不能插入字段aId值相同,字段bId也相同的记录。',
          title: '唯一约束字段',
          defaultValue: []
        }
      ]
    },
    {
      name: 'updateRecord',
      title: '更新单条记录，保存到服务端',
      description:
          '更新表格的指定一条记录，依据传入的record，更新该记录，保存到服务端，该记录需要有id值。',
      params: [
        {
          name: 'record',
          title: '需更新的记录值',
          required: true,
          type: 'Record<string, any>',
          description:
              '需更新的记录字段及值信息，key为字段名，即列名,value为更新后的列值，如{id:"xxx",orderNo:“912881”},【注意】该记录需有id字段，为作更新的依据。'
        }
      ],
      returnInfo: {
        returnType: 'Promise | undefined',
        description: '依据传入的record，更新该记录，保存到服务端，该记录需要有id值。在表格的操作列的动用中调用此方法时，可以通过$gl.ctx.record，获取当前操作的行记录。',
      }
    },
    {
      name: 'deleteRecordByIndex',
      title: '删除一行记录（基于Index）',
      params: [
        {
          name: 'index',
          type: 'number',
          description: '删除操作只限于前端，并未同步到后端。',
          title: '行索引',
          defaultValue: ''
        }
      ],
      returnInfo: {
        returnType: 'Record<string, any> | null',
        description: '删除成功时，返回删除的记录，否则返回null，该删除操作只限于前端，并未同步到后端；删除第几行的记录，0表示第一行，1表示第二行。',
      }
    }
  ]
}
