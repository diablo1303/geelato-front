<script setup lang="ts">
// @ts-nocheck
import {
  computed, inject,
  nextTick,
  type PropType,
  reactive,
  ref,
  toRaw,
  watch,
} from "vue";
import type {
  TableColumnData,
  TableData,
  TableRowSelection,
  PaginationProps
} from "@arco-design/web-vue";
import useLoading from "../../hooks/loading";
import {useI18n} from "vue-i18n";
import cloneDeep from "lodash/cloneDeep";
import Sortable from "sortablejs";
import {
  entityApi,
  FieldMeta,
  EntityReader,
  EntityReaderParam,
  CheckUtil, utils, useGlobal, FormProvideProxy, FormProvideKey, jsScriptExecutor, PageProvideProxy, PageProvideKey
} from "@geelato/gl-ui";
import type {ComponentMeta} from "@geelato/gl-ui-schema";
import type {Column, TableColumnDataPlus} from "./table";
import {Schema} from "b-validate";
import {logicDeleteFieldName} from "./table";
import {mixins} from "@geelato/gl-ui";
// 直接在template使用$modal，build时会报错，找不到类型，这里进行重新引用定义
const $modal = useGlobal().$modal;
// fetch 加载完成数据之后
const emits = defineEmits(["updateColumns", "updateRow", "fetchSuccess"]);
const props = defineProps({
  /**
   *  绑定的实体名称
   */
  entityName: {
    type: String,
    required: true,
  },
  /**
   * 展示的列配置
   */
  columns: {
    type: Array as PropType<TableColumnDataPlus[]>,
    default() {
      return [];
    },
  },
  /**
   *  列上的操作配置
   */
  columnActions: {
    type: Array as PropType<ComponentMeta[]>,
    default() {
      return []
    }
  },
  columnResizable: {
    type: Boolean,
    default() {
      return true;
    },
  },
  enableI18n: {
    type: Boolean,
    default() {
      return true;
    },
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
    },
  },
  size: {
    type: String,
    default() {
      return "medium";
    },
  },
  pagination: {
    type: Object as PropType<PaginationProps>,
    default() {
      return {
        current: 1,
        pageSize: 15,
        showTotal: true,
        showPageSize: true,
        pageSizeOptions: [5, 10, 15, 20, 30, 40, 50],
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
});

const formProvideProxy: FormProvideProxy | undefined = inject(FormProvideKey)
const pageProvideProxy: PageProvideProxy | undefined = inject(PageProvideKey)
let recordSchema = new Schema({})

const editSlotNameFlag = '__editSlot'

const setSlotNames = () => {
  // 不管是否编辑状态，如查配置了自定义渲染脚本，需要确认列有slotName
  props.columns.forEach((col: Column) => {
    if (col.xRenderScript) {
      col.slotName = col.slotName || utils.gid(editSlotNameFlag, 20)
    } else {
      delete col.slotName
    }
  })

  // 对于编辑状态
  if (props.enableEdit) {
    // 如果启用编辑，需将column中没有设置插槽的，生成插槽
    props.columns.forEach((col: Column) => {
      if (col.xEditComponent) {
        col.slotName = col.slotName || utils.gid(editSlotNameFlag, 20)
        // 验证信息
        if (col.xEditComponent.props.rules) {
          recordSchema.schema[col.dataIndex!] = toRaw(col.xEditComponent.props.rules)
        }
      } else {
        col.slotName = undefined
      }
      // console.log('GlEntityTable > col:', col, col.slotName)
    })
  } else {
    props.columns.forEach((col: Column) => {
      // 如果未启用编辑
      // col.slotName = col.slotName && col.slotName.startsWith(editSlotNameFlag) ? "" : col.slotName
      // console.log('GlEntityTable > col:', col)
    })
  }
  // console.log('GlEntityTable > columns after convert:', recordSchema)
}

if (props.glIsRuntime) {
  setSlotNames()
} else {
  watch(() => {
    return props.columns
  }, () => {
    setSlotNames()
  }, {deep: true})
}

/**
 *  基于是否启用编辑功能，进行插槽信息的转换
 */
watch(() => props.enableEdit,
    () => {
      setSlotNames()
    },
    {immediate: true}
)

const {loading, setLoading} = useLoading(false);
const {t} = CheckUtil.isBrowser() ? useI18n() : {
  t: () => {
  }
};
// 渲染展示的数据
const renderData = ref<Array<object>>([]);

// 编辑状态时删除的数据，
const deleteDataWhenEnableEdit = ref<Array<{ id: string, [logicDeleteFieldName]: number }>>([]);
const resetDeleteDataWhenEnableEdit = () => {
  deleteDataWhenEnableEdit.value = []
}
const pagination = reactive({
  ...props.pagination,
});

const columns = computed<TableColumnData[]>(() => {
  // 如果启用了多语言，则需要对标题进行翻译
  let columnData: Array<TableColumnData> = [];
  if (props.enableI18n && props.columns) {
    columnData = JSON.parse(JSON.stringify(props.columns));
    columnData.forEach((item) => {
      // console.log("gl-entity-table > columns item:", item, item.title);
      // @ts-ignore
      item.title = item.title ? t(item.title + "") : "";
    });
  } else {
    columnData = props.columns
  }
  return columnData;
});

const createEntityReader = () => {
  let entityReader = new EntityReader();
  entityReader.entity = props.entityName;
  entityReader.order = [];

  const fieldMetas = new Array<FieldMeta>();
  props.columns?.forEach((column) => {
    // 过滤掉操作列
    if (column.slotName !== 'optional') {
      const fm = new FieldMeta();
      // @ts-ignore
      fm.name = column.dataIndex;
      // @ts-ignore
      fm.title = column.title;
      fieldMetas.push(fm);
    }
  });
  entityReader.fields = fieldMetas;
  return entityReader;
};

/**
 * 加载数据的最终方法，在查询、切换分页等场景中调用
 * @param readerInfo
 */
const fetchData = async (readerInfo?: {
  pageSize?: number,
  pageNo?: number,
  params?: Array<EntityReaderParam>
}) => {
  resetDeleteDataWhenEnableEdit()
  // 绑定了有效的实体才发起查询
  // 作为子表时，必须指定子表外键，即对应主表ID的字段
  if (!props.entityName || (props.isFormSubTable && !props.subTablePidName)) {
    return
  }
  setLoading(true);
  try {
    const entityReader = createEntityReader();
    entityReader.params = readerInfo?.params || [];

    // 如果是子查询
    // 增加父表单主键，作为查询字段，若父表单无该主健id，则返回，不知查询
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
    const response = await entityApi.queryByEntityReader(entityReader);
    // console.log('GlEntityTable > fetchData() > response:', response)
    renderData.value = response.data.data;
    pagination.pageSize = readerInfo?.pageSize || pagination.pageSize
    pagination.current = readerInfo?.pageNo || 1;
    pagination.total = response.data.total;
    emits('fetchSuccess', {data: renderData.value, pagination})
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false);
  }
};

const search = (entityReaderParams: Array<EntityReaderParam>) => {
  console.log('search entityReaderParams:', entityReaderParams)
  fetchData({params: entityReaderParams});
};
const onPageChange = (pageNo: number) => {
  fetchData({pageNo});
};

const onPageSizeChange = (pageSize: number) => {
  fetchData({pageSize})
}

const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
): T => {
  const newArray = isDeep ? cloneDeep(array) : array;
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
    );
  }
  return newArray;
};
// cloneColumns:TableColumnData[]
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const changeShowColumns = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
) => {
  if (!checked) {
    cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
    );
  } else {
    cloneColumns.value.splice(index, 0, column);
  }
};
const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById(props.tableSettingId) as HTMLElement;
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const {oldIndex, newIndex} = e;
          exchangeArray(cloneColumns.value, oldIndex, newIndex);
          exchangeArray(showColumns.value, oldIndex, newIndex);
          emits("updateColumns", showColumns.value);
        },
      });
    });
  }
};


const optColumn = {title: '操作', slotName: '#', fixed: 'right', width: 140, align: 'center'}
const scroll = {
  x: "100%"
}
watch(() => columns.value,
    (val) => {
      // @ts-ignore
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
        item.width = item.width || 200
        item.align = item.align || 'center'
      });
      cloneColumns.value.push(optColumn as Column)
      showColumns.value = cloneDeep(cloneColumns.value);
      // console.log('GlEntityTable > update cloneColumns:', cloneColumns)
      emits("updateColumns", showColumns.value);
    },
    {deep: true, immediate: true}
)

const evalExpression = (data: {
  record: TableData;
  column: TableColumnDataPlus;
  rowIndex: number;
}) => {
  const ctx = {
    pageProxy: pageProvideProxy,
    record: toRaw(data.record),
    column: toRaw(data.column),
    rowIndex: toRaw(data.rowIndex),
  };
  return jsScriptExecutor.evalExpression(ctx.column.xRenderScript, ctx);
};

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
  let validateStatus = 'start'
  let result: { [key: string]: any } = {}
  recordSchema.validate(record, (err: any) => {
    result = err
    validateStatus = 'end'
  })
  let times = 1000
  while (validateStatus === 'start') {
    // console.log('sleep 5ms and validate status:', validateStatus)
    utils.sleep(5)
    times--
    if (times <= 0) {
      break
    }
  }
  // console.log('validate record:', toRaw(record), 'rowIndex:', rowIndex, 'and get result:', result, 'cloneColumns:', cloneColumns.value)
  setError(record, rowIndex, result)
  return result
}
// 对应整个数据表，构建对应的检查错误信息表
const tableErrors = ref<Array<object | null>>([])
tableErrors.value.length = cloneColumns.value.length
const setError = (record: object, rowIndex: number, err: { [key: string]: any },) => {
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
 */
const addRow = () => {
  const newRow = {}
  props.columns.forEach((col: Column) => {
    //@ts-ignore
    newRow[col.dataIndex] = col.xEditComponent?.value
  })
  renderData.value.push(newRow)
}
/**
 *  表格在编辑模式下，保存行
 */
const saveRow = (record: object, rowIndex: number) => {
  const result = validateRecord(record, rowIndex)
  if (result && Object.keys(result).length > 0) {
    // 有异常

    return false
  } else {
    // 无异常

    return true
  }
}

/**
 *  表格在编辑模式下，验证表格数据
 */
const validateTable = () => {
  const resultList: Array<any> = []
  let error = false
  renderData.value.forEach((record, rowIndex) => {
    const result = validateRecord(record, rowIndex)
    resultList.push({record, rowIndex, result})
    if (result && Object.keys(result).length > 0) {
      // 有异常
      error = true
    } else {
      // 无异常
    }
  })
  return {error, resultList}
}

const updateRow = (record: object, rowIndex: number) => {
  validateRecord(record, rowIndex)
  emits('updateRow', {record, rowIndex})
}


const deleteRecord = (record: object, rowIndex: number) => {
  const records = renderData.value.splice(rowIndex, 1)
  if (records && records.length > 0) {
    const record: { [key: string]: any } = records[0]
    // 如可该记录没有id，即表示新添加且未保存的，在点删除时，直接删除，不需要再记录到待删除组数中
    if (record.id) {
      deleteDataWhenEnableEdit.value.push({id: record.id, [logicDeleteFieldName]: 1})
    }
  }
  console.log('deleteDataWhenEnableEdit:', deleteDataWhenEnableEdit)
}
// console.log('props.columns:', props.columns)
// console.log('cloneColumns', cloneColumns, 'columnActions:', props.columnActions)
const getRenderData = () => {
  return renderData.value
}
const getDeleteData = () => {
  return deleteDataWhenEnableEdit.value
}
const getRenderColumns = () => {
  return cloneColumns.value
}
defineExpose({
  search,
  popupVisibleChange,
  changeShowColumns,
  validateTable,
  validateRecord,
  addRow,
  getRenderData,
  getRenderColumns,
  getDeleteData
});
</script>

<template>
  <a-table class="gl-entity-table" v-if="enableEdit" row-key="id"
           :loading="loading"
           :pagination="pagination"
           :row-selection="rowSelection"
           :columns="cloneColumns"
           :data="renderData"
           :bordered="{ cell: true }"
           :hoverable="true"
           :stripe="true"
           :column-resizable="columnResizable"
           :size="size"
           :scroll="scroll"
           @page-change="onPageChange"
           @page-size-change="onPageSizeChange"
  >
    <template ##="{ record,rowIndex }">
      <a-space :size="0" class="gl-entity-table-cols-opt">
        <template v-if="enableEdit">
          <!-- 在编辑模式下，默认的操作：复制、删除 -->
          <!--          <a-button type="text" size="small" @click="saveRow(record,rowIndex)">保存</a-button>-->
          <!--          在这里popconfirm无效 TODO-->
          <a-popconfirm content="确定是否删除?">
            <a-button type="text" status="danger" size="small" @click="deleteRecord(record,rowIndex)">删除</a-button>
          </a-popconfirm>
        </template>
        <template v-for="(columnAction,index) in columnActions" :key="index">
          <GlComponent v-if="columnAction" :glComponentInst="columnAction" :glCtx="{record:record,rowIndex:rowIndex}"
          ></GlComponent>
        </template>
      </a-space>
    </template>
    <template v-for="column in slotColumns" v-slot:[column.slotName]="{ record,rowIndex }">
      <div class="gl-entity-table-cols-opt"
           :class="{'gl-validate-error':tableErrors[rowIndex]&&tableErrors[rowIndex][column.dataIndex]}">
        <GlComponent v-model="renderData[rowIndex][column.dataIndex]" @update="updateRow(record,rowIndex)"
                     :glComponentInst="cloneDeep(column.xEditComponent)"></GlComponent>
        <span class="gl-validate-message">{{ tableErrors[rowIndex]?.[column.dataIndex]?.message }}</span>
      </div>
    </template>
  </a-table>
  <a-table class="gl-entity-table" v-else row-key="id"
           :loading="loading"
           :pagination="pagination"
           :row-selection="rowSelection"
           :columns="cloneColumns"
           :data="renderData"
           :bordered="{ cell: true }"
           :hoverable="true"
           :stripe="true"
           :column-resizable="columnResizable"
           :size="size"
           :scroll="{}"
           @page-change="onPageChange"
           @page-size-change="onPageSizeChange"
  >
    <template ##="{ record }">
      <a-space :size="0" class="gl-entity-table-cols-opt">
        <template v-for="(columnAction,index) in columnActions" :key="index">
          <GlComponent v-if="columnAction" :glComponentInst="columnAction" :glCtx="{record:record}"></GlComponent>
        </template>
      </a-space>
    </template>
    <template v-for="slotColumn in slotColumns"
              v-slot:[slotColumn.slotName]="{ record, column, rowIndex }">
      {{ evalExpression({record, column, rowIndex}) }}
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
  background-color: #fde5e5
}

.gl-entity-table .gl-validate-error .gl-validate-message {
  display: inline-block;
  color: red;
}
</style>
