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
          description: '表格类型是否为子表，若是，在保存表单时，需会同构建保存该表的内容',
          setterDefaultValue: true
        },
        {
          name: 'subTablePidName',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          title: '关联主表单ID',
          description: '子表中，对应主表单主键ID的字段',
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
          name: 'showPagination',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: false,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '显示分页',
          setterComponentName: 'ASwitch',
          setterDefaultValue: false
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
          setterComponentName: 'ASwitch',
          setterDefaultValue: true
        },
        {
          name: 'showSeqNo',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: false,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '显示序号',
          setterComponentName: 'ASwitch'
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
          description: '启用行拖动为true才生效，当行拖动行之后，自动重新设置排序号字段SeqNo的值，从1开始排序。'
        },
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
      name: 'readonly',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
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
      expanded: true,
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
      expanded: true,
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
      description: '从服务端成功加数据（0到多条）后触发。'
    },
    {
      name: 'changeRecord',
      title: '行记录更改',
      description: '在数据表的行内编辑模式下，当数据表的行记录信息更换时触发'
    },
    {
      name: 'change',
      title: '表格数据变更（行调整顺序）',
      description: '表格数据发生变化时触发，如在可编辑表格下，行数据数据拖动时出发（表格内置表单字段输入控件值改变时，不会触发）'
    },
    {
      name: 'creatingEntitySavers',
      description: '完成实体保存对象创建之后（表单验证已通过），关闭创建方法前调用，例于对实体保存对象进行处理。',
      title: '保存对象完成前'
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
      name: 'getSelectedEntitySavers',
      title: '获取选择的实体保存对象',
      description: '获取选择的实体保存对象，返回{error:boolean,values:EntitySaver[]}',
      params: []
    },
    {
      name: 'hasSelectedRecords',
      title: '是否选择了记录',
      description: '是否选择了记录，返回true | false',
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
    { name: 'reRender', title: '重新渲染', description: '基于当前的表格数据重新渲染', params: [] },
    {
      name: 'insertRecords',
      title: '插入记录',
      description: '向表格插入记录，纯客户端操作，未保存到服务器',
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
          description: '需要插入的记录集中，忽略掉的字段，如：["id"]',
          title: '忽略的字段',
          defaultValue: []
        }
      ]
    },
    {
      name: 'updateRecord',
      title: '单条更新',
      description:
        '更新表格的指定一条记录，需要输传递需更新的记录record，该记录需要有id值。在表格行操作中，值示例：$gl.ctx.record',
      params: []
    },
    {
      name: 'deleteRecord',
      title: '删除行',
      params: [
        {
          name: 'id',
          type: 'String',
          description: '在表格行操作中，值示例：$gl.ctx.record.id',
          title: '记录ID',
          defaultValue: ''
        }
      ]
    },
    { name: 'getRenderData', title: '获取表数据' }
  ]
}
