import type { TableColumnData, TableData } from '@arco-design/web-vue'
import {
  entityApi,
  EntityReader,
  EntityReaderOrder,
  EntityReaderParam,
  executeObjectPropsExpressions,
  utils
} from '@geelato/gl-ui'
import { FieldMeta, jsScriptExecutor, PageProvideProxy } from '@geelato/gl-ui'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import cloneDeep from 'lodash/cloneDeep'
import { type Ref, toRaw } from 'vue'
import useLoading from '../../hooks/loading'

const { setLoading } = useLoading(false)

export type SizeProps = 'mini' | 'small' | 'medium' | 'large'

export interface GlTableColumn extends TableColumnData {
  // 对于展示表格，非编辑表格，为了便于操作，不使用_component的字段绑定功能，即显示隐藏的控制在此
  // 是否显示，用于控制数据查询加载，但不展示，可用于前端列计算或record传值，恒等于false时才不显示
  _show?: boolean
  // 数据显示的处理脚本
  _renderScript: string
  // 用于编辑表格时，作为编辑组件
  // 用于展示表格时，作为展示组件，展示特殊的数据
  _component?: ComponentInstance
  // 是否必填，用于编辑状态
  _required?: boolean
  // 用于运行时表格配置时，设置是否在列表中展示该列
  _checked?: boolean
  // ！！！【待删除】需要自定义render函数时使用，目前暂未应用，优先采用_renderScript
  _renderFnBody: string
  // 背景色
  _bgColor?: string

  // 脚本运算时动态加入的
  _propsExpressions?: object
}

export type Column = GlTableColumn & { checked?: true }

export interface TableMeta {
  columns: GlTableColumn[]
  columnResizable?: boolean
  entityReaderInfo: EntityReader
  enableI18n?: boolean
  rowSelection?: object
  size?: SizeProps
}

export class BaseInfo {
  // 表格标题
  label: string = ''
  // 隐藏标题，默认为隐藏
  hideLabel?: boolean
  entityName: string = ''
  showQuery: boolean = true
  showToolbar: boolean = true
  showPagination: boolean = true
  // 表格外框间距
  tablePadding?: string | number
  // 启用表格编辑（表格内编辑）
  enableEdit?: boolean = false
  // 作为表单的子表
  isFormSubTable?: boolean = false
  // 外键，对应主表ID字段
  subTablePidName?: string = ''
  // 显示序号
  showSeqNo?: boolean = false
  // 左边固定数
  leftFixedCount: number = 0

  checkType: 'checkbox' | 'radio' | undefined = undefined
  // checkType 为checkbox时，showCheckAll才有效
  showCheckAll?: boolean = false
  // 点击行数据时，选中该行，相当于点击了行的选择器
  clickAsCheck?: boolean = false
  // 数据删除模式是否为逻辑删除模式 !!！暂不支持，平台全为逻辑删除
  isLogicDeleteMode?: boolean = true
  //  基于表达式计算出来的值，_propsExpression的示例值：{label:“用户列表”}
  _propsExpressions? = {}
}

const defaultTable: TableMeta = {
  columns: [],
  entityReaderInfo: {} as EntityReader
}
export { defaultTable }

// 平台约定，实体需要有逻辑删除字段delStatus
export const logicDeleteFieldName = 'delStatus'

export const exchangeArray = <T extends Array<any>>(
  array: T,
  beforeIdx: number,
  newIdx: number,
  isDeep = false
): T => {
  const newArray = isDeep ? cloneDeep(array) : array
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(beforeIdx, 1, newArray.splice(newIdx, 1, newArray[beforeIdx]).pop())
  }
  return newArray
}

export const evalExpression = (
  data: {
    record: TableData
    column: GlTableColumn
    rowIndex: number
  },
  pageProvideProxy: PageProvideProxy
) => {
  if (!data.column._renderScript) {
    return data.record[data.rowIndex]
  }
  const ctx = {
    pageProxy: pageProvideProxy,
    record: toRaw(data.record),
    column: toRaw(data.column),
    rowIndex: toRaw(data.rowIndex)
  }
  // console.log('evalExpression', data)
  return jsScriptExecutor.evalExpression(data.column._renderScript, ctx)
}

export const evalColorExpression = (
  data: {
    record: TableData
    column: GlTableColumn
    rowIndex: number
  },
  pageProvideProxy: PageProvideProxy
) => {
  if (!data.column._bgColor) {
    return ''
  }
  const ctx = {
    pageProxy: pageProvideProxy,
    record: toRaw(data.record),
    column: toRaw(data.column),
    rowIndex: toRaw(data.rowIndex)
  }
  // console.log('evalExpression', data)
  return jsScriptExecutor.evalExpression(data.column._bgColor, ctx)
}

export const showAction = (
  data: {
    record: TableData
    action: ComponentInstance
    rowIndex: number
  },
  pageProvideProxy: PageProvideProxy
) => {
  // 有配置了显示隐藏的才做转换
  if (data.action.propsExpressions?._hidden || data.action.propsExpressions?.unRender) {
    const actionCopy = JSON.parse(JSON.stringify(toRaw(data.action)))
    const ctx = {
      pageProxy: pageProvideProxy,
      record: toRaw(data.record),
      action: actionCopy,
      rowIndex: toRaw(data.rowIndex)
    }
    console.log(
      'showAction()',
      data.record.id,
      data.action.props.label,
      actionCopy.props.unRender !== true && actionCopy.props._hidden !== true,
      data.record.recordLock
    )
    executeObjectPropsExpressions(actionCopy, ctx)
    return actionCopy.props.unRender !== true && actionCopy.props._hidden !== true
  } else {
    return data.action.props.unRender !== true && data.action.props._hidden !== true
  }
}

export const t = (str: any) => {
  return str
}

const slotNameFlag = '__slot'
const slotNameOperation = '#'

/**
 * 设置列的插槽名称
 * 目标对象为配置了脚本_renderScript或组件_component的列
 * @param queryColumns
 */
export const setSlotNames = (queryColumns: GlTableColumn[]) => {
  // 不管是否编辑状态，如查配置了自定义渲染脚本，需要确认列有slotName
  queryColumns.forEach((col: Column) => {
    // col.tooltip = true
    if (col._renderScript || col._component || col._bgColor) {
      col.slotName = col.slotName || utils.gid(slotNameFlag, 20)
    } else {
      delete col.slotName
    }
  })
  // console.log('GlEntityTable > columns after convert:', recordSchema)
}

/**
 * 设置哪些列不可见、可见
 * 不指定的列保持原状
 * @param columns
 * @param hideDataIndexes 不可见的列
 * @param showDataIndexes 可见的列
 */
export const changeColumnsVisible = (
  columns: GlTableColumn[],
  showDataIndexes: string[],
  hideDataIndexes: string[]
) => {
  hideDataIndexes?.forEach((dataIndex: string) => {
    columns.forEach((column: GlTableColumn) => {
      if (column.dataIndex === dataIndex) {
        column._show = false
      }
    })
  })
  showDataIndexes?.forEach((dataIndex: string) => {
    columns.forEach((column: GlTableColumn) => {
      if (column.dataIndex === dataIndex) {
        column._show = true
      }
    })
  })
}

/**
 * 构建用于数据查询的列，不包括操作列
 * @param props
 * @param showDataIndexes
 * @param hideDataIndexes
 */
export const genQueryColumns = (
  props: any,
  showDataIndexes: string[],
  hideDataIndexes: string[]
) => {
  // 如果启用了多语言，则需要对标题进行翻译
  let qColumns: Array<GlTableColumn> = []
  if (props.columns && props.columns.length > 0) {
    qColumns = JSON.parse(JSON.stringify(props.columns))
  }
  // 设置列可见与不可见，未设置的列不影响
  changeColumnsVisible(qColumns, showDataIndexes, hideDataIndexes)
  // console.log('genQueryColumns props:', props)
  // 如果启用了多语言，则需要对标题进行翻译
  if (props.enableI18n) {
    qColumns.forEach((item) => {
      // console.log("gl-entity-table > queryColumns item:", item, item.title);
      // @ts-ignore
      item.title = item.title ? t(item.title + '') : ''
    })
  }
  // 设置插槽名
  setSlotNames(qColumns)
  return qColumns
}

/**
 * 构建新可供展示的列（用于选择是否展示），但不是最终展示例
 * @param queryColumns
 * @param isShowByComponent 是否通过组件来控制列是否展示，场景1，应用于编辑表，值为true;场景2，应用于查询表，值为false
 * @param showOptColumn 是否需要展示操作列，默认需要，可按需设置是否展示，如在没有Actions时可以设置为无
 */
export const genShowColumns = (
  queryColumns: Ref<GlTableColumn[]>,
  isShowByComponent: boolean,
  showOptColumn?: boolean
) => {
  const cols: Array<GlTableColumn> = []
  queryColumns?.value.forEach((queryColumn) => {
    queryColumn._checked = true
    queryColumn.width = queryColumn.width || 150
    queryColumn.align = queryColumn.align || 'center'

    console.log('genShowColumns() > queryColumn', queryColumn, 'showOptColumn', showOptColumn)
    executeObjectPropsExpressions(queryColumn, {})
    // 设置隐藏的列
    if (isShowByComponent) {
      // 场景1，应用于编辑表，按组件_component的属性来控制，
      if (queryColumn._component) {
        if (
          queryColumn._component.props._hidden !== true &&
          queryColumn._component.props.unRender !== true
        ) {
          cols.push(queryColumn)
        }
      } else {
        cols.push(queryColumn)
      }
    } else {
      // 场景2，应用于查询表，按列的属性_show来控制
      if (queryColumn._show !== false) {
        cols.push(queryColumn)
      }
    }
  })
  // 默认需要展示操作列
  if (showOptColumn !== false) {
    const optColumn = {
      title: '操作',
      slotName: '#',
      fixed: 'right',
      width: 140,
      align: 'center',
      _checked: true
    }
    cols.push(optColumn as Column)
  }
  return cols
}

/**
 * 构建最终展示的列
 * @param showColumns 可选择的展示的列
 */
export const genRenderColumns = (showColumns: Ref<GlTableColumn[]>) => {
  const cols: Array<GlTableColumn> = []
  showColumns?.value.forEach((column) => {
    if (column._checked !== false) {
      cols.push(column)
    }
  })
  return cols
}

/**
 *  计算出带有插槽的列
 *  这些列中，不包括操作列（即slotName为#的列）
 */
export const genSlotColumnsWithNoOperation = (renderColumns: GlTableColumn[]) => {
  return renderColumns.filter((column) => {
    return column.slotName && column.slotName !== slotNameOperation
  })
}

/**
 *  在查询列表中，用于用户操作的查询信息，如查询条件、选择的页码信息
 */
export type EntityFetchDataInfo = {
  pageSize?: number
  pageNo?: number
  // 排序字段
  order?: Array<EntityReaderOrder>
  params?: Array<EntityReaderParam>
}

/**
 * 构建fetchData的初始化props
 */
export type EntityFetchDataProps = {
  entityName: string
  isSubForm: boolean
  subFormPidName: string
}

/**
 * 基于查询列创建实体数据源
 * 依据查询列中的默认排序配置，生成默认排序，当未传入新的排序时，采用默认排序进行查询
 * @param props
 * @param queryColumns 需要查询的列
 * @param simpleReaderInfo 简单的查询信息
 * @param getPid 获取父表单的id
 */
export const createEntityReader = (
  props: {
    entityName: string
    isSubForm: boolean
    subFormPidName: string
  },
  queryColumns: GlTableColumn[],
  simpleReaderInfo?: EntityFetchDataInfo,
  getPid?: Function
) => {
  const entityReader = new EntityReader()
  entityReader.entity = props.entityName
  entityReader.order = simpleReaderInfo?.order || []
  entityReader.params = simpleReaderInfo?.params || []
  entityReader.pageNo = simpleReaderInfo?.pageNo || 1
  entityReader.pageSize = simpleReaderInfo?.pageSize || 15
  // 如果是子查询
  // 增加父表单主键，作为查询字段，若父表单无该主健id，则返回，不查询
  if (props.isSubForm) {
    if (!getPid) {
      return
    }
    const pid = getPid()
    if (!pid) {
      return
    }
    entityReader.params.push(new EntityReaderParam(props.subFormPidName, 'eq', pid))
  }
  // 逻辑删除模式下，增加逻辑删除的数据过滤条件
  entityReader.params.push(new EntityReaderParam(logicDeleteFieldName, 'eq', 0))

  const defaultOrders: EntityReaderOrder[] = []
  const fieldMetas = new Array<FieldMeta>()
  queryColumns?.forEach((column) => {
    // 过滤掉操作列，操作列的slotName，在geelato中约定为“#”
    if (column.slotName !== '#') {
      const fm = new FieldMeta()
      // @ts-ignore
      fm.name = column.dataIndex
      // @ts-ignore
      fm.title = column.title
      fieldMetas.push(fm)
    }
    // 构建
    if (column.sortable?.defaultSortOrder) {
      const order = new EntityReaderOrder(column.dataIndex, column.sortable?.defaultSortOrder)
      defaultOrders.push(order)
    }
  })
  // 如未设置排序，采用默认排序
  if (entityReader.order.length === 0) {
    entityReader.order.push(...defaultOrders)
  }
  entityReader.fields = fieldMetas
  return entityReader
}

/**
 * 构建获取数据的方法
 * 在查询、切换分页等场景中调用
 * @param props
 * @param queryColumns
 * @param pagination
 * @param getPid 作为子表单时，需指定获取父亲表单id的方法
 * @param success
 */
export const useFetchData = (
  props: EntityFetchDataProps,
  queryColumns: Ref<GlTableColumn[]>,
  pagination: Ref<any>,
  getPid?: Function,
  success?: Function
) => {
  return (simpleReaderInfo?: EntityFetchDataInfo) => {
    // console.log('simpleReaderInfo',simpleReaderInfo)
    // 绑定了有效的实体才发起查询
    // 作为子表时，必须指定子表外键，即对应主表ID的字段
    if (!props.entityName || (props.isSubForm && !props.subFormPidName)) {
      return
    }
    setLoading(true)
    if (simpleReaderInfo) {
      simpleReaderInfo.pageSize = simpleReaderInfo.pageSize || pagination.value.pageSize
    }

    const entityReader = createEntityReader(props, queryColumns.value, simpleReaderInfo, getPid)!

    entityApi.queryByEntityReader(entityReader).then(
      (res: any) => {
        pagination.value.pageSize = simpleReaderInfo?.pageSize || pagination.value.pageSize
        pagination.value.current = simpleReaderInfo?.pageNo || 1
        pagination.value.total = Number.parseInt(res.total)
        // console.log(
        //   'GlEntityTable > fetchData() > response:',
        //   res,
        //   'readerInfo:',
        //   entityReader,
        //   'pagination:',
        //   pagination
        // )
        if (success && typeof success === 'function') {
          success({ data: res.data, pagination })
        }
        setLoading(false)
      },
      () => {
        setLoading(false)
      }
    )
  }
}
