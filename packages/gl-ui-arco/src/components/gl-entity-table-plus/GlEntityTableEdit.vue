<script setup lang="ts">
/**
 * 编辑表格
 * 1、不分页，直接展示所有数据
 * 2、采用客户端排序
 */
// @ts-nocheck
import {
  computed,
  inject,
  nextTick,
  type PropType,
  reactive,
  ref,
  type Ref,
  toRaw,
  watch
} from 'vue'
import type { TableRowSelection, PaginationProps } from '@arco-design/web-vue'
import useLoading from '../../hooks/loading'
import cloneDeep from 'lodash/cloneDeep'
import Sortable from 'sortablejs'
import {
  entityApi,
  FieldMeta,
  EntityReader,
  EntityReaderParam,
  useGlobal,
  FormProvideProxy,
  FormProvideKey,
  PageProvideProxy,
  PageProvideKey,
  mixins,
  EntityReaderOrder,
  PageStatus, EntityDataSource
} from '@geelato/gl-ui'
import { Schema } from 'b-validate'
import { type Column, type GlTableColumn, SlotNameSeq } from './constants'
import {
  evalColumnExpression,
  exchangeArray,
  logicDeleteFieldName,
  resetRecordsSeqNo,
  genQueryColumns,
  genRenderColumns,
  statIsRowReadonly,
  genShowColumns,
  showSeqNoColumn,
  slotNameOperation
} from './table'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import type { ValidatedError } from '../gl-entity-form/GlEntityForm'
// 直接在template使用$modal，build时会报错，找不到类型，这里进行重新引用定义
const global = useGlobal()
// fetch 加载完成数据之后
const emits = defineEmits([
  'updateColumns',
  'changeRecord',
  // 查询成功
  'fetchSuccess',
  // 查询失败
  'fetchFail',
  // 阻断查询，如作为子表时，若无主表ID则会阻断查询
  'fetchInterdict',
  'change',
  // 添加一行
  'addRow',
  // 插入多行
  'insertRecords',
  'copyRecord',
  // 从前端的列表中点了删除按钮，且前端已正常删除，则触发此事件。不管后续是否有进行服务端删除操作
  'deleteRecord',
  // 从前端的列表中点了解除按钮，且前端已正常解除，则触发此事件。不管后续是否有进行服务端解除操作
  'releaseRecord'
])
const props = defineProps({
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  /**
   *  绑定的实体名称
   */
  entityName: {
    type: String,
    required: true
  },
  /**
   * 展示的列配置
   */
  columns: {
    type: Array as PropType<GlTableColumn[]>,
    default() {
      return []
    }
  },
  /**
   *  列上的操作配置
   */
  columnActions: {
    type: Array as PropType<ComponentInstance[]>,
    default() {
      return []
    }
  },
  columnResizable: {
    type: Boolean,
    default() {
      return true
    }
  },
  enableI18n: {
    type: Boolean,
    default() {
      return true
    }
  },
  isFormSubTable: {
    type: Boolean,
    default() {
      return false
    }
  },
  isLogicDeleteMode: {
    type: Boolean,
    default() {
      return true
    }
  },
  subTablePidName: {
    type: String
  },
  rowSelection: {
    type: Object as PropType<TableRowSelection>,
    default() {
      return undefined
    }
  },
  pagination: {
    type: Object as PropType<PaginationProps>,
    default() {
      return {
        current: 1,
        defaultPageSize: 1000,
        showTotal: false,
        showPageSize: false,
        pageSizeOptions: [1000]
      }
    }
  },
  showPagination: {
    type: Boolean,
    default() {
      return true
    }
  },
  tableSettingId: {
    type: String,
    required: true
  },
  /**
   *  是否显示序列号
   */
  showSeqNo: Boolean,
  /**
   *  显示删除操作
   */
  showActionDelete: {
    type: Boolean,
    default() {
      return true
    }
  },
  /**
   *  显示解除操作
   */
  showActionRelease: {
    type: Boolean,
    default() {
      return false
    }
  },
  /**
   *  显示复制操作
   */
  showActionCopy: {
    type: Boolean,
    default() {
      return true
    }
  },
  /**
   *  行是否只读的表达式
   */
  isRowReadonlyExpression: String,
  tableDraggable: Boolean,
  autoResetSeqNoAfterDrag: Boolean,
  readonly: Boolean,
  ...mixins.props
})

const formProvideProxy: FormProvideProxy | undefined = inject(FormProvideKey)
const pageProvideProxy: PageProvideProxy | undefined = inject(PageProvideKey)
let recordValidateSchema = new Schema({})

const { loading, setLoading } = useLoading(false)

const t = (str: any) => {
  return str
}
// 渲染展示的数据
props.glComponentInst.value = props.glComponentInst.value || []
// @ts-ignore
const renderData: Ref<Array<object>> = ref(props.glComponentInst.value)
// 用于构建查询语句的列，包含一些隐藏的列；该列的数据基于输入的props.columns进行复制转换
const queryColumns: Ref<GlTableColumn[]> = ref([])
// 用于工具条中控制哪些列显示与否
const showColumns: Ref<GlTableColumn[]> = ref([])
// 最终展示的列
const renderColumns: Ref<GlTableColumn[]> = ref([])
// 行是否只读
const isRowReadonlyArray = ref([] as boolean[])

/**
 *  统计行是否只读
 */
const reStatIsRowReadonly = (records: Array) => {
  isRowReadonlyArray.value.length = 0
  isRowReadonlyArray.value = statIsRowReadonly(
    props.isRowReadonlyExpression,
    records,
    pageProvideProxy
  )
}
/**
 * 行是否只读，用于UI展示调用
 */
const isRowReadonly = (rowIndex: number) => {
  return isRowReadonlyArray.value.length > rowIndex ? isRowReadonlyArray.value[rowIndex] : false
}
// const slotNameFlag = '__slot'
// const setSlotNames = () => {
//   // 如查配置了自定义渲染脚本，需要确保列有slotName
//   // 对于编辑状态，需将column中没有设置插槽的，生成插槽
//   props.columns.forEach((col: Column) => {
//     if (col._renderScript || col._component) {
//       col.slotName = col.slotName || utils.gid(slotNameFlag, 20)
//     } else {
//       delete col.slotName
//     }
//   })
// }

/**
 * 依赖各列的定义（props.columns）
 * 创建验校规则对象recordValidateSchema
 * 用于后续对每一行数据的校验
 */
const genRecordValidateSchema = () => {
  // dataIndex需与bindField的fieldName一致
  const dataIndexes: string[] = []
  const cols = props.columns
  cols.forEach((col: Column) => {
    if (col._component) {
      col.dataIndex = col._component.props.bindField?.fieldName
      // 验证信息
      if (col._component.props.rules) {
        // @ts-ignore
        recordValidateSchema.schema[col.dataIndex!] = toRaw(col._component.props.rules)
      }
    }
    if (col.dataIndex) {
      if (dataIndexes.includes(col.dataIndex)) {
        // 存在同名的dataIndex
        global.$notification.error({
          title: '绑定字段重复',
          content: `绑定同名的字段：${col.dataIndex}`
        })
      } else {
        dataIndexes.push(col.dataIndex)
      }
    }
  })
  // 去掉recordValidateSchema.schema中不存在的dataIndex
  if (recordValidateSchema.schema) {
    Object.keys(recordValidateSchema.schema).forEach((dataIndex: string) => {
      if (!dataIndexes.includes(dataIndex)) {
        delete recordValidateSchema.schema[dataIndex]
      }
    })
  }
}

/**
 *  生成列标题和必填验证的插槽名（便于生成红色必填标识）
 */
const genColumnTitleAndRequired = () => {
  const cols = props.columns
  cols.forEach((col: Column) => {
    // 设置列表标题
    col.title = col._component?.props?.label ? t(col._component?.props?.label + '') : ''
    // 增加必填标识
    // @ts-ignore
    if (col._component?.props?.rules?.length > 0) {
      // @ts-ignore
      const foundIndex = col._component.props.rules.findIndex((rule) => {
        return rule.required === true && rule.ruleName === 'required'
      })
      if (foundIndex >= 0) {
        col._required = true
        // 标题名插槽，便于生成红色必填标识
        col.titleSlotName = 'titleSlotRequired'
      }
    }
    // ID width
    if (col.dataIndex === 'id' && !col.width) {
      col.width = 160
    }
  })
}

/**
 *  重置所有的列
 */
const resetColumns = () => {
  // 基于输入的props.columns，完善标题、必填验证等信息
  genColumnTitleAndRequired()

  // 查询数据库的列
  queryColumns.value = genQueryColumns(props, [], [])
  // 可展示的列，用于选择哪些展进行展示
  showColumns.value = genShowColumns(queryColumns, {
    isShowByComponent: false,
    // 编辑列表暂没有提供自定义操作配置，不按props.columnActions控制是否展示操作列
    // showOptColumn: showOptColumn(props),
    showOptColumn: true,
    showSeqNoColumn: showSeqNoColumn(props),
    // 编辑表不需要是否已保存的记录状态 showRecordStatus: showRecordStatus(props)
    showRecordStatus: false
  })
  // 最终展示在列表中的列
  renderColumns.value = genRenderColumns(showColumns, true)

  // 基于生成校验规则对象
  genRecordValidateSchema()
}

const refreshFlag = ref(true)
/**
 *  基于当前的数据重新渲染表格
 */
const reRender = () => {
  refreshFlag.value = false
  nextTick(() => {
    refreshFlag.value = true
  })
}
resetColumns()
// 这个watch 用于设计时，监控列变化时，及时刷新（主要是用于让表达式生效）
if (!props.glIsRuntime) {
  watch(
    () => {
      return props.columns
    },
    () => {
      resetColumns()
      reRender()
    },
    { deep: true }
  )
}
// 需和主表解除关系的记录，即需要更新外键字段为空的记录
const toReleaseRecords = ref<Array<{ id: string; [logicDeleteFieldName]: number }>>([])
// 需删除的记录，需要逻辑删除
const toDeleteRecords = ref<Array<{ id: string; [logicDeleteFieldName]: number }>>([])
const resetDeleteDataWhenEnableEdit = () => {
  toDeleteRecords.value = []
}
const _pagination = reactive({
  ...props.pagination,
  pageSize: props.pagination.defaultPageSize
})

/**
 *  表格列定义转换
 *  如果启用了多语言，则需要对标题进行翻译
 *  对于一些特殊的列，设置默认值，如ID的宽度
 */
// const columns = computed<GlTableColumn[]>(() => {
//   let columnData: Array<GlTableColumn> = []
//   if (props.columns) {
//     columnData = JSON.parse(JSON.stringify(props.columns))
//     columnData.forEach((item: GlTableColumn) => {
//       // console.log("gl-entity-table > columns item:", item, item.title);
//       item.title = item._component?.props?.label ? t(item._component?.props?.label + '') : ''
//       // 增加必填标识
//       // @ts-ignore
//       if (item._component?.props?.rules?.length > 0) {
//         // @ts-ignore
//         const foundIndex = item._component.props.rules.findIndex((rule) => {
//           return rule.required === true && rule.ruleName === 'required'
//         })
//         if (foundIndex >= 0) {
//           item._required = true
//           item.titleSlotName = 'titleSlotRequired'
//         }
//       }
//       // ID width
//       if (item.dataIndex === 'id' && !item.width) {
//         item.width = 160
//       }
//     })
//   }
//   return columnData
// })

const createEntityReader = () => {
  let entityReader = new EntityReader()
  entityReader.entity = props.entityName
  entityReader.order = []

  const defaultOrders: EntityReaderOrder[] = []
  const fieldMetas = new Array<FieldMeta>()
  queryColumns.value.forEach((column) => {
    // 过滤掉操作列
    if (column.slotName !== 'optional') {
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

  entityReader.pageNo = _pagination.pageNo || 1
  entityReader.pageSize = _pagination.pageSize || 15
  entityReader.fields = fieldMetas
  return entityReader
}

/**
 * 加载数据的最终方法，在查询、切换分页等场景中调用
 * @param readerInfo
 */
const fetchData = async (readerInfo?: {
  pageSize?: number
  pageNo?: number
  params?: Array<EntityReaderParam>
}) => {
  setLoading(true)
  resetDeleteDataWhenEnableEdit()
  // 绑定了有效的实体才发起查询
  // 作为子表时，必须指定子表外键，即对应主表ID的字段
  if (!props.entityName || (props.isFormSubTable && !props.subTablePidName)) {
    setLoading(false)
    console.error(
      'GlEntityTable > fetchData() > entityName or subTablePidName is null. 作为子表时，必须指定子表外键，即对应主表ID的字段'
    )
    emits('fetchFail', { data: [],pagination:_pagination,message: 'entityName or subTablePidName is null. 作为子表时，必须指定子表外键，即对应主表ID的字段' })
    return
  }

  try {
    const entityReader = createEntityReader()
    entityReader.params = readerInfo?.params || []

    // 如果是子查询
    // 增加父表单主键，作为查询字段，若父表单无该主健id，则返回，不查询
    if (props.isFormSubTable) {
      const pid = formProvideProxy?.getRecordId()
      // console.log('GlEntityTableEdit > fetchData() > formProvideProxy is', formProvideProxy)
      if (!pid) {
        setLoading(false)
        if (
          pageProvideProxy?.pageStatus !== PageStatus.create &&
          pageProvideProxy?.pageStatus !== PageStatus.copyCreate &&
          pageProvideProxy?.pageStatus !== PageStatus.none
        ) {
          console.error(
            'GlEntityTableEdit > fetchData() > formProvideProxy is',
            formProvideProxy,
            ' and getRecordId() is ' +
              formProvideProxy?.getRecordId() +
              '.列表作为子表时，若页面的状态为非新增、非复制、非none状态时（如修改、查看状态），主表的ID不能为空，当前页面状态：',
            pageProvideProxy?.pageStatus
          )
        }
        emits('fetchInterdict', { data: [],message: '为作子表单，但获取不到父表单的ID，停止查询，查询页面状态为：'+pageProvideProxy?.pageStatus,pagination:_pagination })
        return
      }
      entityReader.params.push(new EntityReaderParam(props.subTablePidName, 'eq', pid))
    }

    // 逻辑删除模式下，增加逻辑删除的数据过滤条件
    if (props.isLogicDeleteMode) {
      entityReader.params.push(new EntityReaderParam(logicDeleteFieldName, 'eq', 0))
    }
    entityReader.pageSize = readerInfo?.pageSize || _pagination.pageSize!
    const response: any = await entityApi.queryByEntityReader(entityReader, true)
    // console.log('GlEntityTableEdit > fetchData() > response:', response)
    renderData.value = response.data
    reStatIsRowReadonly(renderData.value)
    _pagination.pageSize = readerInfo?.pageSize || _pagination.pageSize
    _pagination.current = readerInfo?.pageNo || 1
    _pagination.total = response.data.total
    emits('fetchSuccess', { data: renderData.value,message:'', pagination:_pagination })
  } catch (err) {
    console.error(err)
    emits('fetchFail', { data: [],message:'加载失败'+err.message, pagination:_pagination })
  } finally {
    setLoading(false)
  }
}

const onChangeValue = (value: any, oldValue: any) => {
  // console.log(
  //   'change renderData,label:',
  //   props.glComponentInst.props.base?.label,
  //   'entity:',
  //   props.glComponentInst.props.base?.entityName,
  //   'id',
  //   props.glComponentInst.id,
  //   'isPageRead:',
  //   isPageRead,
  //   'renderData:',
  //   props.glComponentInst.value
  // )
  // 这里不能使用 reRender()，reRender会导致用户每录入一个字符都会重绘整个列表
  renderData.value = []
  // @ts-ignore
  renderData.value = [...props.glComponentInst.value]
  // 值有变化时，重新统计一下是否只读
  // reStatIsRowReadonly(renderData.value)
  emits('change', renderData.value)
}

/**
 *  编辑页面的数据量不会太大，这里直接Watch数据的变化，不用在页面中配置值改变之后刷新列表
 */
watch(
  () => {
    return props.glComponentInst.value
  },
  onChangeValue,
  { deep: true }
)

/**
 * 表格数据发生变化时触发
 * 如表格数据拖动时（表格内置表单字段输入控件值改变时，不会触发）
 * @param data
 */
const change = (data: []) => {
  // console.log('table change renderData:', data)
  if (props.autoResetSeqNoAfterDrag) {
    resetRecordsSeqNo(data)
  }
  // @ts-ignore
  props.glComponentInst.value.length = 0
  // @ts-ignore
  props.glComponentInst.value.push(...data)
  // 在props.glComponentInst.value的watch事件中统一emits和更新renderData的值，避免重复执行
  // emits('change', renderData.value)
}

const search = (entityReaderParams: Array<EntityReaderParam>) => {
  // console.log('search entityReaderParams:', entityReaderParams)
  fetchData({ params: entityReaderParams })
}
const onPageChange = (pageNo: number) => {
  fetchData({ pageNo })
}

const onPageSizeChange = (pageSize: number) => {
  fetchData({ pageSize })
}

const changeShowColumns = (
  checked: boolean | (string | boolean | number)[],
  column: Column,
  index: number
) => {
  if (!checked) {
    renderColumns.value = showColumns.value.filter((item) => item.dataIndex !== column.dataIndex)
  } else {
    renderColumns.value.splice(index, 0, column)
  }
}
const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById(props.tableSettingId) as HTMLElement
      new Sortable(el, {
        onEnd(e: any) {
          const { oldIndex, newIndex } = e
          exchangeArray(renderColumns.value, oldIndex, newIndex)
          exchangeArray(showColumns.value, oldIndex, newIndex)
          emits('updateColumns', showColumns.value)
        }
      })
    })
  }
}

// const optColumn = { title: '操作', slotName: '#', fixed: 'right', width: 140, align: 'center' }
const scroll = {
  x: '100%'
}
// watch(
//   () => columns.value,
//   (val) => {
//     // val.forEach((col) => {
//     //   // @ts-ignore
//     //   col.title = col._component?.props.label
//     // })
//     // @ts-ignore
//     renderColumns.value = cloneDeep(val)
//     renderColumns.value.forEach((item, index) => {
//       item.checked = true
//       item.width = item.width || 150
//       item.align = item.align || 'center'
//     })
//     renderColumns.value.push(optColumn as Column)
//     showColumns.value = cloneDeep(renderColumns.value)
//     // console.log('GlEntityTableEdit > update renderColumns:', renderColumns)
//     emits('updateColumns', showColumns.value)
//   },
//   { deep: true, immediate: true }
// )

/**
 *  计算出带有插槽的列
 *  这些列中，不包括操作列（即slotName为#的列）
 */
// const slotColumns = computed(() => {
//   return renderColumns.value.filter((column) => {
//     return column.slotName && column.slotName !== '#'
//   })
// })

/**
 *  在表格修改状态下，验证表格的一行数据
 */
const validateRecord = (record: object, rowIndex: number) => {
  // console.log('recordValidateSchema', recordValidateSchema)
  return new Promise<{ [key: string]: any }>((resolve: Function) => {
    recordValidateSchema.validate(record, (err: any) => {
      // err的示例值如下，cargoName为字段名
      // const err = {
      //   cargoName: {
      //     message: '必填',
      //     requiredError: true,
      //     type: 'boolean',
      //     value: undefined
      //   }
      // }
      const result = err
      setError(record, rowIndex, result)
      resolve(result)
    })
  })
}
// 对应整个数据表，构建对应的检查错误信息表
const tableErrors = ref<Array<object | null>>([])
tableErrors.value.length = renderColumns.value.length
const setError = (record: object, rowIndex: number, err: { [key: string]: any }) => {
  // console.log('setError',record,rowIndex,err)
  if (!err) {
    tableErrors.value[rowIndex] = null
    return
  }
  tableErrors.value[rowIndex] = tableErrors.value[rowIndex] = {}
  renderColumns.value.forEach((col: Column) => {
    // console.log('tableErrors.value[rowIndex]:', tableErrors.value[rowIndex])
    Object.keys(err).forEach((errKey: string) => {
      if (col.dataIndex === errKey) {
        // @ts-ignore
        tableErrors.value[rowIndex][errKey] = toRaw(err[errKey])
      }
    })
    // console.log('col.dataIndex', col.dataIndex, tableErrors.value[rowIndex])
  })
}

/**
 *  表格在编辑模式下，添加空行
 *  设置列的dataIndex让其与绑定的组件一致
 */
const addRow = (record:Record<string,any>) => {
  const newRow = {}
  props.columns.forEach((col: Column) => {
    //@ts-ignore
    newRow[col.dataIndex] = record[col.dataIndex] || col._component?.value
  })
  renderData.value.push(newRow)
  props.glComponentInst.value = renderData.value
  emits('addRow',newRow)
  return newRow
}

// /**
//  *  表格在编辑模式下，添加一到多行记录
//  *  常用于excel导入数据
//  *  每行的数据以列title作为key
//  */
// const addRecordsByTitle = (records: Record<string, any>[]) => {
//   addRecords(records, 'title')
// }
//
// /**
//  *  表格在编辑模式下，添加一到多行记录
//  *  每行的数据以列dataIndex作为key
//  */
// const addRecordsByDataIndex = (records: Record<string, any>[]) => {
//   addRecords(records, 'dataIndex')
// }
//
// const addRecords = (records: Record<string, any>[], keyField: string = 'dataIndex',withAlarm:boolean) => {
//   if (!records || records.length === undefined) {
//     $message.error('加入列表的数据为空或不是有效的数组')
//     return
//   }
//   const newRows = []
//   records?.forEach((record: Record<string, any>) => {
//     const newRow = {}
//     props.columns.forEach((col: Column) => {
//       //@ts-ignore
//       newRow[col.dataIndex] = record[`"${col[keyField]}"`] || col._component?.value
//     })
//     newRows.push(newRow)
//     renderData.value.push(newRow)
//   })
//   props.glComponentInst.value = renderData.value
//   emits('addRecords',newRows)
//   return newRows
// }

/**
 * 获取重复的数据和不重复的数据
 * 创建新的数组返回
 * @param records 当前列表的数据
 * @param insertRecords 插入的数据
 * @param uniqueDataIndexes 唯一字段，多个字段时，表示联合唯一
 */
const findRecords = (records: Record<string, any>[],insertRecords:Record<string, any>[],uniqueDataIndexes: string[]) => {
  console.log(records,insertRecords,uniqueDataIndexes)
  const sameRecords: Array<Record<string, any>> = []
  const notSameRecords: Array<Record<string, any>> = []
  if (uniqueDataIndexes && uniqueDataIndexes.length > 0) {
    insertRecords.forEach((record: Record<string, any>) => {
      // let isSameRecord = false
      // 判断是否与当前列表中的数据重复
      const foundSameRecord = records.find((item: Record<string, any>) => {
        let allUniqueDataIndexAreSame = true
        // 找出存在不同的非空字段
        let unSameNotEmptyDataIndexes=[]
        // 找出相同的空字段
        let sameEmptyDataIndexes = []
        uniqueDataIndexes.forEach((uniqueDataIndex: string) => {
          console.log('查看同相的记录，唯一约束字段是：',uniqueDataIndex,'值为：',item[uniqueDataIndex],record[uniqueDataIndex],item[uniqueDataIndex]===undefined && record[uniqueDataIndex]===undefined)
          if(item[uniqueDataIndex]===undefined && record[uniqueDataIndex]===undefined){
            sameEmptyDataIndexes.push(uniqueDataIndex)
          } else if (item[uniqueDataIndex] != record[uniqueDataIndex]) {
            unSameNotEmptyDataIndexes.push(uniqueDataIndex)
          }
        })

        if(unSameNotEmptyDataIndexes.length>0){
          // 找出存在不同的非空字段
          allUniqueDataIndexAreSame = false
        }else{
          // 此时，有可能是有一到多个字段相同
          if(uniqueDataIndexes.length === sameEmptyDataIndexes.length){
            // 如果相同的都是空字段，在不考虑空值的情况下，则表示，数据不重复
            allUniqueDataIndexAreSame = false
          }else{
            // 相同包括空字段和非空字段，则表求数据重复
            allUniqueDataIndexAreSame = true
          }
        }

        return allUniqueDataIndexAreSame
      })

      if (foundSameRecord) {
        sameRecords.push(record)
      } else {
        notSameRecords.push(record)
      }
    })
  } else {
    notSameRecords.push(...(params.records || []))
  }
  return {sameRecords, notSameRecords}
}

/**
 * 表格在编辑模式下，基于外部的数据记录，插入新记录到当前组件
 * @param params ignoreDataIndexes 忽列掉的字段
 *               uniqueDataIndexes 唯一字段，多个字段时，表示联合唯一，默认为模型的主键字段“id”
 *               isColTitleAsKeyField 是否将列的title为作record的key，即默认采用列的dataIndex作为record的key
 */
const insertRecords = (params: {
  records: Record<string, any>[]
  ignoreDataIndexes?: string[]
  uniqueDataIndexes?: string[]
  isColTitleAsKeyField?:boolean
}) => {
  if (!params.records || params.records.length === undefined) {
    $message.error('加入列表的数据为空或不是有效的数组')
    return []
  }

  const uniqueDataIndexes = params.uniqueDataIndexes || [EntityDataSource.ConstObject.keyFiledName]
  // 先做唯一性检查，如果有重复，则不插入，并记录重复的记录数
  const {sameRecords, notSameRecords} = findRecords(renderData.value, params.records, uniqueDataIndexes)

  if (sameRecords.length > 0) {
    global.$notification.warning({
      duration: 5000,
      content: `插入的数据中，${sameRecords.length}条与当前列表的数据一致，不插入这部分数据。`
    })
  }

  const newRows = []
  // 插入经过滤不重复的记录
  notSameRecords.forEach((record: Record<string, any>) => {
    const newRow: Record<string, any> = {}
    props.columns.forEach((col: Column) => {
      let dataIndex: string = col.dataIndex!
      // TODO 序号 CHECK 等专用字段是否需要处理？
      if (!params.ignoreDataIndexes?.includes(dataIndex)) {
        // console.log('record[col.title]',record[`${col.title}`],'record[dataIndex]',record[dataIndex])
        if(params.isColTitleAsKeyField===true){
          newRow[dataIndex] = record[col.title] || record[`"${col.title}"`] || col._component?.value
        }else{
          newRow[dataIndex] = record[dataIndex] || col._component?.value
        }
      }
    })
    newRows.push(newRow)
    console.log('newRows',newRows)
    renderData.value.push(newRow)
  })

  // 如果有删除的记录，需要去掉相应的记录
  const toDeleteRecordsFindResult =  findRecords(renderData.value, toDeleteRecords.value, uniqueDataIndexes)
  toDeleteRecords.value = [...toDeleteRecordsFindResult.notSameRecords]
  // 如果有移除的记录，需要去掉相应的记录
  const toReleaseRecordsFindResult =  findRecords(renderData.value, toReleaseRecords.value, uniqueDataIndexes)
  toReleaseRecords.value = [...toReleaseRecordsFindResult.notSameRecords]

  props.glComponentInst.value = renderData.value
  emits('insertRecords',newRows)
  return newRows
}

/**
 *  表格在编辑模式下，验证表格数据
 *  正确时返回null，错误时返回具体的错误
 */
const validate = async () => {
  const resultList: Array<any> = []
  let error = false
  for (const record of renderData.value) {
    const rowIndex = renderData.value.indexOf(record)
    const result = await validateRecord(record, rowIndex)
    resultList.push({ record, rowIndex, result })
    if (result && Object.keys(result).length > 0) {
      // 有异常
      error = true
    } else {
      // 无异常
    }
  }
  if (error) {
    let validatedError: ValidatedError = {
      label: props.glComponentInst.props.base.label || '列表',
      field: props.glComponentInst.props.id,
      value: '',
      type: '',
      isRequiredError: false,
      message: '验证列表“' + props.glComponentInst.props.base.label + '”不通过',
      // 列表时，附上列表记录
      records: resultList
    }
    return {
      [validatedError.label]: validatedError
    }
  }
  return null
}

const changeRecord = async (
  record: object,
  rowIndex: number,
  columns: GlTableColumn[],
  newValue: any,
  objRef: any
) => {
  const result = await validateRecord(record, rowIndex)
  if (result && Object.keys(result).length > 0) {
    // 有异常
  } else {
    // 无异常
    emits('changeRecord', record, rowIndex, columns, newValue, objRef)
  }
}

const copyRecord = (record: object, rowIndex: number) => {
  const newRecord = JSON.parse(JSON.stringify(record))
  if (newRecord.id) {
    newRecord.id = undefined
  }
  emits('copyRecord', { record: newRecord, rowIndex })
  renderData.value.splice(rowIndex + 1, 0, newRecord)
  // eslint-disable-next-line vue/no-mutating-props
  props.glComponentInst.value = renderData.value
}

/**
 * 解除与主表的引用关系（即删除外键 Delete foreign key）
 * 解除成功时，返回解除的记录，否则返回null
 * @param params
 */
const releaseRecordByIndex = (params:{index: number}) => {
  const { index } = params
  const records = renderData.value.splice(index, 1)
  // eslint-disable-next-line vue/no-mutating-props
  props.glComponentInst.value = renderData.value
  if (records && records.length > 0) {
    const record: { [key: string]: any } = records[0]
    // 如该记录没有id，即表示新添加且未保存的，在点解除时，直接解除，不需要再记录到待解除组数中
    if (record.id) {
      toReleaseRecords.value.push({ id: record.id, [props.subTablePidName]: 1 })
    }
    emits('releaseRecord',  record, index )
    // 同时会触发表络级别的change事件
    emits('change', renderData.value)
    return record
  }
  return null
}

/**
 * 获取标记待解除的记录
 * 是否有解除，由外部决定
 */
const getReleaseRecords = () => {
  return toReleaseRecords.value
}
/**
 * 删除指定索引的记录
 * 删除成功时，返回删除的记录，否则返回null
 * @param params
 */
const deleteRecordByIndex = (params:{index: number}) => {
  const { index } = params
  const records = renderData.value.splice(index, 1)
  // eslint-disable-next-line vue/no-mutating-props
  props.glComponentInst.value = renderData.value
  if (records && records.length > 0) {
    const record: { [key: string]: any } = records[0]
    // 如该记录没有id，即表示新添加且未保存的，在点删除时，直接删除，不需要再记录到待删除组数中
    if (record.id) {
      toDeleteRecords.value.push({ id: record.id, [logicDeleteFieldName]: 1 })
    }
    emits('deleteRecord', { record, rowIndex:index })
    // 同时会触发表络级别的change事件
    emits('change', renderData.value)
    return record
  }
  return null
}

const getRenderData = () => {
  return renderData.value
}

/**
 * 获取标记待删除的记录
 * 是否有删除，由外部决定
 */
const getDeleteRecords = () => {
  return toDeleteRecords.value
}
const getRenderColumns = () => {
  return renderColumns.value
}

const isPageRead = !!pageProvideProxy?.isPageStatusRead()

const tableRef = ref()
const selectAll = (checked: boolean) => {
  return tableRef.value.selectAll(checked)
}
const select = (rowIndex: number, checked: boolean) => {
  return tableRef.value.select(rowIndex, checked)
}

const getRef = () => {
  return tableRef.value
}

/**
 * 克隆组件信息，并将组件的运行时值信息清空为初始状态
 * 如果值为undefined时，若配置了默认值表达式才会正常执行
 * 如果值不为undefined，则不执行默认值表达式
 * @param component
 */
const cloneDeepColumnComponent = (component: ComponentInstance) => {
  const inst = cloneDeep(component)
  inst.value = undefined
  return inst
}

/**
 *  计算出带有插槽的列
 *  这些列中，不包括操作列（即slotName为#的列）
 */
const slotColumnsWithNoOperation = computed(() => {
  return renderColumns.value.filter((column) => {
    return column.slotName && column.slotName !== slotNameOperation
  })
})

defineExpose({
  select,
  selectAll,
  search,
  popupVisibleChange,
  changeShowColumns,
  deleteRecordByIndex,
  releaseRecordByIndex,
  validate,
  validateRecord,
  addRow,
  insertRecords,
  reRender,
  getRenderData,
  getRenderColumns,
  getDeleteRecords,
  getReleaseRecords,
  getRef
})
</script>

<template>
  <a-table
    ref="tableRef"
    class="gl-entity-table-edit"
    v-if="refreshFlag"
    row-key="id"
    :loading="loading"
    :pagination="showPagination === false ? false : _pagination"
    :row-selection="rowSelection"
    :columns="renderColumns"
    :data="renderData"
    :bordered="{ cell: true }"
    :hoverable="true"
    :stripe="true"
    :column-resizable="columnResizable"
    :scroll="scroll"
    :draggable="tableDraggable ? { type: 'handle', width: 40 } : undefined"
    @pageChange="onPageChange"
    @pageSizeChange="onPageSizeChange"
    @change="change"
  >
    <template #titleSlotRequired="{ column }">
      <span class="gl-required">*</span>{{ column.title }}
    </template>
    <template ##="{ record, rowIndex }">
      <a-space :size="0" class="gl-entity-table-cols-opt">
        <a-button
          v-if="showActionCopy"
          type="text"
          size="small"
          @click="copyRecord(record, rowIndex)"
          :disabled="isPageRead || readonly"
          >复制
        </a-button>
        <a-popconfirm
          content="是否删除"
          type="error"
          @ok="deleteRecordByIndex({ index: rowIndex })"
        >
          <a-button
            v-if="showActionDelete"
            type="text"
            status="danger"
            size="small"
            :disabled="isPageRead || readonly || isRowReadonly(rowIndex)"
          >
            删除
          </a-button>
        </a-popconfirm>
        <a-popconfirm
          content="是否解除"
          type="error"
          @ok="releaseRecordByIndex({ index: rowIndex })"
        >
          <a-button
            v-if="showActionRelease"
            type="text"
            status="danger"
            size="small"
            :disabled="isPageRead || readonly || isRowReadonly(rowIndex)"
          >
            解除关联
          </a-button>
        </a-popconfirm>
      </a-space>
    </template>
    <template
      v-for="slotColumn in slotColumnsWithNoOperation"
      v-slot:[slotColumn.slotName]="{ record, rowIndex, column }"
    >
      <template v-if="slotColumn.slotName === SlotNameSeq">
        {{ rowIndex + 1 }}
      </template>
      <div
        class="gl-entity-table-cols-opt"
        :style="{
          'background-color': column._bgColor
            ? evalColumnExpression('_bgColor', { record, column, rowIndex }, pageProvideProxy)
            : ''
        }"
        :class="{
          'gl-validate-error': tableErrors[rowIndex] && tableErrors[rowIndex][column.dataIndex]
        }"
        :title="tableErrors[rowIndex]?.[column.dataIndex]?.message"
      >
        <GlComponent
          v-if="column._component"
          v-model="renderData[rowIndex][column.dataIndex]"
          @update="changeRecord(record, rowIndex, renderColumns, $event, this)"
          :glComponentInst="cloneDeepColumnComponent(column._component)"
          :glCtx="{
            record,
            rowIndex,
            dataIndex: column.dataIndex,
            cellLastValue: renderData[rowIndex][column.dataIndex]
          }"
          :disabled="
            isPageRead ||
            readonly ||
            column._component?.props?.readonly ||
            column._component?.props?.disabled ||
            isRowReadonly(rowIndex)
          "
        ></GlComponent>
        <span class="gl-validate-message">{{
          tableErrors[rowIndex]?.[column.dataIndex]?.message
        }}</span>
      </div>
    </template>
  </a-table>
</template>

<style>
.gl-entity-table-edit .arco-upload-list-item-thumbnail {
  width: 1.5em !important;
  height: 1.5em !important;
}

/* 隐藏分页器中的分页码部分，只显示当前这个列表最多展示多少行 */
.gl-entity-table-edit span.arco-pagination-simple {
  display: none;
}

.gl-entity-table-edit .gl-validate-message {
  display: none;
}

.gl-entity-table-edit .gl-validate-error {
  background-color: rgba(203, 55, 55, 0.15);
}

.gl-entity-table-edit .gl-validate-error .gl-validate-message {
  display: inline-block;
  color: red;
}

.gl-entity-table-edit .arco-table-cell {
  padding: 1px !important;
}

.gl-entity-table-cols-opt {
  text-align: center;
}

.gl-entity-table-cols-opt .arco-btn-icon {
  margin: 0 4px 0 0 !important;
}

.gl-entity-table-cols-opt .arco-btn-size-small {
  padding: 0 4px !important;
}
</style>
