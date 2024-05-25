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
import GlEntityTable from './GlEntityTable.vue'
import GlEntityTableEditable from './GlEntityTableEdit.vue'
import { computed, inject, onMounted, type PropType, ref, type Ref, toRaw } from 'vue'
import { type EntityReaderParam, fileApi, jsScriptExecutor } from '@geelato/gl-ui'
import QueryItem, { QueryItemKv } from '../gl-query/query'
import cloneDeep from 'lodash/cloneDeep'
import {
  type SizeProps,
  type Column,
  type GlTableColumn,
  type FilterType,
  type MyEntityTableConfig,
  BaseInfo,
  TableExport
} from './constants'
import { defaultTable, createExportColumns, createExportDataCellMetas } from './table'
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
  GetEntitySaversResult,
  PageCustomType,
  EntityRecordStatus,
  EntityDataSource
} from '@geelato/gl-ui'
import type { Action } from '../../types/global'
import type { TableData, TableColumnData, PaginationProps } from '@arco-design/web-vue'
import FilterManager from '../gl-query/FilterManager.vue'

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
  'cellContextmenu',
  'filterClick',
  'creatingEntitySavers',
  'pushRecords',
  'unPushRecords',
  'pushOrUnPushRecords',
  'change',
  // 编辑状态
  'copyRecord'
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
  // size: {
  //   type: String as PropType<SizeProps>
  // },
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
  /**
   *  默认导出Excel的配置
   */
  export: {
    type: Object as PropType<TableExport>,
    default() {
      return {}
    }
  },
  readonly: Boolean,
  ...mixins.props
})

// 是否隐藏卡片的内容，即折叠
const isHidden = ref(false)
const isShowLabel = computed(() => {
  return !props.base.hideLabel
})

const switchHide = () => {
  isHidden.value = !isHidden.value
}

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

/**
 *  查询之后
 */
const renderRecordKeys: Ref<string[]> = ref([])
/**
 *  从外部push进来的额外的recordsIds,用于从外部选择记录进来一起展示的场景
 *  该ids不直接作为entityReaderParams中的一部分，而是用于在最终的查询时构建查询条件，不影响entityReaderParams的设置
 */
const pushedRecordKeys: Ref<string[]> = ref([])
/**
 *  移除的记录ids
 */
const unPushedRecordKeys: Ref<string[]> = ref([])

/**
 *
 * 在页面初始化（init）时，GlQuery组件的事件会触发：@search="onSearch"，从而调用该访求
 * @param entityReaderParams  在查询区域设置的查询条件
 */
const onSearch = (entityReaderParams: Array<EntityReaderParam>) => {
  // console.log("onSearch() > entityReaderParams:", entityReaderParams);
  if (tableRef.value) {
    selectedKeys.value = []
    lastEntityReaderParams = entityReaderParams
    tableRef.value.selectAll(false)
    return tableRef.value.search(
      entityReaderParams,
      pushedRecordKeys.value,
      unPushedRecordKeys.value
    )
  }
  return undefined
}
const queryRef = ref()

/**
 * 以当前的查询条件进行刷新
 * @param event
 */
const refresh = (event?: MouseEvent) => {
  // search()会触发onSearch方法
  queryRef.value?.search()
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

const addRow = () => {
  tableRef.value.addRow()
}
const selectedKeys: Ref<string[]> = ref([])

const useFailFn = (message: string) => {
  return (e: any) => {
    console.error(message, e)
    global.$notification.error({ content: message })
  }
}
/**
 * 基于记录id，删除行，并刷新
 * @param params
 */
const deleteRecord = (params: { id: string }) => {
  // console.log('deleteRecord() > params:', params)
  if (!params || !params.id) {
    global.$notification.error({ content: '删除失败，未配置参数id。' })
    // console.error('基于记录id进行删除失败，未配置参数id。')
    return false
  }
  // 如果是外部添加的记录，只去掉外部添加的记录，不删除数据
  const foundIndex = pushedRecordKeys.value.findIndex((key: string) => {
    return key === params.id
  })
  if (foundIndex >= 0) {
    pushedRecordKeys.value.splice(foundIndex, 1)
    refresh()
    return params.id
  } else {
    return entityApi.deleteById(props.base.entityName, params.id).then(() => {
      refresh()
      return params.id
    }, useFailFn('删除失败'))
  }
}

/**
 * 删除行，并刷新，删除前进行确认
 * @param params
 */
const deleteRecordWithConfirm = (params: { id: string }) => {
  if (!params || !params.id) {
    global.$notification.error({ content: '删除失败，未配置参数id。' })
    return false
  }
  global.$modal.confirm({
    width: '18em',
    title: '危险操作',
    content: `是否确定删除记录，ID为：${params.id}？`,
    onOk: () => {
      deleteRecord(params)
    },
    onCancel: () => {}
  })
}

/**
 * 删除已选择的行，并刷新
 * @param params 是否带确认提醒，默认为否
 */
const deleteSelectedRecords = (params: { withConfirm?: boolean }) => {
  if (selectedKeys.value && selectedKeys.value.length > 0) {
    if (params?.withConfirm === true) {
      global.$modal.confirm({
        width: '15em',
        title: '危险操作',
        content: '是否确定删除？',
        onOk: () => {
          entityApi.deleteByIds(props.base.entityName, selectedKeys.value).then(() => {
            refresh()
          }, useFailFn('删除失败'))
        },
        onCancel: () => {}
      })
    } else {
      return entityApi.deleteByIds(props.base.entityName, selectedKeys.value).then(() => {
        refresh()
      }, useFailFn('删除失败'))
    }
  } else {
    global.$notification.warning({ content: '请先选择记录' })
  }
}
/**
 * 删除已选择的行，并刷新，带删除确认提醒
 */
const deleteSelectedRecordsWithConfirm = () => {
  return deleteSelectedRecords({ withConfirm: true })
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

/**
 * 表格数据发生变化时触发
 * 如在可编辑表格下，行数据数据拖动时出发（表格内置表单字段输入控件值改变时，不会触发）
 * @param data
 */
const change = (data: any) => {
  emits('change', data)
}

const copyRecord = (data: { record: any; rowIndex: any }) => {
  emits('copyRecord', data)
}

const rowSelection = computed(() => {
  return props.base.checkType === 'checkbox' || props.base.checkType === 'radio'
    ? {
        type: props.base.checkType,
        showCheckedAll: props.base.showCheckAll && props.base.checkType === 'checkbox'
      }
    : undefined
})

/**
 *  @deprecated 待弃用
 */
const getRenderData = () => {
  return tableRef.value.getRenderData()
}

/**
 *  @deprecated 待弃用，方法名称不对，应再加s
 */
const getRenderRecord = () => {
  return tableRef.value.getRenderData()
}

/**
 * 获取当前列表页面展示的记录，返回记录数据组,没记录时返回空数组[]
 */
const getRenderRecords = () => {
  // console.log('tableRef.value.getRenderData()', tableRef.value.getRenderData())
  return tableRef.value.getRenderData()
}

/**
 * 获取已选的记录，返回记录数据组,没记录时返回空数组[]
 */
const getSelectedRecords = () => {
  return tableRef.value.getRenderData().filter((record: Record<string, any>) => {
    return selectedKeys.value.includes(record.id)
  })
}

const getSelectedKeys = () => {
  return selectedKeys.value
}

/**
 *  添加记录到列表中
 *  通过添加记录的ids,触发列表的查询（将ids作为or条件查夜），加载对应的记录
 */
const pushRecordsByKeys = (params: { keys: string[] }) => {
  // console.log('pushRecordsByKeys params', params)
  const pushedKeys: string[] = []
  const failPushedKeys: string[] = []
  params?.keys?.forEach((pushingId: string) => {
    const found = pushedRecordKeys.value.find((pushedId: string) => {
      return pushedId === pushingId
    })
    if (!found) {
      pushedKeys.push(pushingId)
      pushedRecordKeys.value.push(pushingId)
    } else {
      failPushedKeys.push(pushingId)
    }
    // 从unPushedRecordKeys中去掉相应的keys
    const foundIndex = unPushedRecordKeys.value.findIndex((unPushedId: string) => {
      return unPushedId === pushingId
    })
    if (foundIndex >= 0) {
      unPushedRecordKeys.value.splice(foundIndex, 1)
    }
  })
  global.$notification.info({
    content:
      failPushedKeys.length > 0
        ? `成功加入${pushedKeys.length}条，忽略重复的${failPushedKeys.length}条。`
        : `成功加入${pushedKeys.length}条`
  })
  if (pushedKeys.length > 0) {
    // 有效添加之后触发
    emits('pushRecords', { pushedKeys, failPushedKeys })
    emits('pushOrUnPushRecords', { pushedKeys, failPushedKeys })
  }
  return { pushedKeys, failPushedKeys }
}

const pushSelectedRecords = () => {
  return pushRecordsByKeys({ keys: selectedKeys.value })
}

/**
 *  获取通过外部添加进来的记录
 */
const getPushedRecords = () => {
  return getRenderRecords()?.filter((record: Record<string, any>) => {
    return pushedRecordKeys.value.includes(record.id)
  })
}

/**
 *  获取通过外部添加进来的记录keys
 */
const getPushedRecordKeys = () => {
  return pushedRecordKeys.value
}

const isPushRecordsKeys = (key: string) => {
  return pushedRecordKeys.value?.includes(key)
}

/**
 * 移除已push进来的记录
 * 包括刚push进来未保存的，之前已push进来已保存的
 * @param params
 */
const unPushRecordsByKeys = (params: { keys: string[] }) => {
  // console.log('unPushRecordsByKeys params', params)
  const unPushedKeys: string[] = []
  const needToUnPushFormServerKeys: string[] = []
  params?.keys?.forEach((unPushingId: string) => {
    const foundIndex = pushedRecordKeys.value.findIndex((pushedId: string) => {
      return pushedId === unPushingId
    })
    // 更多的移除记录起来
    unPushedRecordKeys.value.push(unPushingId)
    if (foundIndex >= 0) {
      unPushedKeys.push(unPushingId)
      pushedRecordKeys.value.splice(foundIndex, 1)
    } else {
      needToUnPushFormServerKeys.push(unPushingId)
    }
  })
  global.$notification.info({
    content: `新标记${needToUnPushFormServerKeys.length}条记录待删除。`
  })
  if (unPushedKeys.length > 0) {
    // 有效添加之后触发
    emits('unPushRecords', { unPushedKeys, needToUnPushFormServerKeys })
    emits('pushOrUnPushRecords', { unPushedKeys, needToUnPushFormServerKeys })
  }
  return { unPushedKeys, needToUnPushFormServerKeys }
}

/**
 *  移除当前已选择的记录
 *  此时只是更新前端的数据，不更新服务端
 */
const unPushSelectedRecords = () => {
  return unPushRecordsByKeys({ keys: selectedKeys.value })
}
/**
 *  获取需要unPush的记录
 */
const getUnPushedRecords = () => {
  return getRenderRecords()?.filter((record: Record<string, any>) => {
    return unPushedRecordKeys.value.includes(record.id)
  })
}

const isUnPushRecordsKeys = (key: string) => {
  return unPushedRecordKeys.value?.includes(key)
}

/**
 * 是否有未保存的记录
 * TODO 还GlEntityTableEdit的未保存场景再加上
 */
const hasUnSaveRecords = () => {
  return unPushedRecordKeys.value.length > 0 || pushedRecordKeys.value.length > 0
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

/**
 *
 * @param params 返回false进的提示信息，有配置则提示，没有配置则不提示
 */
const hasSelectedRecords = (params: { enableAlert?: boolean; content?: string }) => {
  if (getSelectedRecords().length > 0) {
    return true
  } else {
    if (params?.enableAlert) {
      global.$notification.warning({
        content: params.content || '请先选择记录'
      })
    }
    return false
  }
}

const hasRenderRecords = () => {
  return getRenderRecords().length > 0
}

const getRenderColumns = (): GlTableColumn[] => {
  return tableRef.value.getRenderColumns()
}
/**
 *  @deprecated
 */
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
const onFetchFail = (args: { data: undefined; pagination: object }) => {
  emits('fetchFail', args)
}

const entityTable = computed(() => {
  return props.base?.enableEdit ? GlEntityTableEditable : GlEntityTable
})

enum RecordsScope {
  // 列表选中的部分
  Selected = 'Selected',
  // 从外部pushed进来的部分
  Pushed = 'Pushed',
  // 所有的
  All = 'All'
}

/**
 * 创建表格的实体保存对象，可被父表单调用，集到父表单一起保存
 * @param subFormPidValue 作为子表单时，本表单中，指向父表单ID的字段值
 * @param recordsScope 数据记录范围，默认为RecordsScope.All
 */
const createEntitySavers = (
  subFormPidValue?: string,
  recordsScope?: RecordsScope
): EntitySaver[] => {
  const entitySavers: EntitySaver[] = []
  // 处理需保存的子表单数据
  // const renderColumns = getRenderColumns()
  let subFormTableData
  switch (recordsScope) {
    case RecordsScope.Selected:
      subFormTableData = getSelectedRecords()
      break
    case RecordsScope.Pushed:
      subFormTableData = getPushedRecords()
      break
    // case RecordsScope.All:
    //   subFormTableData = getRenderRecords()
    //   break
    default:
      // console.log(
      //   'pushedRecordKeys.value',
      //   pushedRecordKeys.value,
      //   getPushedRecords(),
      //   'unPushedRecordKeys.value',
      //   getUnPushedRecords(),
      //   unPushedRecordKeys.value
      // )
      // 如果未指定，依据当前的表格信息进行自动分析
      if (pushedRecordKeys.value?.length > 0 || unPushedRecordKeys.value?.length > 0) {
        //
        subFormTableData = getPushedRecords()
        const unPushedRecords = getUnPushedRecords() || []
        subFormTableData.push(...(unPushedRecords || []))
      } else {
        subFormTableData = getRenderRecords()
      }
  }
  // 作为子表，对应主表单ID的字段名，如orderId、pId等
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
      entitySaver.id = props.glComponentInst.id
      entitySaver.pidName = props.base.subTablePidName
      entitySaver.record = record
      const key = record[EntityDataSource.ConstObject.keyFiledName]
      // 更新记录的状态，是否为需要push的，还是需要unPush的
      isPushRecordsKeys(key) && (entitySaver.recordStatus = EntityRecordStatus.Pushed)
      isUnPushRecordsKeys(key) && (entitySaver.recordStatus = EntityRecordStatus.UnPushed)
      entitySavers.push(entitySaver)
    })
  }
  // 处理需删除子表单数据
  // 当前为逻辑删除，可依据子表的isLogicDeleteMode来区分
  // console.log('GlEntityForm > saveForm() > getDeleteDataFn', getDeleteDataFn)
  const deleteData = getDeleteRecords()
  // console.log('GlEntityTablePlus > createEntitySavers() > deleteData:', deleteData)
  if (deleteData && deleteData.length > 0) {
    deleteData.forEach((record: Record<any, any>) => {
      if (subTablePidName) {
        record[subTablePidName] = subFormPidValue
      }
      const entitySaver = new EntitySaver(props.base.entityName)
      entitySaver.id = props.glComponentInst.id
      entitySaver.pidName = props.base.subTablePidName
      entitySaver.record = record
      entitySavers.push(entitySaver)
    })
  }
  // console.log('GlEntityTablePlus > creatingEntitySavers:', entitySavers)
  emits('creatingEntitySavers', { entitySavers })
  return entitySavers
}

/**
 * 获取基于实体保存的对象，用于以下场景：
 * 1、组合到主表单中，实现主表和子列表的一起保存
 * 2、用于脚本编排灵活保存列表中的记录
 * @param params {recordsScope?:string} recordsScope默认为All
 */
const getEntitySavers = async (params: {
  subFormPidValue?: string
  recordsScope?: RecordsScope
}) => {
  const result = new GetEntitySaversResult()
  if (!(await validate())) {
    result.error = false
    result.values = createEntitySavers(
      params.subFormPidValue,
      params.recordsScope || RecordsScope.All
    )
    result.message = ''
  }
  result.componentName = props.glComponentInst.componentName
  return result
}

/**
 * 同getEntitySavers，这里的范围只是已选择的部分
 * @param params
 */
const getSelectedEntitySavers = async (params: { subFormPidValue?: string }) => {
  return getEntitySavers({
    subFormPidValue: params.subFormPidValue,
    recordsScope: RecordsScope.Selected
  })
}

/**
 * 同getEntitySavers，这里的范围只是已选择的部分
 * @param params
 */
const getPushedEntitySavers = async (params: { subFormPidValue?: string }) => {
  return getEntitySavers({
    subFormPidValue: params.subFormPidValue,
    recordsScope: RecordsScope.Pushed
  })
}

/**
 *  前端改变当前页面的数据
 */
// const changeRenderRecords = (params: { record: Record<string, any> })=>{
//   console.log('changeCurrentPageRecords params', params)
//   const record = params.record
//   const records = getRenderRecords()
//   const recordKeys = Object.keys(record)
//   if (records) {
//     const copyRecords = JSON.parse(JSON.stringify(records))
//     copyRecords.forEach((copyRecord: Record<string, any>) => {
//       recordKeys.forEach((recordKey: string) => {
//         if (Object.keys(copyRecord).includes(recordKey)) {
//           // @ts-ignore
//           copyRecord[recordKey] = record[recordKey]
//         }
//       })
//     })
//   }
// }

/**
 *  批量更新所选的记录到服务端
 *  批量更新已选中列的部分字段的内容
 *  @record key为字段名，即列名,value为更新后的列值
 */
const batchUpdate = (params: { record: Record<string, any> }) => {
  // console.log('batchUpdate params', params)
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
      return entityApi.saveBatch(props.base.entityName, copyRecords).then(() => {
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
  // console.log('updateRecord params', params)
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
  return undefined
}

/**
 * 只用于编辑表格
 * @param params
 */
const insertRecords = (params: {
  records: Record<string, any>[]
  ignoreDataIndexes?: string[]
}) => {
  return tableRef.value.insertRecords(params)
}

// 获取组件所在页面的自定义配置
const myPageCustom: PageCustomType = props.pageCustom!
// 通过组件id，获取组件在该页面中的自定义配置
if (myPageCustom && !myPageCustom.cfg[props.glComponentInst.id]) {
  myPageCustom.cfg[props.glComponentInst.id] = { filters: [] }
}
const myComponentCustom: Ref<MyEntityTableConfig> = ref(myPageCustom?.cfg[props.glComponentInst.id])
// 刷选出下拉展示的过滤器
const dropdownFilters = computed(() => {
  return myComponentCustom.value.filters?.filter((filter: FilterType) => {
    return !filter.showOnToolbar
  })
})

const visibleFilterManager = ref(false)
const queryItemsKvs: Ref<QueryItemKv[]> = ref([])

const openEditFilterModal = (filter: FilterType) => {
  queryItemsKvs.value = queryRef.value.getQueryItemKvs()
  visibleFilterManager.value = true
}

/**
 *  保存过滤器配置到服务端
 */
const saveFilters = () => {
  // if (!queryItemsKvs.value?.id) {
  //   queryItemsKvs.value!.id = utils.gid('filter')
  //   myComponentCustom.value.filters.push(queryItemsKvs.value!)
  // }
  // visibleFilterManager.value = false
  const saver = new EntitySaver()
  saver.id = props.glComponentInst.id
  saver.entity = 'platform_my_page_custom'
  saver.record = myPageCustom
  entityApi.saveEntity(saver)
  visibleFilterManager.value = false
}

const addFilter = () => {
  myComponentCustom.value.filters.splice(0, 0, {
    id: utils.gid('filter'),
    name: utils.gid('过滤器', 6),
    showOnToolbar: true,
    queryItemKvs: queryItemsKvs.value
  })
}

const queryByFilter = (filter: FilterType) => {
  queryRef.value.resetByQueryItemKvs(JSON.parse(JSON.stringify(filter.queryItemKvs)))
  emits('filterClick', filter)
}

/**
 *  获取单列的汇总值
 *  依据push和unPush的状态进行计算，unpush的需要减掉push的需要增加
 */
const getColumnSum = (params: { dataIndex: string }) => {
  if (!params || !params.dataIndex) {
    console.error('getColumnSum的参数不正确,格式应为：{ dataIndex: string}，实为：', params)
    throw new Error('getColumnSum的参数不正确,格式应为：{ dataIndex: string}')
  }
  let sum = 0
  // 正值部分
  getRenderRecords()?.forEach((record: Record<string, any>) => {
    // 排除push部分，避免重复计算
    sum += record[params.dataIndex] || 0
  })
  // 负值部分
  getUnPushedRecords()?.forEach((record: Record<string, any>) => {
    sum -= record[params.dataIndex] || 0
  })
  // console.log('getPushedRecords:',getPushedRecords(),'getUnPushedRecords:',getUnPushedRecords())
  return sum
}

/**
 *  获取列的汇总值，支持传多个列
 *  依据push和unPush的状态进行计算，unpush的需要减掉push的需要增加
 */
const getColumnsSum = (params: { dataIndexes: string[] }) => {
  if (!params || !params.dataIndexes || !utils.isArray(params.dataIndexes)) {
    console.error('getColumnsSum的参数不正确,格式应为：{ dataIndexes: string[] }，实为：', params)
    throw new Error('getColumnsSum的参数不正确,格式应为：{ dataIndexes: string[] }')
  }

  const sum: Record<string, number> = {}
  // 正值部分
  getRenderRecords()?.forEach((record: Record<string, any>) => {
    // 排除push部分，避免重复计算
    params.dataIndexes.forEach((key: string) => {
      sum[key] += record[key] || 0
    })
  })
  // 负值部分
  getUnPushedRecords()?.forEach((record: Record<string, any>) => {
    params.dataIndexes.forEach((key: string) => {
      sum[key] -= record[key] || 0
    })
  })
  return sum
}

/**
 *  检查某一列的值是否相同
 *  如果存在多个值，或没有选择记录，则返回false
 */
const isSelectedRecordsSameColumn = (params: { dataIndex: string }) => {
  if (!params || !params.dataIndex) {
    console.error('isColumnSameValue的参数不正确,格式应为：{ dataIndex: string}，实为：', params)
    throw new Error('isColumnSameValue的参数不正确,格式应为：{ dataIndex: string}')
  }
  let colSet = new Set()
  // 正值部分
  getSelectedRecords()?.forEach((record: Record<string, any>) => {
    colSet.add(record[params.dataIndex])
  })
  return colSet.size === 1
}

/**
 *  获取渲染的记录中排除掉unPush的部分
 */
const getRenderRecordsWithOutUnPushed = () => {
  const result: Record<string, any>[] = []
  getRenderRecords()?.forEach((record: Record<string, any>) => {
    const foundIndex = getUnPushedRecords()?.findIndex((unPushedRecord: Record<string, any>) => {
      return (
        unPushedRecord[EntityDataSource.ConstObject.keyFiledName] ===
        record[EntityDataSource.ConstObject.keyFiledName]
      )
    })
    if (foundIndex < 0) {
      result.push(record)
    }
  })
  return result
}

/**
 *  获取单列内容数据组，并且去掉空值
 *  依据push和unPush的状态进行构建
 */
const getColumnAry = (params: { dataIndex: string }) => {
  if (!params || !params.dataIndex) {
    console.error('getColumnJoin的参数不正确,格式应为：{ dataIndex: string}，实为：', params)
    throw new Error('getColumnJoin的参数不正确,格式应为：{ dataIndex: string}')
  }
  let ary = new Set()
  // 正值部分
  getRenderRecordsWithOutUnPushed()?.forEach((record: Record<string, any>) => {
    if (!utils.isEmpty(record[params.dataIndex])) {
      ary.add(record[params.dataIndex])
    }
  })
  return ary
}
const getColumnJoin = (params: { dataIndex: string; separator?: string }) => {
  let ary = Array.from(getColumnAry(params))
  return ary.join(params?.separator || ',')
}

/**
 *  分组求和
 *  依据push和unPush的状态进行计算，unpush的需要减掉push的需要增加
 */
const getColumnGroupSum = (params: { groupDataIndex: string; sumDataIndex: string }) => {
  if (!params || !params.groupDataIndex || !params.sumDataIndex) {
    console.error(
      'getColumnSum的参数不正确,格式应为：{ groupDataIndex: string,sumDataIndex:string }，实为：',
      params
    )
    throw new Error(
      'getColumnSum的参数不正确,格式应为：{ groupDataIndex: string,sumDataIndex:string }'
    )
  }
  // {groupName1:value1,groupName2:value2}
  let groupSum: { [key: string]: number } = {}
  getRenderRecordsWithOutUnPushed()?.forEach((record: Record<string, any>) => {
    const groupName = record[params.groupDataIndex]
    if (groupSum[groupName] == undefined) {
      groupSum[groupName] = 0
    }
    groupSum[groupName] += record[params.sumDataIndex] || 0
  })
  return groupSum
}

const createEntityReader = (params: { pageSize: number; pageNo?: number }) => {
  const entityReaderParams: Array<EntityReaderParam> = queryRef.value.createEntityReaderParams()
  return tableRef.value.getEntityReader(entityReaderParams, params)
}

/**
 * 创建元数据查询Mql对象，可作为POST请求的data传到服务端，可用于服务端编排
 * @param params
 */
const createEntityReaderAsMql = (params: { pageSize: number; pageNo?: number }) => {
  return entityApi.convertEntityReaderToMql(createEntityReader(params))
}

/**
 *  基于当前的查询条件，进行数据查询并返回数据结果集
 *  获取的数据不做分页，在一页中返回
 *  常用于导出数据到excel中
 *  ！！ 注意，该操作不会更新当前的页面UI
 *  ！！ 注意，如果列配置了显示脚本，则会先按该显示脚本进行计算，再返回结果
 *  ！！ 注意，如果列配置了字典组件，会自动按字典的配置进行取值转换
 *  ！！注意，如果列配置了动态实体组件，会自动按动态实体的配置取值转换
 *  @params {pageSize}，pageSize为查询一页时，最大的记录数
 */
const searchAndExportRecords = (params: { pageSize: number }) => {
  return entityApi.queryByEntityReader(createEntityReader(params)).then(async (res) => {
    if (res.data?.length <= 0) {
      return res
    }

    // 需要进行显示脚本转换的列
    let renderScriptColAry = []
    // 需进行字典转换的列
    let dictComponentColAry = []
    // 需进行字典转换的所有字典id
    let dictIds = []
    // 需进行动态实体转换的列
    let dynamicSelectComponentColAry = []
    // 需进行动态实体转换的实体信息
    let dynamicEntities: Record<string, string>[] = []
    // 找出配置了组件列、显示脚本，如果一列中，同时配置了显示脚本、组件，则组件优先
    getRenderColumns()?.forEach((column: GlTableColumn) => {
      if (column._component) {
        if (column._component.componentName == 'GlDict') {
          // 找出配置了字典的列，示例如下：
          //     "componentName": "GlDict",
          //     "props": {
          //       "label": "费用项目",
          //       "dictId": "3710386584743878416",
          //       "displayType": "select",
          //       "dictItemDisplayMode": "hideInEdit"
          //     },
          dictComponentColAry.push(column)
          dictIds.push(column._component?.props?.dictId)
        } else if (column._component.componentName == 'GlDynamicSelect') {
          //     "componentName": "GlDynamicSelect",
          //     "props": {
          //        "entityName": "il_cooperating_org",
          //        "labelFieldNames": ["", "name"],
          //        "valueFiledName": "id",
          //        "valueFilter": [],
          //        "extraFieldAndBindIds": [],
          //      },
          dynamicSelectComponentColAry.push(column)
          let labelFieldNames = column._component?.props?.labelFieldNames.filter((item) => item != '')
          let fieldNames = [column._component?.props?.valueFiledName]
          fieldNames.push(...labelFieldNames)
          dynamicEntities.push({
            dataIndex: column.dataIndex,
            entityName: column._component?.props?.entityName,
            fieldNames: fieldNames,
            valueFiledName: column._component?.props?.valueFiledName,
            // 获取展示的内容
            getLabel: (record:Record<string,any>)=>{
              // 如果只有一个字段，则直接返回即可
              if(labelFieldNames.length === 1){
                return record[labelFieldNames[0]]
              }
              // 多个字段，则拼接
              let label = []
              labelFieldNames.forEach((fieldName)=>{
                label.push(record[fieldName])
              })
              return label.join(' ')
            }
          })
        }
      } else if (column._renderScript) {
        // 找出配置了转换脚本的列
        renderScriptColAry.push(column)
      }
    })

    // 如果有字典列，则先从服务端获取这些字典数据，便于后续进行转换
    let dictItems = []
    if (dictIds.length > 0) {
      await entityApi.queryMultiDictItems(dictIds, true).then((res) => {
        dictItems = res.data
      })
    }

    // 如果有动态实体列，则先从服务端获取这些实体数据，便于后续进行转换
    let entityIdsMap: Record<string, []> = {}
    res.data.forEach((record: Record<string, any>, rowIndex: number) => {
      dynamicSelectComponentColAry.forEach((column: GlTableColumn) => {
        entityIdsMap[column.dataIndex] = entityIdsMap[column.dataIndex] || []
        entityIdsMap[column.dataIndex].push(record[column.dataIndex])
      })
    })

    // 获取动态实体数据
    let allEntityQueryPromise = []
    // 获取动态实体数据，key为dataIndex，value为查询结果
    let allEntityQueryResult = {}
    dynamicEntities.forEach((entity: Record<string, any>) => {
      allEntityQueryPromise.push(
        entityApi
          .query(entity.entityName, entity.fieldNames.join(','), {
            'id|in': entityIdsMap[entity.dataIndex]
          })
          .then((res) => {
            allEntityQueryResult[entity.dataIndex] = res.data
          })
      )
    })
    await Promise.all(allEntityQueryPromise)

    // 对查出的数据集，进行转换
    if (renderScriptColAry.length > 0) {
      res.data.forEach((record: Record<string, any>, rowIndex: number) => {
        // 遍历列，如果配置了显示脚本，则先计算出值
        renderScriptColAry.forEach((col) => {
          const ctx = {
            pageProxy: pageProvideProxy,
            record: record,
            column: col,
            rowIndex: rowIndex
          }
          record[col.dataIndex] = jsScriptExecutor.evalExpression(col._renderScript, ctx)
        })
        // 如果有字典列，则对数据集进行转换
        dictComponentColAry.forEach((col: GlTableColumn) => {
          // 找到对应的数据，如果找不到，则使用原始数据
          record[col.dataIndex] =
            dictItems.find((dictItem: any) => {
              return (
                dictItem.dictId == col._component?.props?.dictId &&
                record[col.dataIndex] == dictItem.value
              )
            })?.label || record[col.dataIndex]
        })
        // 如果有动态实体列，则对数据集进行转换
        dynamicSelectComponentColAry.forEach((col: GlTableColumn) => {
          const queryEntityMeta = dynamicEntities.find((entity) => {
            return entity.dataIndex == col.dataIndex
          })
          record[col.dataIndex] = queryEntityMeta.getLabel(allEntityQueryResult[col.dataIndex].find(
            (dynamicEntityRecord: Record<string, any>) => {
              return dynamicEntityRecord[queryEntityMeta.valueFiledName] == record[col.dataIndex]
            }
          ))
        })
      })
    }
    return res
  })
}

/**
 * 通过行的索引位置来设置记录的选中状态
 * 常用于打开页面时，默认选中第1条的场景
 * @param params rowIndex：0表示第一条
 *               checked：true选中，false不选
 *               info:如果有信息且选的记录不存在时进行提醒
 */
const selectRecordByIndex = (params: {
  rowIndex: string | number | (string | number)[]
  checked: boolean
  warning?: string
}) => {
  let isArray = utils.isArray(params.rowIndex)
  let indexes = params.rowIndex
  if (!isArray) {
    indexes = [params.rowIndex]
  }

  // 转为数字
  let numberIndexes = []
  try {
    indexes.forEach((index) => {
      numberIndexes.push(Number.parseInt(index))
    })
  } catch (e) {
    global.$notification.error(
      'selectRecordByIndex的参数不正确，rowIndex应为number或string格式的数字，或数组'
    )
    console.error(
      'selectRecordByIndex的参数不正确,格式应为：{ rowIndex: number, checked: boolean, warning?: string }，实为：',
      params
    )
    return false
  }

  // 检查设置的index是否越界
  const renderRecords = getRenderRecords()
  for (let index of numberIndexes) {
    if (params.warning && renderRecords?.length - 1 < index) {
      // 如：数组越界，选择不到指定的记录
      global.$notification.warning(params.warning)
      return false
    }
  }

  // 基于index获取rowKey
  let rowKeys = []
  let selectedRecordsThisTime = []
  renderRecords.forEach((record, recordIndex) => {
    let foundIndex = numberIndexes.find((index) => {
      return index === recordIndex
    })
    if (foundIndex >= 0) {
      rowKeys.push(record.id)
      selectedRecordsThisTime.push(record)
    }
  })
  tableRef.value.select(rowKeys, params.checked)
  // 触发事件
  // ！！！ 注意 由于用表格的select方法，所以不会触发select事件，所以手动触发
  select(
    toRaw(getSelectedKeys()),
    isArray ? rowKeys : rowKeys[0],
    isArray ? selectedRecordsThisTime : selectedRecordsThisTime[0]
  )
}

/**
 * 通过行的ID值来设置记录的选中状态
 * @param params rowKey：记录的ID值
 *               checked：true选中，false不选
 *               info:如果有信息且选的记录不存在时进行提醒
 */
const selectRecordByKey = (params: {
  rowKey: string | number | (string | number)[]
  checked: boolean
  warning?: string
}) => {
  let isArray = utils.isArray(params.rowKey)
  let rowKeys = params.rowKey
  if (!isArray) {
    rowKeys = [params.rowKey]
  }

  // 检查records中是否都存在此次设置的rowKey
  let selectedRecordsThisTime = []
  const renderRecords = getRenderRecords()
  for (let rowKey of rowKeys) {
    let foundRecord = renderRecords.find((record) => {
      return record.id == rowKey
    })
    if (!foundRecord) {
      global.$notification.warning(params.warning)
      return false
    } else {
      selectedRecordsThisTime.push(foundRecord)
    }
  }

  tableRef.value.select(rowKeys, params.checked)
  // 触发事件
  // ！！！ 注意 由于用表格的select方法，所以不会触发select事件，所以手动触发
  select(
    toRaw(getSelectedKeys()),
    isArray ? rowKeys : rowKeys[0],
    isArray ? selectedRecordsThisTime : selectedRecordsThisTime[0]
  )
}

/**
 *  导出所有页的数据
 */
const exportExcelAll = () => {
  const notificationId = utils.gid()
  global.$notification.info({
    content: '正在查询数据...',
    showIcon: true,
    duration: 8000,
    id: notificationId,
    closable: true
  })

  return searchAndExportRecords({ pageSize: 10000 }).then((res: any) => {
    if (res.data?.length <= 0) {
      global.$notification.warning({
        content: '找不到可以导出的记录',
        showIcon: true,
        duration: 8000,
        id: notificationId,
        closable: true
      })
      return
    }

    let fileName = props.base.label
    let data = {
      column: createExportColumns(tableRef.value.getRenderColumns()),
      meta: createExportDataCellMetas(tableRef.value.getRenderColumns()),
      valueMapList: [{ list: res.data }],
      valueMap: {}
    }

    global.$notification.info({
      content: '正在导出数据...',
      showIcon: true,
      duration: 8000,
      id: notificationId,
      closable: true
    })
    return fileApi.exportExcelByColumnMeta(fileName, data).then(
      (res: any) => {
        if (res?.data?.id) {
          global.$notification.info({
            content: '导出成功，可请在“工作台>我导出的文档”查看已下载的文件',
            showIcon: true,
            duration: 8000,
            id: notificationId,
            closable: true
          })
          fileApi.downloadFileById(res.data.id, false)
        }
      },
      (e: any) => {
        global.$notification.error({
          title: '',
          content: '导出失败',
          showIcon: true,
          duration: 8000,
          id: notificationId,
          closable: true
        })
      }
    )
  },()=>{
    global.$notification.error({
      content: '查询数据失败...',
      showIcon: true,
      duration: 8000,
      id: notificationId,
      closable: true
    })
  })
}

defineExpose({
  createEntityReaderAsMql,
  createEntityReader,
  searchAndExportRecords,
  pushRecordsByKeys,
  pushSelectedRecords,
  unPushRecordsByKeys,
  unPushSelectedRecords,
  createEntitySavers,
  changeColumnsVisible,
  batchUpdate,
  selectRecordByIndex,
  selectRecordByKey,
  updateRecord,
  insertRecords,
  deleteRecord,
  deleteRecordWithConfirm,
  deleteSelectedRecords,
  deleteSelectedRecordsWithConfirm,
  getRenderRecord,
  getRenderRecords,
  getDeleteRecords,
  getDeleteData,
  getSelectedRecords,
  getSelectedKeys,
  getEntitySavers,
  getSelectedEntitySavers,
  getPushedEntitySavers,
  getPushedRecords,
  getPushedRecordKeys,
  getFirstSelectedRecord,
  getLastSelectedRecord,
  getRenderData,
  getRenderColumns,
  getColumnSum,
  getColumnsSum,
  getColumnJoin,
  getColumnGroupSum,
  hasRenderRecords,
  hasSelectedRecords,
  hasUnSaveRecords,
  isSelectedRecordsSameColumn,
  validate,
  reRender,
  refresh,
  resetColumns
})
</script>

<template>
  <a-card
    class="gl-card gl-entity-table-plus"
    :class="{ 'gl-hidden': isHidden, 'gl-hide-header': !isShowLabel }"
    :body-style="{ padding: base.tablePadding }"
    :bordered="base.bordered"
    :hoverable="base.hoverable"
    :size="base.size"
  >
    <template #extra>
      <div class="gl-card-extra-items">
        <slot name="extra"></slot>
      </div>
    </template>
    <template #title v-if="isShowLabel">
      <span @click="switchHide" style="cursor: pointer">
        <span>
          <GlIconfont v-if="isHidden" type="gl-down-circle"></GlIconfont>
          <GlIconfont v-else type="gl-right-circle"></GlIconfont>
        </span>
        <span>{{ base.hideLabel === true ? '' : base.label }}</span>
      </span>
    </template>
    <GlQuery
      v-if="query"
      v-show="base.showQuery !== false"
      ref="queryRef"
      :items="query"
      :triggerByInit="base.triggerByInit"
      :triggerByValueChange="base.triggerByValueChange"
      :interdictExpression="base.interdictExpression"
      :hideReset="base.hideReset"
      @search="onSearch"
      style="margin-top: 12px"
    ></GlQuery>
    <a-divider v-show="base.showQuery !== false" style="margin: 8px 0 12px" />
    <GlToolbar
      v-show="base.showToolbar !== false"
      v-bind="toolbar"
      style="margin-bottom: 8px"
      :disabled="isRead || readonly"
    >
      <template #leftItems>
        <div v-if="base.enableEdit && base.showAddRowBtn !== false" class="action-icon">
          <a-button
            @click="addRow"
            shape="round"
            type="text"
            size="small"
            :disabled="isRead || readonly"
          >
            <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;添加一行
          </a-button>
        </div>
      </template>
      <template #rightItems>
        <a-modal v-model:visible="visibleFilterManager" v-if="myComponentCustom">
          <template #title> 管理当前页面的查询过滤器（常用查询条件组合）</template>
          <div>
            <FilterManager v-model="myComponentCustom.filters"></FilterManager>
          </div>
          <template #footer>
            <a-button type="primary" style="float: left" @click="addFilter">
              <GlIconfont type="gl-plus-circle" text="将当前查询条件添加过滤器"></GlIconfont>
            </a-button>
            <a-space>
              <a-button type="primary" @click="saveFilters">保存</a-button>
            </a-space>
          </template>
        </a-modal>
        <a-space v-if="!base?.enableEdit">
          <!-- 默认的导出Excel功能 -->
          <a-tooltip v-if="base.showDefaultExport" content="导出当前查询的所有数据，包括分页的数据，不只是当前页数据">
            <a-button type="primary" @click="exportExcelAll">
              <gl-iconfont type="gl-file-excel" text="导出"></gl-iconfont>
            </a-button>
          </a-tooltip>
          <!-- 过滤器 -->
          <a-button-group v-if="base.showFilter !== false&&myComponentCustom" size="mini" class="action-icon" shape="round">
            <a-tooltip content="我的常用过滤，可以保存多组常用过滤">
              <a-button type="primary" shape="circle" @click="openEditFilterModal(null)">
                <GlIconfont type="gl-filter"></GlIconfont>
              </a-button>
            </a-tooltip>
            <template v-for="filter in myComponentCustom.filters">
              <a-button v-if="filter.showOnToolbar" @click="queryByFilter(filter)">
                {{ filter.name }}
              </a-button>
            </template>
            <a-dropdown v-if="dropdownFilters.length > 0">
              <a-button type="primary" shape="circle">
                <GlIconfont type="gl-arrow-down"></GlIconfont>
              </a-button>
              <template #content>
                <a-doption v-for="filter in dropdownFilters" @click="queryByFilter(filter)"
                  >{{ filter.name }}
                </a-doption>
              </template>
            </a-dropdown>
          </a-button-group>

          <a-tooltip v-if="selectedKeys.length" content="当前列表已选择的记录数">
            <span class="action-icon"> 已选<a-badge :count="selectedKeys.length" /> </span>
          </a-tooltip>

          <a-tooltip
            v-if="pushedRecordKeys.length"
            content="从外部的同类列表中，选择加入的记录数，多次加入相同的记录key(id)，会被去重忽略。"
          >
            <span class="action-icon"> 已加入<a-badge :count="pushedRecordKeys.length" /> </span>
          </a-tooltip>

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
      :size="base.size"
      :showPagination="base.showPagination"
      :showSeqNo="base.showSeqNo"
      :pagination="pagination"
      :enableEdit="base.enableEdit"
      :isFormSubTable="base.isFormSubTable"
      :subTablePidName="base.subTablePidName"
      :isLogicDeleteMode="base.isLogicDeleteMode"
      :isRowReadonlyExpression="base.isRowReadonlyExpression"
      :rowSelection="rowSelection"
      :glComponentInst="glComponentInst"
      :glIsRuntime="glIsRuntime"
      :glRuntimeFlag="glRuntimeFlag"
      :tableSettingId="tableSettingId"
      :pushedRecordKeys="pushedRecordKeys"
      :unPushedRecordKeys="unPushedRecordKeys"
      :tableDraggable="base.tableDraggable"
      :autoResetSeqNoAfterDrag="base.autoResetSeqNoAfterDrag"
      :readonly="readonly"
      @select="select"
      @selectionChange="selectionChange"
      @headerClick="headerClick"
      @columnResize="columnResize"
      @updateColumns="updateColumns"
      @updateRow="onUpdateRow"
      @fetchSuccess="onFetchSuccess"
      @fetchFail="onFetchFail"
      @rowClick="rowClick"
      @rowContextmenu="rowContextmenu"
      @rowDblclick="rowDblclick"
      @cellClick="cellClick"
      @cellContextmenu="cellContextmenu"
      @cellDblclick="cellDblclick"
      @change="change"
      @copyRecord="copyRecord"
    ></component>
  </a-card>
</template>

<style lang="less">
.gl-entity-table-plus {
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
}
</style>
