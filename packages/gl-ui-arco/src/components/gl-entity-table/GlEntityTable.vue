<script setup lang="ts">
// @ts-nocheck
import { inject, nextTick, type PropType, type Ref, ref, watch } from 'vue'
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
  EntityReaderOrder
} from '@geelato/gl-ui'
import type { Column, EntityFetchDataProps, GlTableColumn } from './table'
import {
  evalExpression,
  genRenderColumns,
  genShowColumns,
  useFetchData,
  genSlotColumnsWithNoOperation,
  genQueryColumns,
  showAction
} from './table'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
// 直接在template使用$modal，build时会报错，找不到类型，这里进行重新引用定义
const $modal = useGlobal().$modal
// fetch 加载完成数据之后
const emits = defineEmits(['updateColumns', 'fetchSuccess'])
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
  ...mixins.subFormProps,
  isFormSubTable: {
    type: Boolean,
    default() {
      return false
    }
  },
  // isLogicDeleteMode: {
  //   type: Boolean,
  //   default() {
  //     return true
  //   }
  // },
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

const showOptColumn = () => {
  return props.columnActions?.length > 0
}

const formProvideProxy: FormProvideProxy | undefined = props.isFormSubTable
  ? inject(FormProvideKey)
  : undefined
const pageProvideProxy: PageProvideProxy | undefined = inject(PageProvideKey)

// 展示的列，create之后，通过方法调用设置
let localShowDataIndexes: string[] = []
// 隐藏的列，create之后，通过方法调用设置
let localHideDataIndexes: string[] = []
// 用于构建查询语句的列，包含一些隐藏的列；该列的数据基于输入的props.columns进行复制转换
const queryColumns: Ref<GlTableColumn[]> = ref(
  genQueryColumns(props, localShowDataIndexes, localHideDataIndexes)
)
// 可供展示的列，从这些列中选出最终展示的列存在renderColumns
const showColumns: Ref<GlTableColumn[]> = ref(genShowColumns(queryColumns, false, showOptColumn()))
// 最终展示的列
const renderColumns: Ref<GlTableColumn[]> = ref(genRenderColumns(showColumns))

/**
 *  重置所有的列
 */
const resetColumns = () => {
  queryColumns.value = genQueryColumns(props, localShowDataIndexes, localHideDataIndexes)
  showColumns.value = genShowColumns(queryColumns, false)
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

const { loading, setLoading } = useLoading(false)

// 渲染展示的数据与查询出的结果集数据相同，
const renderData = ref<Array<Record<string, any>>>([])

const pagination = ref({
  ...props.pagination
})

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
    emits('fetchSuccess', result)
  }
)

const tableRef = ref()
const selectAll = (checked: boolean) => {
  return tableRef.value.selectAll(checked)
}

let lastEntityReaderParams: Array<EntityReaderParam>
const search = (entityReaderParams: Array<EntityReaderParam>) => {
  // console.log('search entityReaderParams:', entityReaderParams)
  lastEntityReaderParams = entityReaderParams
  fetchData({ params: entityReaderParams })
}
const onPageChange = (pageNo: number) => {
  fetchData({ pageNo, params: lastEntityReaderParams })
}

const onPageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  fetchData({ pageSize, params: lastEntityReaderParams })
}

const onSorterChange = (dataIndex: string, direction: string) => {
  console.log(dataIndex, direction)
  const order: EntityReaderOrder[] = [new EntityReaderOrder(dataIndex, direction)]
  fetchData({ order, params: lastEntityReaderParams })
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

const refreshFlag = ref(true)
// 这个watch 用于设计时，监控列变化时，及时刷新（主要是用于让表达式生效）
if (!props.glIsRuntime) {
  watch(
    () => {
      return props.columns
    },
    () => {
      resetColumns()
      refreshFlag.value = false
      nextTick(() => {
        refreshFlag.value = true
      })
    },
    { deep: true }
  )
}

const copyColumnActions = () => {
  // return cloneDeep(props.columnActions)
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

defineExpose({
  resetColumns,
  search,
  selectAll,
  popupVisibleChange,
  changeShowColumns,
  validate,
  getDeleteRecords,
  getQueryData,
  getRenderData,
  getRenderColumns,
  changeColumnsVisible
})
</script>

<template>
  <a-table
    ref="tableRef"
    class="gl-entity-table"
    v-if="refreshFlag"
    row-key="id"
    :loading="loading"
    :pagination="pagination"
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
    <template ##="{ record, rowIndex }">
      <a-space v-if="record" :size="0" class="gl-entity-table-cols-opt">
        <template
          v-for="(columnAction, index) in copyColumnActions()"
          :key="rowIndex + '_' + index"
        >
          <!--          showAction({record, action:columnAction, rowIndex}, pageProvideProxy!)-->
          <GlComponent
            v-show="
              columnAction.props?._hidden !== true && columnAction.componentName !== 'GlHiddenArea'
            "
            :glComponentInst="columnAction"
            :glCtx="{ record, rowIndex }"
          ></GlComponent>
        </template>
      </a-space>
    </template>
    <template
      v-for="slotColumn in genSlotColumnsWithNoOperation(renderColumns)"
      v-slot:[slotColumn.slotName]="{ record, column, rowIndex }"
    >
      <template v-if="column._component && record">
        <GlComponent
          :glComponentInst="column._component"
          v-model="record[column.dataIndex]"
          :glCtx="{ record, rowIndex }"
        ></GlComponent>
      </template>
      <span v-else>
        {{ evalExpression({ record, column, rowIndex }, pageProvideProxy) }}
      </span>
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
