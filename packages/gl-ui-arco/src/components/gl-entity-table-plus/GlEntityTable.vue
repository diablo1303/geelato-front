<script setup lang="ts">
// @ts-nocheck
import { computed, inject, nextTick, type PropType, type Ref, ref, watch } from 'vue'
import type { TableRowSelection, PaginationProps } from '@arco-design/web-vue'
import useLoading from '../../hooks/loading'
import Sortable from 'sortablejs'
import {
  mixins,
  EntityReaderParam,
  utils,
  useGlobal,
  FormProvideProxy,
  FormProvideKey,
  PageProvideProxy,
  PageProvideKey,
  EntityReaderOrder,
  EntityDataSource, jsScriptExecutor, selectComponent
} from '@geelato/gl-ui'
import {
  type Column,
  type EntityFetchDataProps,
  type GlTableColumn,
  type EntityFetchDataInfo,
  SlotNameSeq,
  SlotNameRecordStatus,
  RecordPushStatusNames
} from './constants'
import {
  evalColumnExpression,
  showOptColumn,
  showRecordStatus,
  showSeqNoColumn,
  genRenderColumns,
  genShowColumns,
  useFetchData,
  genQueryColumns,
  getRecordPushStatus,
  slotNameOperation,
  createEntityReader
} from './table'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import cloneDeep from 'lodash/cloneDeep'
const global = useGlobal()
// fetch 加载完成数据之后
const emits = defineEmits(['updateColumns', 'fetchSuccess', 'fetchFail'])
const props = defineProps({
  /**
   *  绑定的实体名称
   */
  entityName: {
    type: String,
    required: true
  },
  /**
   * 列配置列定义
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
  /**
   *  启用表格内编辑
   */
  enableEdit: {
    type: Boolean,
    default() {
      return false
    }
  },
  /**
   *  是否作为子表，若是则展示列；显示行记录状态
   */
  isFormSubTable: {
    type: Boolean,
    default() {
      return false
    }
  },
  /**
   *  阻断查询表达式
   *  表达式执行结果为true时，触发的查询操作在发出查询事件(emits search)之前会被中断
   *  表达式执行结果为false或undefined时，不中断
   *  表达式为空时不中断
   */
  interdictExpression: String,
  pushedRecordKeys: Array as PropType<string[]>,
  unPushedRecordKeys: Array as PropType<string[]>,

  subTablePidName: {
    type: String
  },
  rowSelection: {
    type: Object as PropType<TableRowSelection>,
    default() {
      return undefined
    }
  },
  size: {
    type: String,
    default() {
      return 'medium'
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
        showJumper: true,
        pageSizeOptions: [5, 10, 15, 20, 30, 40, 50, 100]
      }
    }
  },
  showPagination: {
    type: Boolean,
    default() {
      return true
    }
  },
  /**
   *  是否显示序列号
   */
  showSeqNo: Boolean,
  tableSettingId: {
    type: String,
    required: true
  },
  ...mixins.subFormProps,
  ...mixins.props
})

const isInit = ref(false)
const refreshFlag = ref(true)
const reRender = () => {
  refreshFlag.value = false
  nextTick(() => {
    refreshFlag.value = true
  })
}

const optColumnKey = ref(utils.gid())
/**
 *  更新操作列
 *  由于操作列有可能依赖数据记录值做了展示控制
 *  在查询之后，需要刷新操作列
 */
const refreshOptColumn = () => {
  optColumnKey.value = utils.gid()
}
// 如果作为子表单，需要注入主表，便于获取主表的记录ID
const formProvideProxy: FormProvideProxy | undefined = props.isFormSubTable
  ? inject(FormProvideKey)
  : undefined
const pageProvideProxy: PageProvideProxy | undefined = inject(PageProvideKey)
const isPageRead = !!pageProvideProxy?.isPageStatusRead()

// 展示的列，create之后，通过方法调用设置
let localShowDataIndexes: string[] = []
// 隐藏的列，create之后，通过方法调用设置
let localHideDataIndexes: string[] = []
// 用于构建查询语句的列，包含一些隐藏的列；该列的数据基于输入的props.columns进行复制转换
const queryColumns: Ref<GlTableColumn[]> = ref(
  genQueryColumns(props, localShowDataIndexes, localHideDataIndexes)
)
// 可供展示的列，从这些列中选出最终展示的列存在renderColumns
const showColumns: Ref<GlTableColumn[]> = ref(
  genShowColumns(queryColumns, {
    isShowByComponent: false,
    showOptColumn: showOptColumn(props),
    showSeqNoColumn: showSeqNoColumn(props),
    showRecordStatus: showRecordStatus(props)
  })
)
// 最终查询数据并进行展示的列，注意这些列中_show为false时不展示，但数据仍会查询加载
const renderColumns: Ref<GlTableColumn[]> = ref(genRenderColumns(showColumns))

/**
 *  重置所有的列
 */
const resetColumns = () => {
  // 查询数据库的列
  queryColumns.value = genQueryColumns(props, localShowDataIndexes, localHideDataIndexes)
  // 可展示的列，用于选择哪些展进行展示
  showColumns.value = genShowColumns(queryColumns, {
    isShowByComponent: false,
    showOptColumn: showOptColumn(props),
    showSeqNoColumn: showSeqNoColumn(props),
    showRecordStatus: showRecordStatus(props)
  })
  // 最终展示在列表中的列
  renderColumns.value = genRenderColumns(showColumns)
}
const resetRenderColumns = () => {
  renderColumns.value = genRenderColumns(showColumns)
}
const changeShowColumns = (checked: boolean, column: Column, index: number) => {
  // 改了renderColumn的_checked，即等同于改了showColumn的_checked
  column._checked = checked
  resetRenderColumns()
}

const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById(props.tableSettingId) as HTMLElement
      new Sortable(el, {
        onEnd(e: any) {
          const { oldIndex, newIndex } = e
          utils.arrayMoveItem(showColumns.value, oldIndex, newIndex)
          resetRenderColumns()
          emits('updateColumns', showColumns.value)
        }
      })
    })
  }
}

const { loading } = useLoading(false)

// 渲染展示的数据与查询出的结果集数据相同，
const renderData = ref<Array<Record<string, any>>>([])

const pagination = ref({
  ...props.pagination
})
// 默认分页值
pagination.value.pageSize = props.pagination.defaultPageSize || 15

/**
 * 基于当前的列表查询设置，获取查询对象
 * 该操作，不会更换当前的列表状态信息，如last查询条件、排序等，不会更新UI
 * 该操作主要用于获取查询对象，传到服务端，做多页面的数据导出一起导出
 * @param entityReaderParams 传入当前最新查询条件进行查询
 * @param pageInfo 一般这里pageNo为1，pageSize为需要查询的最大记录数，如excel最多导出5000条，则pageSize为5000。
 */
const getEntityReader = (
  entityReaderParams: Array<EntityReaderParam>,
  pageInfo: {
    pageNo?: number
    pageSize: number
  }
) => {
  const info: EntityFetchDataInfo = {}
  info.pageSize = pageInfo?.pageSize
  info.pageNo = pageInfo.pageNo || 1
  info.order = lastOrder
  info.params = entityReaderParams
  info.pushedRecordKeys = lastPushedRecordKeys
  info.unPushedRecordKeys = lastUnPushedRecordKeys
  return createEntityReader(
    props as EntityFetchDataProps,
    queryColumns.value,
    info,
    formProvideProxy?.getRecordId
  )!
}
/**
 * 加载数据的最终方法，在查询、切换分页等场景中调用
 * @param readerInfo
 */
const fetchData = useFetchData(
  props as EntityFetchDataProps,
  queryColumns,
  pagination,
  formProvideProxy?.getRecordId,
  (result: any) => {
    renderData.value = result.data
    // 刷新操作列
    refreshOptColumn()
    emits('fetchSuccess', result)
  },
  (result: any) => {
    emits('fetchFail', result)
  },
  loading
)

const tableRef = ref()
const selectAll = (checked: boolean) => {
  return tableRef.value.selectAll(checked)
}

const select = (rowIndex: string | number | (string | number)[], checked: boolean) => {
  return tableRef.value.select(rowIndex, checked)
}

// 记录上一次查询的参数、排序等信息，便于在分页等操作时，可以带上这些信息进行查询
let lastEntityReaderParams: Array<EntityReaderParam>
let lastOrder: EntityReaderOrder[] = []
let lastPushedRecordKeys: string[]
let lastUnPushedRecordKeys: string[]

/**
 * 是否需要阻断查询
 * 依据props.interdictExpression检查
 */
const isNeedStopSearch = ()=>{
  let stop = false
  if (props.interdictExpression) {
    stop = jsScriptExecutor.evalExpression(props.interdictExpression, {
      pageProxy: pageProvideProxy
    })
  }
  if(stop){
    // global.$message.warning('查询条件不符合要求，查询被阻断')
  }
  return stop
}

const search = (
  entityReaderParams: Array<EntityReaderParam>,
  pushedRecordKeys: string[],
  unPushedRecordKeys: string[]
) => {
  if (isNeedStopSearch()) {
    return
  }
  // console.log('search entityReaderParams:', entityReaderParams)
  lastEntityReaderParams = entityReaderParams
  lastPushedRecordKeys = pushedRecordKeys
  lastUnPushedRecordKeys = unPushedRecordKeys
  fetchData({
    order: lastOrder,
    params: entityReaderParams,
    pushedRecordKeys: lastPushedRecordKeys,
    unPushedRecordKeys: lastUnPushedRecordKeys
  })
}
const onPageChange = (pageNo: number) => {
  if (isNeedStopSearch()) {
    return
  }
  fetchData({
    pageNo,
    order: lastOrder,
    params: lastEntityReaderParams,
    pushedRecordKeys: lastPushedRecordKeys,
    unPushedRecordKeys: lastUnPushedRecordKeys
  })
}

const onPageSizeChange = (pageSize: number) => {
  if (isNeedStopSearch()) {
    return
  }
  pagination.value.pageSize = pageSize
  fetchData({
    pageSize,
    order: lastOrder,
    params: lastEntityReaderParams,
    pushedRecordKeys: lastPushedRecordKeys,
    unPushedRecordKeys: lastUnPushedRecordKeys
  })
}

/**
 * @param dataIndex 排序字段
 * @param direction 排序方向
 */
const onSorterChange = (dataIndex: string, direction: string) => {
  if (isNeedStopSearch()) {
    return
  }
  if (!direction) {
    // 如果清空了当前字段的排序
    lastOrder = []
  } else {
    lastOrder = [new EntityReaderOrder(dataIndex, direction)]
  }
  fetchData({
    order: lastOrder,
    params: lastEntityReaderParams,
    pushedRecordKeys: lastPushedRecordKeys,
    unPushedRecordKeys: lastUnPushedRecordKeys
  })
}

/**
 * 设置哪些列不可见、可见
 * 不指定的列保持原状
 * @param showDataIndexes 可见的列
 * @param hideDataIndexes 不可见的列
 */
const changeColumnsVisible = (showDataIndexes: string[], hideDataIndexes: string[]) => {
  localHideDataIndexes = hideDataIndexes
  localShowDataIndexes = showDataIndexes
  resetColumns()
}

const getQueryData = () => {
  return renderData.value
}
const getRenderData = () => {
  return renderData.value
}
const getRenderColumns = () => {
  return renderColumns.value
}

watch(
  () => showColumns.value,
  (val) => {
    emits('updateColumns', val)
  },
  { deep: true, immediate: true }
)

// 这个watch 用于设计时，监控列变化时，及时刷新（主要是用于让表达式生效）
if (!props.glIsRuntime) {
  watch(
    () => {
      return props.columns
    },
    () => {
      console.log('props.columns changed')
      resetColumns()
      reRender()
    },
    { deep: true }
  )
}

const copyColumnActions = () => {
  return JSON.parse(JSON.stringify(props.columnActions))
  // return props.columnActions
}

/**
 *  非编辑模式，不能验证，默认返回无错误，即null
 */
const validate = async () => {
  return null
}

const getDeleteRecords = () => {
  return []
}

const getRef = () => {
  return tableRef.value
}

/**
 * 获取记录状态
 * @param key
 */
const getRecordStatus = (key: string) => {
  return RecordPushStatusNames[
    getRecordPushStatus(key, props.pushedRecordKeys, props.unPushedRecordKeys)
  ]
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
  getEntityReader,
  resetColumns,
  search,
  select,
  selectAll,
  popupVisibleChange,
  changeShowColumns,
  validate,
  getDeleteRecords,
  getQueryData,
  getRenderData,
  getRenderColumns,
  changeColumnsVisible,
  getRef
})
</script>

<template>
  <a-table
    ref="tableRef"
    class="gl-entity-table"
    v-if="refreshFlag"
    :row-key="EntityDataSource.ConstObject.keyFiledName"
    :loading="loading"
    :pagination="showPagination === false ? false : pagination"
    :rowSelection="rowSelection"
    :columns="renderColumns"
    :data="renderData"
    :bordered="{ cell: true }"
    :hoverable="true"
    :stripe="true"
    :column-resizable="columnResizable"
    :scroll="{}"
    @page-change="onPageChange"
    @page-size-change="onPageSizeChange"
    @sorter-change="onSorterChange"
  >
    <template ##="{ rowIndex }">
      <a-space
        :key="optColumnKey"
        v-if="renderData[rowIndex]"
        :size="0"
        class="gl-entity-table-cols-opt"
      >
        <template
          v-for="(columnAction, index) in copyColumnActions()"
          :key="rowIndex + '_' + index"
        >
          <GlComponent
            v-show="
              columnAction.props?._hidden !== true && columnAction.componentName !== 'GlHiddenArea'
            "
            :glComponentInst="columnAction"
            :glIsRuntime=glIsRuntime
            @click="selectComponent($event, columnActions[index])"
            :glCtx="{ record: renderData[rowIndex], rowIndex }"

          ></GlComponent>
        </template>
      </a-space>
    </template>
    <!-- 带插槽的列，即自下定义列 -->
    <template
      v-for="slotColumn in slotColumnsWithNoOperation"
      v-slot:[slotColumn.slotName]="{ column, rowIndex }"
    >
      <template v-if="column._icon">
        <gl-iconfont
          :type="
            evalColumnExpression(
              '_icon',
              { record: renderData[rowIndex], column, rowIndex },
              pageProvideProxy
            )
          "
          style="margin-right: 4px"
        />
      </template>
      <!-- 如果只是配置了图标，字段内容渲染未用自下定义渲染，则在此直接展示内容 -->
      <template v-if="column._noCustomRender">
        {{ renderData[rowIndex][column.dataIndex] }}
      </template>
      <template v-else>
        <template v-if="slotColumn.slotName === SlotNameSeq">
          {{ rowIndex + 1 }}
        </template>
        <template v-else-if="slotColumn.slotName === SlotNameRecordStatus">
          {{ getRecordStatus(renderData[rowIndex][EntityDataSource.ConstObject.keyFiledName]) }}
        </template>
        <template v-else-if="column._component && renderData[rowIndex]">
          <GlComponent
            v-model="renderData[rowIndex][column.dataIndex]"
            :glComponentInst="cloneDeep(column._component)"
            :glCtx="{
              record: renderData[rowIndex],
              rowIndex,
              dataIndex: column.dataIndex,
              cellLastValue: renderData[rowIndex][column.dataIndex]
            }"
            :disabled="
              isPageRead || column._component?.props?.readonly || column._component?.props?.disabled
            "
          ></GlComponent>
        </template>
        <template v-else>
          <span
            v-html="
              evalColumnExpression(
                '_renderScript',
                { record: renderData[rowIndex], column, rowIndex },
                pageProvideProxy
              )
            "
          />
        </template>
      </template>
    </template>
  </a-table>
</template>

<style>
.gl-entity-table-cols-opt {
  text-align: center;
}

.gl-entity-table-cols-opt .arco-btn-icon {
  margin: 0 4px 0 0 !important;
}

.gl-entity-table-cols-opt .arco-btn-size-small {
  padding: 0 4px !important;
}

.gl-entity-table .gl-validate-message {
  display: none;
}

.gl-entity-table .gl-validate-error .gl-component {
  background-color: #fde5e5;
}

.gl-entity-table .gl-validate-error .gl-validate-message {
  display: inline-block;
  color: red;
}
</style>
