import {  type Ref, toRaw } from 'vue'
import type {  TableData } from '@arco-design/web-vue'
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
import { EntityDataSource } from '@geelato/gl-ui'
import {
  type Column,
  type EntityFetchDataInfo,
  type EntityFetchDataProps, ExcelCellMeta,
  ExcelCellValueComputeMode,
  ExcelCellValueType, type ExcelColumnMeta,
  type GenShowColumnOptions,
  type GlTableColumn,
  RecordPushStatus,
  SlotNameRecordStatus,
  SlotNameSeq,
  type TableMeta
} from "./constants";

/**
 * 将当前列表中展示的数据列，作为导出Excel的数据列
 * @param renderColumns
 */
export const createExportColumns = (renderColumns: GlTableColumn[]): ExcelColumnMeta[] => {
  let result: ExcelColumnMeta[] = []
  renderColumns.forEach((col) => {
    // 对于序号列、操作列 dataIndex 为空，需要去掉
    if (col._show !== false&&col.dataIndex) {
      result.push({
        dataIndex: col.dataIndex,
        title: col.title,
        width: col.width,
        align: col.align,
        description: col._description,
        children: col.children
      })
    }
  })
  return result
}

/**
 * 基于当前列表中展示的数据列，生成导出Excel中单元格数据的元数据
 * @param renderColumns
 */
export const createExportDataCellMetas = (renderColumns: GlTableColumn[]): ExcelCellMeta[] => {
  let result: ExcelCellMeta[] = []
  renderColumns.forEach((col) => {
    // 对于序号列、操作列 dataIndex 为空，需要去掉
    if (col._show !== false&&col.dataIndex) {
      let mode = col._cellMeta?.valueComputeMode
      if (!mode) {
        // 默认是变量
        mode = col._cellMeta?.expression
          ? ExcelCellValueComputeMode.EXPRESSION
          : ExcelCellValueComputeMode.VAR
      }

      result.push({
        // excel中的占位符，如${单号}
        placeholder: `\${${col.title}}`,
        // 单元格的数据类型
        valueType: col._cellMeta?.valueType || ExcelCellValueType.STRING,
        // 单元格的取计模式
        valueComputeMode: mode,
        // 默认为列表
        isList: true,
        // 这里和服务端一起约定为list
        listVar: 'list',
        // 单元格取值模式为变量时的变量名
        var: col.dataIndex,
        isImage: col._cellMeta?.isImage,
        imageWidth: col._cellMeta?.imageWidth,
        imageHeight: col._cellMeta?.imageHeight,
        isMerge: col._cellMeta?.isMerge,
        isUnique: col._cellMeta?.isUnique,
        description: col._cellMeta?.description,
        // 单元格取值模式为常量时的常量值
        constValue: col._cellMeta?.constValue,
        // 单元格取值模式为表达式时的表达式内容
        expression: col._cellMeta?.expression
      })
    }
  })
  return result
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

/**
 * 列属性的表达式计算
 * @param columnPropName
 * @param data
 * @param pageProvideProxy
 */
export const evalColumnExpression = (
  columnPropName: string,
  data: {
    record: TableData
    column: GlTableColumn
    rowIndex: number
  },
  pageProvideProxy: PageProvideProxy
) => {
  // @ts-ignore
  if (!data.column[columnPropName]) {
    return data.record[data.rowIndex]
  }
  const ctx = {
    pageProxy: pageProvideProxy,
    record: toRaw(data.record),
    column: toRaw(data.column),
    rowIndex: toRaw(data.rowIndex)
  }

  // @ts-ignore
  return jsScriptExecutor.evalExpression(data.column[columnPropName], ctx)
}

// export const evalExpression = (
//   data: {
//     record: TableData
//     column: GlTableColumn
//     rowIndex: number
//   },
//   pageProvideProxy: PageProvideProxy,
// ) => {
//   if (!data.column._renderScript) {
//     return data.record[data.rowIndex]
//   }
//   const ctx = {
//     pageProxy: pageProvideProxy,
//     record: toRaw(data.record),
//     column: toRaw(data.column),
//     rowIndex: toRaw(data.rowIndex)
//   }
//   return jsScriptExecutor.evalExpression(data.column._renderScript, ctx)
// }

// export const evalColorExpression = (
//   data: {
//     record: TableData
//     column: GlTableColumn
//     rowIndex: number
//   },
//   pageProvideProxy: PageProvideProxy
// ) => {
//   if (!data.column._bgColor) {
//     return ''
//   }
//   const ctx = {
//     pageProxy: pageProvideProxy,
//     record: toRaw(data.record),
//     column: toRaw(data.column),
//     rowIndex: toRaw(data.rowIndex)
//   }
//   // console.log('evalExpression', data)
//   return jsScriptExecutor.evalExpression(data.column._bgColor, ctx)
// }

/**
 * 执行行级别的表达式
 * 场景：检查某行是否只读，如某数据已审核，则不能修改
 * @param rowExpression
 * @param data
 * @param pageProvideProxy
 */
// export const evalRowExpression = (
//   rowExpression: string,
//   data: {
//     record: TableData
//     rowIndex: number
//   },
//   pageProvideProxy: PageProvideProxy
// ) => {
//   const ctx = {
//     pageProxy: pageProvideProxy,
//     record: toRaw(data.record),
//     rowIndex: toRaw(data.rowIndex)
//   }
//   // console.log('evalRowExpression', data)
//   return jsScriptExecutor.evalExpression(rowExpression, ctx)
// }
/**
 * 计算出某行是否只读
 * @param isRowReadonlyExpression
 * @param records
 * @param pageProvideProxy
 * @returns boolean[]，其中index为rowIndex，value为true/false
 */
export const statIsRowReadonly = (
  isRowReadonlyExpression: string,
  records: Array<TableData>,
  pageProvideProxy: PageProvideProxy
) => {
  if (!isRowReadonlyExpression) {
    return []
  }
  // console.log('statIsRowReadonly', isRowReadonlyExpression,records)
  // key为rowIndex，value为true/false
  let result: boolean[] = []
  records.forEach((record, rowIndex) => {
    const ctx = {
      pageProxy: pageProvideProxy,
      record: toRaw(record),
      rowIndex: rowIndex
    }
    result.push(jsScriptExecutor.evalExpression(isRowReadonlyExpression, ctx))
  })
  return result
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
    // console.log(
    //   'showAction()',
    //   data.record.id,
    //   data.action.props.label,
    //   actionCopy.props.unRender !== true && actionCopy.props._hidden !== true,
    //   data.record.recordLock
    // )
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
export const slotNameOperation = '#'

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
    } else if (col._icon) {
      // 只是图标渲染，没有字段内容的自定义渲染
      col.slotName = col.slotName || utils.gid(slotNameFlag, 20)
      col._noCustomRender = true
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
  props: {
    columns: Array<any>
    enableI18n: boolean
  },
  showDataIndexes: string[],
  hideDataIndexes: string[]
) => {
  // 如果启用了多语言，}则需要对标题进行翻译
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
 * 是否显示序号列
 * @param props
 */
export const showSeqNoColumn = (props: any) => {
  return props.showSeqNo
}

/**
 * 是否显示操作列
 * @param props
 */
export const showOptColumn = (props: any) => {
  let showOpt = false
  props.columnActions?.forEach((action: ComponentInstance) => {
    if (!action.props._hidden) {
      showOpt = true
    }
  })
  return showOpt
}

/**
 * 是否显示记录状态列
 * @param props
 */
export const showRecordStatus = (props: any) => {
  return props.isFormSubTable
}

/**
 * 构建新可供展示的列（用于选择是否展示），但不是最终展示例
 * @param queryColumns
 * @param options
 */
export const genShowColumns = (
  queryColumns: Ref<GlTableColumn[]>,
  options?: GenShowColumnOptions
) => {
  console.log('genShowColumns options:', options)
  const cols: Array<GlTableColumn> = []
  // 默认需要展示序号列，但不默认展示
  // if (options?.showSeqColumn !== false) {
  const seqColumn = {
    title: '序号',
    slotName: SlotNameSeq,
    width: 51,
    align: 'center',
    _checked: !!options?.showSeqNoColumn
  }
  cols.push(seqColumn as Column)
  // }
  // 默认需要展示状态列，但不默认展示
  if (options?.showRecordStatus !== false) {
    const statusColumn = {
      title: '记录状态',
      slotName: SlotNameRecordStatus,
      width: 90,
      align: 'center',
      _checked: true
    }
    cols.push(statusColumn as Column)
  }
  queryColumns?.value.forEach((queryColumn) => {
    queryColumn._checked = true
    queryColumn.width = queryColumn.width || 150
    queryColumn.align = queryColumn.align || 'center'

    // console.log('genShowColumns() > queryColumn', queryColumn, 'showOptColumn', showOptColumn)
    executeObjectPropsExpressions(queryColumn, {})
    // 设置隐藏的列
    if (options?.isShowByComponent) {
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
  if (options?.showOptColumn !== false) {
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
  console.log('genShowColumns() > cols', cols)
  return cols
}

/**
 * 构建最终展示的列
 * @param showColumns 可选择的展示的列
 * @param keepClientSorter 保留客户端排序，默认为false，即关闭客户端排序
 */
export const genRenderColumns = (showColumns: Ref<GlTableColumn[]>, keepClientSorter?: boolean) => {
  const cols: Array<GlTableColumn> = []
  showColumns?.value.forEach((column) => {
    if (column._checked !== false) {
      cols.push(column)
    }
    if (!keepClientSorter) {
      if (column.sortable) {
        // 关闭表格组件内置的前端排序，采用服务端排序
        column.sortable.sorter = true
      }
    }
  })
  return cols
}

// /**
//  *  计算出带有插槽的列
//  *  这些列中，不包括操作列（即slotName为#的列）
//  */
// export const genSlotColumnsWithNoOperation = (renderColumns: GlTableColumn[]) => {
//   return renderColumns.filter((column) => {
//     return column.slotName && column.slotName !== slotNameOperation
//   })
// }

/**
 * 基于查询列创建实体数据源
 * 依据查询列中的默认排序配置，生成默认排序，当未传入新的排序时，采用默认排序进行查询
 * @param props
 * @param queryColumns 需要查询的列
 * @param simpleReaderInfo 简单的查询信息
 * @param getPidFn 获取父表单的id
 */
export const createEntityReader = (
  props: {
    entityName: string
    isSubForm: boolean
    subFormPidName: string
  },
  queryColumns: GlTableColumn[],
  simpleReaderInfo?: EntityFetchDataInfo,
  getPidFn?: Function
) => {
  const entityReader = new EntityReader()
  entityReader.entity = props.entityName
  entityReader.order = []
  simpleReaderInfo?.order?.forEach((order: EntityReaderOrder) => {
    entityReader.order.push(new EntityReaderOrder(order.field, order.order))
  })
  entityReader.params = []
  simpleReaderInfo?.params?.forEach((param: EntityReaderParam) => {
    entityReader.params.push(
      new EntityReaderParam(param.name, param.cop, param.value, param.groupName)
    )
  })

  entityReader.pageNo = simpleReaderInfo?.pageNo || 1
  entityReader.pageSize = simpleReaderInfo?.pageSize || 15
  // 如果是子查询
  // 增加父表单主键，作为查询字段，若父表单无该主健id，则返回，不查询
  if (props.isSubForm) {
    if (!getPidFn) {
      return
    }
    const pid = getPidFn()
    if (!pid) {
      return
    }
    entityReader.params.push(new EntityReaderParam(props.subFormPidName, 'eq', pid))
  }
  // 逻辑删除模式下，增加逻辑删除的数据过滤条件
  entityReader.params.push(new EntityReaderParam(logicDeleteFieldName, 'eq', 0))
  // 注意!!! pushedRecordKeys与unPushedRecordKeys的值不应存在重复的值，需要在传进来之前做好去重，以确保查询结构为预期所需
  // 如果有额外添加了排除ids作为查询条件时
  if (simpleReaderInfo?.unPushedRecordKeys && simpleReaderInfo?.unPushedRecordKeys.length > 0) {
    entityReader.params.push(
      new EntityReaderParam(
        EntityDataSource.ConstObject.keyFiledName,
        'nin',
        simpleReaderInfo?.unPushedRecordKeys
      )
    )
  }
  // 如果有额外添加了ids作为查询条件时，需要改变已有的查询条件分组，提升
  if (simpleReaderInfo?.pushedRecordKeys && simpleReaderInfo?.pushedRecordKeys.length > 0) {
    // 将原有的参数，没有分组的，设置默认分组名
    entityReader.params.forEach((param: EntityReaderParam) => {
      if (!param?.getGroupName()) {
        param.setGroupName('or:keys>and:' + EntityDataSource.EntityReaderParamGroup.DEFAULT_NAME)
      } else {
        // 如果已有的分组已设置了@and 或 @or 则直接添加，则否需默认添加@and:
        param.setGroupName(
          'or:keys>' +
            (param.getGroupName().startsWith('or') || param.getGroupName().startsWith('and')
              ? param.getGroupName()
              : 'and:' + param.getGroupName())
        )
      }
    })
    // 添加ids条件
    entityReader.params.push(
      new EntityReaderParam(
        EntityDataSource.ConstObject.keyFiledName,
        'in',
        simpleReaderInfo?.pushedRecordKeys,
        'or:keys'
      )
    )
  }

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
 * @param getPidFn 作为子表单时，需指定获取父亲表单id的方法
 * @param success
 * @param fail
 * @param loading
 */
export const useFetchData = (
  props: EntityFetchDataProps,
  queryColumns: Ref<GlTableColumn[]>,
  pagination: Ref<any>,
  getPidFn?: Function,
  success?: Function,
  fail?: Function,
  loading?: Ref<boolean>
) => {
  return (simpleReaderInfo?: EntityFetchDataInfo) => {
    // console.log('simpleReaderInfo',simpleReaderInfo)
    // 绑定了有效的实体才发起查询
    // 作为子表时，必须指定子表外键，即对应主表ID的字段
    if (!props.entityName || (props.isSubForm && !props.subFormPidName)) {
      return
    }
    loading ? (loading.value = true) : null
    if (simpleReaderInfo) {
      simpleReaderInfo.pageSize = simpleReaderInfo.pageSize || pagination.value.pageSize
    }

    const entityReader = createEntityReader(props, queryColumns.value, simpleReaderInfo, getPidFn)!

    // 由于查询默认有设置缓存，在列表的删除刷新查询、表单添加修改之后修改列表的场景中，不应缓存，否则查询的列表数据有可能还是老的
    // 这里需要强行指定该查询不缓存
    entityApi.queryByEntityReader(entityReader, true).then(
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
        loading ? (loading.value = false) : null
      },
      () => {
        if (fail && typeof fail === 'function') {
          fail({ data: undefined, pagination })
        }
        loading ? (loading.value = false) : null
      }
    )
  }
}

/**
 * 获取记录状态
 * @param key
 * @param pushedRecordKeys
 * @param unPushedRecordKeys
 */
export const getRecordPushStatus = (
  key: string,
  pushedRecordKeys?: string[],
  unPushedRecordKeys?: string[]
) => {
  if (unPushedRecordKeys?.includes(key)) {
    return RecordPushStatus.ToDelete
  } else if (pushedRecordKeys?.includes(key)) {
    return RecordPushStatus.ToAdd
  }
  return RecordPushStatus.None
}

/**
 * 直接修改修改排序号，从1开始
 * @param records
 * @param startWidth
 */
export const resetRecordsSeqNo = (records: Record<string, any>[], startWidth?: number) => {
  let startNum = startWidth === undefined || startWidth <= 0 ? 1 : startWidth
  records?.forEach((record: Record<string, any>) => {
    record.seqNo = startNum++
  })
}
