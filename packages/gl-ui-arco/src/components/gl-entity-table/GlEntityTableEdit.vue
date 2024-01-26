<script setup lang="ts">
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
  utils,
  useGlobal,
  FormProvideProxy,
  FormProvideKey,
  PageProvideProxy,
  PageProvideKey
} from '@geelato/gl-ui'
import type { Column, GlTableColumn } from './table'
import { Schema } from 'b-validate'
import { evalColorExpression, evalExpression, exchangeArray, logicDeleteFieldName } from './table'
import { mixins } from '@geelato/gl-ui'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
// 直接在template使用$modal，build时会报错，找不到类型，这里进行重新引用定义
const $modal = useGlobal().$modal
// fetch 加载完成数据之后
const emits = defineEmits(['updateColumns', 'updateRow', 'fetchSuccess'])
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
        pageSize: 15,
        showTotal: true,
        showPageSize: true,
        pageSizeOptions: [5, 10, 15, 20, 30, 40, 50]
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
  ...mixins.props
})

const formProvideProxy: FormProvideProxy | undefined = inject(FormProvideKey)
const pageProvideProxy: PageProvideProxy | undefined = inject(PageProvideKey)
let recordSchema = new Schema({})

const slotNameFlag = '__slot'

const setSlotNames = () => {
  // 不管是否编辑状态，如查配置了自定义渲染脚本，需要确认列有slotName
  props.columns.forEach((col: Column) => {
    if (col._renderScript) {
      col.slotName = col.slotName || utils.gid(slotNameFlag, 20)
    } else {
      delete col.slotName
    }
  })

  // 对于编辑状态
  // 如果启用编辑，需将column中没有设置插槽的，生成插槽
  props.columns.forEach((col: Column) => {
    if (col._component) {
      col.slotName = col.slotName || utils.gid(slotNameFlag, 20)
      col.dataIndex = col.dataIndex || col._component.props.bindField?.fieldName
      // 验证信息
      if (col._component.props.rules) {
        recordSchema.schema[col.dataIndex!] = toRaw(col._component.props.rules)
      }
    } else {
      col.slotName = undefined
    }
  })

  // console.log('GlEntityTable > columns after convert:', recordSchema)
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
setSlotNames()
// 这个watch 用于设计时，监控列变化时，及时刷新（主要是用于让表达式生效）
if (!props.glIsRuntime) {
  watch(
    () => {
      return props.columns
    },
    () => {
      reRender()
    },
    { deep: true }
  )
}

/**
 *  基于是否启用编辑功能，进行插槽信息的转换
 */
// watch(() => props.enableEdit,
//     () => {
//       setSlotNames()
//     },
//     {immediate: true}
// )

const { loading, setLoading } = useLoading(false)
// const {t} = CheckUtil.isBrowser() ? useI18n() : {
//   t: () => {
//   }
// };
const t = (str: any) => {
  return str
}
// 渲染展示的数据
props.glComponentInst.value = props.glComponentInst.value || []
// @ts-ignore
const renderData: Ref<Array<object>> = ref(props.glComponentInst.value)

// 编辑状态时删除的数据，
const deleteDataWhenEnableEdit = ref<Array<{ id: string; [logicDeleteFieldName]: number }>>([])
const resetDeleteDataWhenEnableEdit = () => {
  deleteDataWhenEnableEdit.value = []
}
const pagination = reactive({
  ...props.pagination
})

/**
 *  表格列定义转换
 *  如果启用了多语言，则需要对标题进行翻译
 *  对于一些特殊的列，设置默认值，如ID的宽度
 */
const columns = computed<GlTableColumn[]>(() => {
  let columnData: Array<GlTableColumn> = []
  if (props.columns) {
    columnData = JSON.parse(JSON.stringify(props.columns))
    columnData.forEach((item: GlTableColumn) => {
      // console.log("gl-entity-table > columns item:", item, item.title);
      item.title = item._component?.props?.label ? t(item._component?.props?.label + '') : ''
      // 增加必填标识
      // @ts-ignore
      if (item._component?.props?.rules?.length > 0) {
        // @ts-ignore
        const foundIndex = item._component.props.rules.findIndex((rule) => {
          return rule.required === true && rule.ruleName === 'required'
        })
        if (foundIndex >= 0) {
          item._required = true
          item.titleSlotName = 'titleSlotRequired'
        }
      }
      // ID width
      if (item.dataIndex === 'id' && !item.width) {
        item.width = 160
      }
    })
  }
  return columnData
})

const createEntityReader = () => {
  let entityReader = new EntityReader()
  entityReader.entity = props.entityName
  entityReader.order = []

  const fieldMetas = new Array<FieldMeta>()
  props.columns?.forEach((column) => {
    // 过滤掉操作列
    if (column.slotName !== 'optional') {
      const fm = new FieldMeta()
      // @ts-ignore
      fm.name = column.dataIndex
      // @ts-ignore
      fm.title = column.title
      fieldMetas.push(fm)
    }
  })
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
  resetDeleteDataWhenEnableEdit()
  // 绑定了有效的实体才发起查询
  // 作为子表时，必须指定子表外键，即对应主表ID的字段
  if (!props.entityName || (props.isFormSubTable && !props.subTablePidName)) {
    return
  }
  setLoading(true)
  try {
    const entityReader = createEntityReader()
    entityReader.params = readerInfo?.params || []

    // 如果是子查询
    // 增加父表单主键，作为查询字段，若父表单无该主健id，则返回，不查询
    if (props.isFormSubTable) {
      const pid = formProvideProxy?.getRecordId()
      if (!pid) {
        return
      }
      entityReader.params.push(new EntityReaderParam(props.subTablePidName, 'eq', pid))
    }

    // 逻辑删除模式下，增加逻辑删除的数据过滤条件
    if (props.isLogicDeleteMode) {
      entityReader.params.push(new EntityReaderParam(logicDeleteFieldName, 'eq', 0))
    }
    entityReader.pageSize = readerInfo?.pageSize || pagination.pageSize!
    const response: any = await entityApi.queryByEntityReader(entityReader)
    // console.log('GlEntityTable > fetchData() > response:', response)
    renderData.value = response.data
    pagination.pageSize = readerInfo?.pageSize || pagination.pageSize
    pagination.current = readerInfo?.pageNo || 1
    pagination.total = response.data.total
    emits('fetchSuccess', { data: renderData.value, pagination })
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

/**
 *  编辑页面的数据量不会太大，这里直接Watch数据的变化，不用在页面中配置值改变之后刷新列表
 */
watch(
  () => {
    return props.glComponentInst.value
  },
  () => {
    // console.log('update value:', props.glComponentInst.value)
    renderData.value = []
    renderData.value = [...props.glComponentInst.value]
  },
  { deep: true }
)

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

// cloneColumns:TableColumnData[]
const cloneColumns = ref<Column[]>([])
const showColumns = ref<Column[]>([])
const changeShowColumns = (
  checked: boolean | (string | boolean | number)[],
  column: Column,
  index: number
) => {
  if (!checked) {
    cloneColumns.value = showColumns.value.filter((item) => item.dataIndex !== column.dataIndex)
  } else {
    cloneColumns.value.splice(index, 0, column)
  }
}
const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById(props.tableSettingId) as HTMLElement
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const { oldIndex, newIndex } = e
          exchangeArray(cloneColumns.value, oldIndex, newIndex)
          exchangeArray(showColumns.value, oldIndex, newIndex)
          emits('updateColumns', showColumns.value)
        }
      })
    })
  }
}

const optColumn = { title: '操作', slotName: '#', fixed: 'right', width: 140, align: 'center' }
const scroll = {
  x: '100%'
}
watch(
  () => columns.value,
  (val) => {
    // val.forEach((col) => {
    //   // @ts-ignore
    //   col.title = col._component?.props.label
    // })
    // @ts-ignore
    cloneColumns.value = cloneDeep(val)
    cloneColumns.value.forEach((item, index) => {
      item.checked = true
      item.width = item.width || 150
      item.align = item.align || 'center'
    })
    cloneColumns.value.push(optColumn as Column)
    showColumns.value = cloneDeep(cloneColumns.value)
    // console.log('GlEntityTable > update cloneColumns:', cloneColumns)
    emits('updateColumns', showColumns.value)
  },
  { deep: true, immediate: true }
)

// const evalExpression = (data: {
//   record: TableData;
//   column: GlTableColumn;
//   rowIndex: number;
// }) => {
//   const ctx = {
//     pageProxy: pageProvideProxy,
//     record: toRaw(data.record),
//     column: toRaw(data.column),
//     rowIndex: toRaw(data.rowIndex),
//   };
//   return jsScriptExecutor.evalExpression(ctx.column._renderScript, ctx);
// };

/**
 *  计算出带有插槽的列
 *  这些列中，不包括操作列（即slotName为#的列）
 */
const slotColumns = computed(() => {
  return cloneColumns.value.filter((column) => {
    return column.slotName && column.slotName !== '#'
  })
})

/**
 *  在表格修改状态下，验证表格的一行数据
 */
const validateRecord = (record: object, rowIndex: number) => {
  // let validateStatus = 'start'
  // let result: { [key: string]: any } = {}
  // recordSchema.validate(record, (err: any) => {
  //   result = err
  //   validateStatus = 'end'
  // })
  // let times = 1000
  // while (validateStatus === 'start') {
  //   // console.log('sleep 5ms and validate status:', validateStatus)
  //   utils.sleep(5)
  //   times--
  //   if (times <= 0) {
  //     break
  //   }
  // }
  // // console.log('validate record:', toRaw(record), 'rowIndex:', rowIndex, 'and get result:', result, 'cloneColumns:', cloneColumns.value)
  // setError(record, rowIndex, result)
  // return result
  return new Promise<{ [key: string]: any }>((resolve: Function) => {
    recordSchema.validate(record, (err: any) => {
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
tableErrors.value.length = cloneColumns.value.length
const setError = (record: object, rowIndex: number, err: { [key: string]: any }) => {
  // console.log('setError',record,rowIndex,err)
  if (!err) {
    tableErrors.value[rowIndex] = null
    return
  }
  tableErrors.value[rowIndex] = tableErrors.value[rowIndex] = {}
  cloneColumns.value.forEach((col: Column) => {
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
 *  表格在编辑模式下，添加行
 *  设置列的dataIndex让其与绑定的组件一致
 */
const addRow = () => {
  const newRow = {}
  props.columns.forEach((col: Column) => {
    //@ts-ignore
    newRow[col.dataIndex] = col._component?.value
  })
  renderData.value.push(newRow)
  props.glComponentInst.value = renderData.value
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
  if(error)return resultList
  return null
}

const updateRow = async (record: object, rowIndex: number, columns: GlTableColumn[]) => {
  const result = await validateRecord(record, rowIndex)
  if (result && Object.keys(result).length > 0) {
    // 有异常
  } else {
    // 无异常
    emits('updateRow', { record, rowIndex, columns })
  }
}

const copyRecord = (record: object, rowIndex: number) => {
  const newRecord = JSON.parse(JSON.stringify(record))
  if (newRecord.id) {
    newRecord.id = undefined
  }
  renderData.value.splice(rowIndex + 1, 0, newRecord)
  // eslint-disable-next-line vue/no-mutating-props
  props.glComponentInst.value = renderData.value
}
const deleteRecord = (record: object, rowIndex: number) => {
  const records = renderData.value.splice(rowIndex, 1)
  // eslint-disable-next-line vue/no-mutating-props
  props.glComponentInst.value = renderData.value
  if (records && records.length > 0) {
    const record: { [key: string]: any } = records[0]
    // 如可该记录没有id，即表示新添加且未保存的，在点删除时，直接删除，不需要再记录到待删除组数中
    if (record.id) {
      deleteDataWhenEnableEdit.value.push({ id: record.id, [logicDeleteFieldName]: 1 })
    }
  }
  // console.log('deleteDataWhenEnableEdit:', deleteDataWhenEnableEdit)
}

const getRenderData = () => {
  return renderData.value
}

const getDeleteRecords = () => {
  return deleteDataWhenEnableEdit.value
}
const getRenderColumns = () => {
  return cloneColumns.value
}

const isPageRead = !!pageProvideProxy?.isPageStatusRead()

const tableRef = ref()
const selectAll = (checked: boolean) => {
  return tableRef.value.selectAll(checked)
}

const getRef = () => {
  return tableRef.value
}

defineExpose({
  selectAll,
  search,
  popupVisibleChange,
  changeShowColumns,
  validate,
  validateRecord,
  addRow,
  reRender,
  getRenderData,
  getRenderColumns,
  getDeleteRecords,
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
    :pagination="false"
    :row-selection="rowSelection"
    :columns="cloneColumns"
    :data="renderData"
    :bordered="{ cell: true }"
    :hoverable="true"
    :stripe="true"
    :column-resizable="columnResizable"
    :scroll="scroll"
    @page-change="onPageChange"
    @page-size-change="onPageSizeChange"
  >
    <template #titleSlotRequired="{ column }">
      <span class="gl-required">*</span>{{ column.title }}
    </template>
    <template ##="{ record, rowIndex }">
      <a-space :size="0" class="gl-entity-table-cols-opt">
        <a-button type="text" size="small" @click="copyRecord(record, rowIndex)" :disabled="isPageRead"
          >复制
        </a-button>
        <a-button
          type="text"
          status="danger"
          size="small"
          @click="deleteRecord(record, rowIndex)"
          :disabled="isPageRead"
        >
          删除
        </a-button>
      </a-space>
    </template>
    <template v-for="column in slotColumns" v-slot:[column.slotName]="{ record, rowIndex }">
      <div
        class="gl-entity-table-cols-opt"
        :style="{
          'background-color': column._bgColor
            ? evalColorExpression({ record, column, rowIndex }, pageProvideProxy)
            : ''
        }"
        :class="{
          'gl-validate-error': tableErrors[rowIndex] && tableErrors[rowIndex][column.dataIndex]
        }"
        :title="tableErrors[rowIndex]?.[column.dataIndex]?.message"
      >
        <GlComponent
          v-model="renderData[rowIndex][column.dataIndex]"
          @update="updateRow(record, rowIndex, cloneColumns)"
          :glComponentInst="cloneDeep(column._component)"
          :glCtx="{
            record,
            rowIndex,
            dataIndex: column.dataIndex,
            cellLastValue: renderData[rowIndex][column.dataIndex]
          }"
          :disabled="isPageRead||column._component?.props?.readonly||column._component?.props?.disabled"
        ></GlComponent>
                <span class="gl-validate-message">{{ tableErrors[rowIndex]?.[column.dataIndex]?.message }}</span>
      </div>
    </template>
  </a-table>
</template>

<style>
.gl-entity-table-edit .arco-upload-list-item-thumbnail {
  width: 1.5em !important;
  height: 1.5em !important;
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
