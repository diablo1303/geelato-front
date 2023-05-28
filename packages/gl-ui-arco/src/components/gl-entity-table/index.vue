<script setup lang="ts">
// @ts-nocheck
import {
  computed,
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
} from "@arco-design/web-vue/es/table/interface";
import useLoading from "../../hooks/loading";
import {useI18n} from "vue-i18n";
import cloneDeep from "lodash/cloneDeep";
import Sortable from "sortablejs";
import {
  entityApi,
  FieldMeta,
  EntityReader,
  EntityReaderParam,
  MixUtil,
  CheckUtil, utils,
} from "@geelato/gl-ui";
import type {Column, TableColumnDataPlus} from "./table";
import {useGlobal} from "@geelato/gl-ui";
import {ComponentMeta} from "@/components/gl-toolbar/toolbar";
import {PaginationProps} from "@arco-design/web-vue";
import {Schema} from "b-validate";
// 直接在template使用$modal，build时会报错，找不到类型，这里进行重新引用定义
const $modal = useGlobal().$modal;
const emit = defineEmits(["updateColumns"]);
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
  rowSelection: {
    type: Object as PropType<TableRowSelection>,
    default() {
      return {
        showCheckedAll: true,
        // checkbox | radio | undefined
        type: "",
      };
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
  }
});


let recordSchema = new Schema({})

/**
 *  基于是否启用编辑功能，进行插槽信息的转换
 *  基于
 */
watch(() => props.enableEdit,
    () => {
      const editSlotNameFlag = '__edit'
      console.log('GlEntityTable > props.enableEdit:', props.enableEdit)
      if (props.enableEdit) {
        // 如果启用，需将column中没有设置插槽的，生成插槽
        props.columns.forEach((col: Column) => {
          if (col.xRenderScript) {
            col.slotName = col.slotName || utils.gid(editSlotNameFlag, 16)
          }
          if (col.xEditComponent) {
            col.slotName = col.slotName || utils.gid(editSlotNameFlag, 16)
            // 验证信息
            if (col.xEditComponent.props.rules) {
              recordSchema.schema[col.dataIndex!] = toRaw(col.xEditComponent.props.rules)
            }
          } else {
            col.slotName = undefined
          }
          console.log('GlEntityTable > col:', col, col.slotName)
        })
      } else {
        props.columns.forEach((col: Column) => {
          col.slotName = col.slotName && col.slotName.startsWith(editSlotNameFlag) ? "" : col.slotName
          console.log('GlEntityTable > col:', col)
        })
      }
      console.log('GlEntityTable > columns after convert:', recordSchema)
    },
    {immediate: true}
)

const {loading, setLoading} = useLoading(true);
const {t} = CheckUtil.isBrowser() ? useI18n() : {
  t: () => {
  }
};
const renderData = ref<Array<object>>([]);

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

const fetchData = async (readerInfo?: {
  pageSize?: number,
  pageNo?: number,
  params?: Array<EntityReaderParam>
}) => {
  setLoading(true);
  try {
    const entityReader = createEntityReader();
    // @ts-ignore
    entityReader.params = readerInfo?.params;
    // @ts-ignore
    entityReader.pageSize = readerInfo?.pageSize || pagination.pageSize
    const response = await entityApi.queryByEntityReader(entityReader);
    console.log('GlEntityTable > fetchData() > response:', response)
    renderData.value = response.data.data;
    pagination.pageSize = readerInfo?.pageSize || pagination.pageSize
    pagination.current = readerInfo?.pageNo || 1;
    pagination.total = response.data.total;
  } catch (err) {
    console.error(err)
    // you can report use errorHandler or other
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
const handleChange = (
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
          emit("updateColumns", showColumns.value);
        },
      });
    });
  }
};


const optColumn = {title: '操作', slotName: '#', fixed: 'right'}
watch(() => columns.value,
    (val) => {
      // @ts-ignore
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      cloneColumns.value.push(optColumn as Column)
      showColumns.value = cloneDeep(cloneColumns.value);
      console.log('GlEntityTable > update cloneColumns:', cloneColumns)
      emit("updateColumns", showColumns.value);
    },
    {deep: true, immediate: true}
)

const evalExpression = (data: {
  record: TableData;
  column: TableColumnDataPlus;
  rowIndex: number;
}) => {
  const ctx = {
    record: toRaw(data.record),
    column: toRaw(data.column),
    rowIndex: toRaw(data.rowIndex),
  };
  return MixUtil.evalPlus(ctx.column.xRenderScript, ctx, "$ctx");
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
    console.log('sleep 5ms and validate status:', validateStatus)
    utils.sleep(5)
    times--
    if (times <= 0) {
      break
    }
  }
  console.log('validate record:', toRaw(record), 'rowIndex:', rowIndex, 'and get result:', result, 'cloneColumns:', cloneColumns.value)
  setError(record, rowIndex, result)
  return result
}
// 对应整个数据表，构建对应的检查错误信息表
const tableErrors = ref<Array<object | null>>([])
tableErrors.value.length = cloneColumns.value.length
const setError = (record: object, rowIndex: number, err: { [key: string]: any },) => {
  console.log()
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
  if (Object.keys(result).length > 0) {
    // 有异常

    // 无异常

  }
}

const removeRecord = (record: object, rowIndex: number) => {
  renderData.value.splice(rowIndex, 1)
}
console.log('props.columns:', props.columns)
console.log('cloneColumns', cloneColumns, 'columnActions:', props.columnActions)

defineExpose({search, popupVisibleChange, handleChange, validateRecord, addRow});
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
           :scroll="{}"
           @page-change="onPageChange"
           @page-size-change="onPageSizeChange"
  >
    <template ##="{ record,rowIndex }">
      <a-space :size="0" class="gl-entity-table-cols-opt">
        <template v-if="enableEdit">
          <!-- 在编辑模式下，默认的操作：保存、删除 -->
          <a-button type="text" size="small" @click="saveRow(record,rowIndex)">保存</a-button>
          <a-button type="text" status="danger" size="small" @click="removeRecord(record,rowIndex)">删除</a-button>
        </template>
        <template v-for="(columnAction,index) in columnActions" :key="index">
          <GlComponent v-if="columnAction" :glComponentInst="columnAction" :glCtx="{record:record,rowIndex:rowIndex}"
          ></GlComponent>
        </template>
      </a-space>
    </template>
    <template v-for="column in slotColumns" v-slot:[column.slotName]="{ record,rowIndex }">
      <div :class="{'gl-validate-error':tableErrors[rowIndex]&&tableErrors[rowIndex][column.dataIndex]}">
        <GlComponent v-model="renderData[rowIndex][column.dataIndex]" @update="validateRecord(record,rowIndex)"
                     :glComponentInst="column.xEditComponent"></GlComponent>
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
