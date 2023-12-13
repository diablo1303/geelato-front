<script lang="ts">
/**
 *  整合gl-query、gl-toolbar、gl-table形成完整可直接使用的table应用
 */
export default {
  name: 'GlEntityTablePlus'
}
</script>
<script setup lang="ts">
// @ts-nocheck
import GlQuery from '../gl-query/index.vue'
import GlToolbar from '../gl-toolbar/index.vue'
import GlEntityTable from '../gl-entity-table/GlEntityTable.vue'
import GlEntityTableEditable from '../gl-entity-table/GlEntityTableEdit.vue'
import { computed, inject, onMounted, type PropType, ref, type Ref } from 'vue'
import type { EntityReaderParam } from '@geelato/gl-ui'
import QueryItem from '../gl-query/query'
import cloneDeep from 'lodash/cloneDeep'
import {
  type SizeProps,
  type Column,
  defaultTable,
  type GlTableColumn,
  BaseInfo
} from '../gl-entity-table/table'
import Toolbar, { defaultToolbar } from '../gl-toolbar/toolbar'
import { useI18n } from 'vue-i18n'
import {
  entityApi,
  PageProvideKey,
  PageProvideProxy,
  GlIconfont,
  utils,
  mixins,
  CheckUtil,
  useGlobal,
  EntitySaver,
  GetEntitySaversResult
} from '@geelato/gl-ui'
import type { Action } from '../../types/global'
import type { TableData, TableColumnData } from '@arco-design/web-vue'
const global = useGlobal()

/**
 *  change:在表格编辑状态时，更换表格数据时触发
 */
const emits = defineEmits([
  'changeRecord',
  'fetchSuccess',
  'select',
  'selectionChange',
  'rowClick',
  'cellClick',
  'headerClick',
  'columnResize',
  'rowDblclick',
  'cellDblclick',
  'rowContextmenu',
  'cellContextmenu'
])
const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const isRead = !!pageProvideProxy?.isPageStatusRead()
const { t } = CheckUtil.isBrowser()
  ? useI18n()
  : {
      t: (str: any) => {
        return str
      }
    }
// const t = (str: any) => {
//   return str
// }

const props = defineProps({
  base: {
    type: Object as PropType<BaseInfo>,
    required: true,
    default() {
      return new BaseInfo()
    }
  },
  query: {
    type: Array as PropType<Array<QueryItem>>,
    required: true,
    default() {
      return []
    }
  },
  toolbar: {
    type: Object as PropType<Toolbar>,
    required: true,
    default() {
      return defaultToolbar
    }
  },
  columns: {
    type: Array as PropType<GlTableColumn[]>,
    required: true,
    default() {
      return defaultTable
    }
  },
  /**
   *  列上的操作配置
   */
  columnActions: {
    type: Array as PropType<Action[]>,
    default() {
      return []
    }
  },
  size: {
    type: String as PropType<SizeProps>
  },
  ...mixins.props
})

// 数据预处理
onMounted(() => {
  props.columns.forEach((item, index) => {
    if (item._renderFnBody) {
      const fn = `(record,column,rowIndex)=>{return ${item._renderFnBody}}`
      // eslint-disable-next-line no-eval
      item.render = eval(fn)
    }
  })
  // console.log("转换后的table:", props.columns);
})

const tableSettingId = utils.gid('tSetting', 20)
const size = ref<SizeProps>(props.size || 'medium')
const densityList = computed(() => [
  {
    name: t('searchTable.size.mini'),
    value: 'mini'
  },
  {
    name: t('searchTable.size.small'),
    value: 'small'
  },
  {
    name: t('searchTable.size.medium'),
    value: 'medium'
  },
  {
    name: t('searchTable.size.large'),
    value: 'large'
  }
])
const exchangeArray = <T extends Array<any>>(
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

const handleSelectDensity = (val: string | number | Record<string, any> | undefined, e: Event) => {
  size.value = val as SizeProps
}

// 用于工具条中控制哪些列显示与否
const showColumns: Ref<GlTableColumn[]> = ref([])
const tableRef = ref()
// const search = (queryFormModal: object) => {
//   tableRef.value.search(queryFormModal);
// };
const popupVisibleChange = (val: boolean) => {
  tableRef.value.popupVisibleChange(val)
}
const changeShowColumns = (
  checked: boolean | (string | boolean | number)[],
  column: Column,
  index: number
) => {
  tableRef.value.changeShowColumns(checked, column, index)
}
const updateColumns = (showColumnsValue: GlTableColumn[]) => {
  showColumns.value = showColumnsValue
}
/**
 * 更新行数据
 * @param data
 */
const onUpdateRow = (data: { record: object; rowIndex: number; columns: GlTableColumn }) => {
  // console.log('GlEntityTablePlus > onUpdateRow() > data:', data)
  emits('changeRecord', data)
}

let lastEntityReaderParams: Array<EntityReaderParam>
// 在初始化（init）时，GlQuery组件的事件会触发：@search="onSearch"
const onSearch = (entityReaderParams: Array<EntityReaderParam>) => {
  // console.log("onSearch() > entityReaderParams:", entityReaderParams);
  if (tableRef.value) {
    selectedKeys.value = []
    tableRef.value.selectAll(false)
    tableRef.value.search(entityReaderParams)
    lastEntityReaderParams = entityReaderParams
  }
}
const refresh = (event?: MouseEvent) => {
  onSearch(lastEntityReaderParams)
}

/**
 *  如果在页面渲染后，由表格组件外部动态调整列不可见等，需要resetColumns生效
 */
const resetColumns = () => {
  tableRef.value.resetColumns()
}

/**
 * 设置哪些列不可见、可见
 * 不指定的列保持原状
 * @param hideDataIndexes 不可见的列
 * @param showDataIndexes 可见的列
 */
const changeColumnsVisible = (hideDataIndexes: string[], showDataIndexes: string[]) => {
  tableRef.value.changeColumnsVisible(hideDataIndexes, showDataIndexes)
}

const queryRef = ref(null)
const addRow = () => {
  tableRef.value.addRow()
}
const selectedKeys: Ref<string[]> = ref([])

/**
 * 删除行，并刷新
 * @param params
 */
const deleteRecord = (params: Record<string, any>) => {
  // console.log('deleteRecord() > params:', params)
  if (!params || !params.id) {
    console.error('基于记录id进行删除失败，未配置参数id。')
    return
  }
  return entityApi.deleteById(props.base.entityName, params.id).then(() => {
    refresh()
  })
}

/**
 * 删除行，并刷新
 * @param params
 */
const deleteRecordWithConfirm = (params: Record<string, any>) => {
  if (!params || !params.id) {
    console.error('基于记录id进行删除失败，未配置参数id。')
    return
  }
  global.$modal.confirm({
    width: '15em',
    title: '危险操作',
    content: '是否确定删除？',
    onOk: () => {
      deleteRecord(params)
    },
    onCancel: () => {}
  })
}

/**
 * 删除已选择的行，并刷新
 * @param withConfirm 是否带确认提醒，默认为否
 */
const deleteSelectedRecords = (withConfirm?: boolean) => {
  if (selectedKeys.value && selectedKeys.value.length > 0) {
    if (withConfirm === true) {
      global.$modal.confirm({
        width: '15em',
        title: '危险操作',
        content: '是否确定删除？',
        onOk: () => {
          entityApi.deleteByIds(props.base.entityName, selectedKeys.value).then(() => {
            refresh()
          })
        },
        onCancel: () => {}
      })
    } else {
      return entityApi.deleteByIds(props.base.entityName, selectedKeys.value).then(() => {
        refresh()
      })
    }
  } else {
    global.$notification.warning({ content: '请先选择记录' })
  }
}
/**
 * 删除已选择的行，并刷新，带删除确认提醒
 */
const deleteSelectedRecordsWithConfirm = () => {
  return deleteSelectedRecords(true)
}

/**
 * 点击行选择器时触发
 * @param rowKeys
 * @param rowKey
 * @param record
 */
const select = (rowKeys: string | number[], rowKey: string | number, record: TableData) => {
  emits('select', rowKeys, rowKey, record)
}

/**
 * 已选择的数据行发生改变时触发
 * @param rowKeys (string | number)[]
 */
const selectionChange = (rowKeys: []) => {
  selectedKeys.value = rowKeys
  emits('selectionChange', rowKeys)
}

/**
 * 点击行数据时触发
 * @param record
 * @param ev
 */
const rowClick = (record: TableData, ev: Event) => {
  if (props.base.clickAsCheck) {
    tableRef.value.getRef().select(record.key || record.id)
  }
  emits('rowClick', record, ev)
}

/**
 * 点击单元格时触发
 * @param record
 * @param column
 * @param ev
 */
const cellClick = (record: TableData, column: TableColumnData, ev: Event) => {
  emits('cellClick', record, column, ev)
}

/**
 * 点击表头数据时触发
 * @param column
 * @param ev
 */
const headerClick = (column: TableColumnData, ev: Event) => {
  emits('headerClick', column, ev)
}

/**
 * 调整列宽时触发
 * @param dataIndex
 * @param width
 */
const columnResize = (dataIndex: string, width: number) => {
  emits('columnResize', dataIndex, width)
}

/**
 * 双击行数据时触发
 * @param record
 * @param ev
 */
const rowDblclick = (record: TableData, ev: Event) => {
  emits('rowDblclick', record, ev)
}

/**
 * 双击单元格时触发
 * @param record
 * @param column
 * @param ev
 */
const cellDblclick = (record: TableData, column: TableColumnData, ev: Event) => {
  emits('cellDblclick', record, column, ev)
}

/**
 * 右击行数据时触发
 * @param record
 * @param ev
 */
const rowContextmenu = (record: TableData, ev: Event) => {
  emits('rowContextmenu', record, ev)
}

/**
 * 右击单元格时触发
 * @param record
 * @param column
 * @param ev
 */
const cellContextmenu = (record: TableData, column: TableColumnData, ev: Event) => {
  emits('cellContextmenu', record, column, ev)
}

const rowSelection = computed(() => {
  return props.base.checkType === 'checkbox' || props.base.checkType === 'radio'
    ? {
        type: props.base.checkType,
        showCheckedAll: props.base.showCheckAll && props.base.checkType === 'checkbox'
      }
    : undefined
})

const getRenderData = () => {
  return tableRef.value.getRenderData()
}
const getRenderRecord = () => {
  return tableRef.value.getRenderData()
}

const getSelectedRecords = () => {
  return getRenderData().filter((record: Record<string, any>) => {
    return selectedKeys.value.includes(record.id)
  })
}

/**
 *  获取已选择记录的第一行
 */
const getFirstSelectedRecord = () => {
  const records = getSelectedRecords()
  if (records && records.length > 0) {
    return records[0]
  } else {
    return {}
  }
}

/**
 *  获取已选择记录的最后一行
 */
const getLastSelectedRecord = () => {
  const records = getSelectedRecords()
  if (records && records.length > 0) {
    return records[records.length - 1]
  } else {
    return {}
  }
}

const hasSelectedRecords = () => {
  return getSelectedRecords().length > 0
}

const getRenderColumns = () => {
  return tableRef.value.getRenderColumns()
}
const getDeleteData = () => {
  return tableRef.value.getDeleteRecords()
}
const getDeleteRecords = () => {
  return tableRef.value.getDeleteRecords()
}

const validate = () => {
  return tableRef.value.validate()
}

const reRender = () => {
  return tableRef.value.reRender()
}
const onFetchSuccess = (args: { data: []; pagination: object }) => {
  // @ts-ignore
  props.glComponentInst.value = args.data
  emits('fetchSuccess', args)
}

const entityTable = computed(() => {
  return props.base?.enableEdit ? GlEntityTableEditable : GlEntityTable
})

/**
 * 创建表格的实体保存对象，可被父表单调用，集到父表单一起保存
 * @param subFormPidValue 作为子表单时，本表单中，指向父表单ID的字段值
 * @param isSelectedOnly 是否只生成选择部分的记录，否则为当前渲染的记录集
 */
const createEntitySavers = (subFormPidValue?: string, isSelectedOnly?: boolean) => {
  const entitySavers: EntitySaver[] = []
  // 处理需保存的子表单数据
  // const renderColumns = getRenderColumns()
  const subFormTableData = isSelectedOnly ? getSelectedRecords() : getRenderData()
  // 子表中，对应主表单ID的字段名
  const subTablePidName = props.base.subTablePidName!
  // console.log(
  //   'GlEntityTablePlus > createEntitySavers() > subTablePidName:',
  //   subTablePidName,
  //   'subFormPidValue:',
  //   subFormPidValue,
  //   'subFormTableData:',
  //   subFormTableData ? JSON.parse(JSON.stringify(subFormTableData)) : subFormTableData
  // )
  if (subFormTableData && subFormTableData.length > 0) {
    subFormTableData.forEach((record: Record<any, any>) => {
      // 设置主表父ID
      // 如果是新增，则采用变量，在后台保存主表单后，更换该值 $parent.id
      // 如果是修改，则直接获取当前的entityRecordId
      if (subTablePidName) {
        record[subTablePidName] = subFormPidValue
      }
      const entitySaver = new EntitySaver(props.base.entityName)
      entitySaver.pidName = props.base.subTablePidName
      entitySaver.record = record
      entitySavers.push(entitySaver)
    })
  }
  // 处理需删除子表单数据
  // 当前为逻辑删除，可依据子表的isLogicDeleteMode来区分
  // console.log('GlEntityForm > saveForm() > getDeleteDataFn', getDeleteDataFn)
  const deleteData = getDeleteData()
  console.log('GlEntityTablePlus > createEntitySavers() > deleteData:', deleteData)
  if (deleteData && deleteData.length > 0) {
    deleteData.forEach((record: Record<any, any>) => {
      if (subTablePidName) {
        record[subTablePidName] = subFormPidValue
      }
      const entitySaver = new EntitySaver(props.base.entityName)
      entitySaver.pidName = props.base.subTablePidName
      entitySaver.record = record
      entitySavers.push(entitySaver)
    })
  }
  console.log('GlEntityTablePlus > createEntitySavers() > entitySavers:', entitySavers)
  return entitySavers
}

const getEntitySavers = async (params: { subFormPidValue?: string }) => {
  const result = new GetEntitySaversResult()
  if (!(await validate())) {
    result.error = false
    result.values = createEntitySavers(params.subFormPidValue)
    result.message = ''
  }
  result.componentName = props.glComponentInst.componentName
  return result
}

const getSelectedEntitySavers = async (params: { subFormPidValue?: string }) => {
  const result = new GetEntitySaversResult()
  if (!(await validate())) {
    result.error = false
    result.values = createEntitySavers(params.subFormPidValue, true)
    result.message = ''
  }
  result.componentName = props.glComponentInst.componentName
  return result
}

/**
 *  批量更新
 *  批量更新已选中列的部分字段的内容
 *  @record key为字段名，即列名,value为更新后的列值
 */
const batchUpdate = (params: { record: Record<string, any> }) => {
  console.log('batchUpdate params', params)
  //
  const record = params.record
  if (selectedKeys.value.length === 0) {
    global.$notification.error({
      title: '批量更新失败',
      content: '请先选择列表中需要更新记录'
    })
  } else {
    const records = getSelectedRecords()
    const recordKeys = Object.keys(record)
    if (records) {
      const copyRecords = JSON.parse(JSON.stringify(records))
      copyRecords.forEach((copyRecord: Record<string, any>) => {
        recordKeys.forEach((recordKey: string) => {
          if (Object.keys(copyRecord).includes(recordKey)) {
            // @ts-ignore
            copyRecord[recordKey] = record[recordKey]
          }
        })
      })
      entityApi.saveBatch(props.base.entityName, copyRecords).then(() => {
        refresh()
        global.$notification.info({ title: '更新成功', content: `更新${records.length}条记录` })
      })
    }
  }
}

/**
 * 更新一条记录，该记录必须带有id，确保能更新指定的记录
 * @param params
 */
const updateRecord = (params: { record: Record<string, any> }) => {
  console.log('updateRecord params', params)
  const record = params.record
  if (!record.id) {
    global.$notification.error({
      title: '更新失败',
      content: '参数record对象，需要有id属性，且不为空。'
    })
  } else {
    // TODO 检查record的内容，是否有保存超出本表格的数据列
    const saveResult = entityApi.save(props.base.entityName, record).then(() => {
      refresh()
    })
    return saveResult
  }
  return null
}

defineExpose({
  resetColumns,
  changeColumnsVisible,
  batchUpdate,
  updateRecord,
  deleteRecord,
  deleteRecordWithConfirm,
  deleteSelectedRecords,
  deleteSelectedRecordsWithConfirm,
  refresh,
  getRenderRecord,
  getDeleteRecords,
  getSelectedRecords,
  getFirstSelectedRecord,
  getLastSelectedRecord,
  getRenderData,
  getRenderColumns,
  /**
   *  只适用于编辑表格，获取删除掉的数据
   */
  getDeleteData,
  hasSelectedRecords,
  validate,
  reRender,
  getEntitySavers,
  getSelectedEntitySavers,
  createEntitySavers
})
</script>

<template>
  <a-card
    class="gl-entity-table-plus"
    :title="base.hideLabel === true ? '' : base.label"
    :body-style="{ padding: base.tablePadding }"
    :style="{ 'padding-top': base.hideLabel === true ? '1.2em' : '0' }"
  >
    <GlQuery
      v-if="query"
      v-show="base.showQuery !== false"
      ref="queryRef"
      :items="query"
      @search="onSearch"
    ></GlQuery>
    <a-divider v-show="base.showQuery !== false" style="margin: 8px 0 12px" />
    <GlToolbar
      v-show="base.showToolbar !== false"
      v-bind="toolbar"
      style="margin-bottom: 8px"
      :disabled="isRead"
    >
      <template #leftItems>
        <div v-if="base.enableEdit" class="action-icon">
          <a-button @click="addRow" shape="round" type="text" size="small" :disabled="isRead">
            <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;添加一行
          </a-button>
        </div>
      </template>
      <template #rightItems>
        <a-space v-if="!props.base?.enableEdit">
          <span v-if="selectedKeys.length" class="action-icon">
            已选<a-badge :count="selectedKeys.length" />
          </span>
          <!-- TODO 待提供按列设置展示 -->
          <a-tooltip v-if="true" :content="t('searchTable.actions.columnSetting')">
            <a-popover trigger="click" position="br" @popup-visible-change="popupVisibleChange">
              <div class="action-icon">
                <GlIconfont type="gl-setting"></GlIconfont>
              </div>
              <template #content>
                <div :id="tableSettingId">
                  <div v-for="(item, index) in showColumns" :key="item.dataIndex" class="setting">
                    <div style="margin-right: 4px; cursor: move">
                      <GlIconfont type="gl-drag-arrow"></GlIconfont>
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item._checked"
                        @change="changeShowColumns($event, item, index)"
                      />
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip content="行高调整">
              <div class="action-icon">
                <GlIconfont type="gl-line-height"></GlIconfont>
              </div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip content="刷新">
            <div class="action-icon" @click="refresh">
              <GlIconfont type="gl-refresh"></GlIconfont>
            </div>
          </a-tooltip>
        </a-space>
      </template>
    </GlToolbar>
    <component
      :is="entityTable"
      ref="tableRef"
      :entityName="base.entityName"
      :columns="columns"
      :columnActions="columnActions"
      :size="size"
      :showPagination="base.showPagination"
      :enableEdit="base.enableEdit"
      :isFormSubTable="base.isFormSubTable"
      :subTablePidName="base.subTablePidName"
      :isLogicDeleteMode="base.isLogicDeleteMode"
      :rowSelection="rowSelection"
      :glComponentInst="glComponentInst"
      :glIsRuntime="glIsRuntime"
      :glRuntimeFlag="glRuntimeFlag"
      :tableSettingId="tableSettingId"
      @select="select"
      @selectionChange="selectionChange"
      @headerClick="headerClick"
      @columnResize="columnResize"
      @updateColumns="updateColumns"
      @updateRow="onUpdateRow"
      @fetchSuccess="onFetchSuccess"
      @rowClick="rowClick"
      @rowContextmenu="rowContextmenu"
      @rowDblclick="rowDblclick"
      @cellClick="cellClick"
      @cellContextmenu="cellContextmenu"
      @cellDblclick="cellDblclick"
    ></component>
  </a-card>
</template>

<style scoped lang="less">
.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
