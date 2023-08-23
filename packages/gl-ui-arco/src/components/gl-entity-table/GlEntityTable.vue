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
  TableData,
  TableRowSelection,
  PaginationProps
} from "@arco-design/web-vue";
import useLoading from "../../hooks/loading";
import cloneDeep from "lodash/cloneDeep";
import Sortable from "sortablejs";
import {
  entityApi,
  FieldMeta,
  EntityReader,
  EntityReaderParam,
  utils, useGlobal, FormProvideProxy, FormProvideKey, jsScriptExecutor, PageProvideProxy, PageProvideKey
} from "@geelato/gl-ui";
import type {Column, TableColumnDataPlus} from "./table";
import {Schema} from "b-validate";
import {logicDeleteFieldName} from "./table";
import {mixins} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
// 直接在template使用$modal，build时会报错，找不到类型，这里进行重新引用定义
const $modal = useGlobal().$modal;
// fetch 加载完成数据之后
const emits = defineEmits(["updateColumns", "fetchSuccess"]);
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
    type: Array as PropType<ComponentInstance[]>,
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

const formProvideProxy: FormProvideProxy | undefined = props.isFormSubTable ? inject(FormProvideKey) : undefined
const pageProvideProxy: PageProvideProxy | undefined = inject(PageProvideKey)
let recordSchema = new Schema({})

const slotNameFlag = '__slot'

const setSlotNames = () => {
  // 不管是否编辑状态，如查配置了自定义渲染脚本，需要确认列有slotName
  props.columns.forEach((col: Column) => {
    if (col._renderScript || col._component) {
      col.slotName = col.slotName || utils.gid(slotNameFlag, 20)
    } else {
      delete col.slotName
    }
  })
  // console.log('GlEntityTable > columns after convert:', recordSchema)
}

const refreshFlag = ref(true)
setSlotNames()
// 这个watch 用于设计时，监控列变化时，及时刷新（主要是用于让表达式生效）
if (!props.glIsRuntime) {
  watch(() => {
    return props.columns
  }, () => {
    refreshFlag.value = false
    nextTick(() => {
      refreshFlag.value = true
    })
  }, {deep: true})
}


const {loading, setLoading} = useLoading(false);
const t = (str: any) => {
  return str
}
// 渲染展示的数据
const renderData = ref<Array<object>>([]);

// // 编辑状态时删除的数据，
// const deleteDataWhenEnableEdit = ref<Array<{ id: string, [logicDeleteFieldName]: number }>>([]);
// const resetDeleteDataWhenEnableEdit = () => {
//   deleteDataWhenEnableEdit.value = []
// }
const pagination = reactive({
  ...props.pagination,
});

const columns = computed<TableColumnDataPlus[]>(() => {
  // 如果启用了多语言，则需要对标题进行翻译
  let columnData: Array<TableColumnDataPlus> = [];
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
  // resetDeleteDataWhenEnableEdit()
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
    const response:any = await entityApi.queryByEntityReader(entityReader);
    // console.log('GlEntityTable > fetchData() > response:', response)
    renderData.value = response.data;
    pagination.pageSize = readerInfo?.pageSize || pagination.pageSize
    pagination.current = readerInfo?.pageNo || 1;
    pagination.total = Number.parseInt(response.data.total);
    emits('fetchSuccess', {data: renderData.value, pagination})
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false);
  }
};

const search = (entityReaderParams: Array<EntityReaderParam>) => {
  // console.log('search entityReaderParams:', entityReaderParams)
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
        item.width = item.width || 150
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
  if (!data.column._renderScript) {
    return data.record[data.rowIndex]
  }
  const ctx = {
    pageProxy: pageProvideProxy,
    record: toRaw(data.record),
    column: toRaw(data.column),
    rowIndex: toRaw(data.rowIndex),
  };
  return jsScriptExecutor.evalExpression(ctx.column._renderScript, ctx);
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

const getRenderData = () => {
  return renderData.value
}
const getRenderColumns = () => {
  return cloneColumns.value
}
defineExpose({
  search,
  popupVisibleChange,
  changeShowColumns,
  getRenderData,
  getRenderColumns
});
</script>

<template>
  <a-table class="gl-entity-table" v-if="!enableEdit&&refreshFlag" row-key="id"
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
        <template v-for="(columnAction,index) in columnActions" :key="index">
          <template v-if="columnAction&&record">
            <GlComponent v-if="columnAction.props.unRender!==true" v-show="columnAction.props._hidden!==true"
                         :glComponentInst="columnAction" :glCtx="{record,rowIndex}"></GlComponent>
          </template>
        </template>
      </a-space>
    </template>
    <template v-for="slotColumn in slotColumns"
              v-slot:[slotColumn.slotName]="{ record, column, rowIndex }">
      <template v-if="column._component&&record">
        <GlComponent :glComponentInst="column._component" v-model="record[column.dataIndex]"
                     :glCtx="{record,rowIndex}"></GlComponent>
      </template>
      <span v-else>
        {{ evalExpression({record, column, rowIndex}) }}
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
  background-color: #fde5e5
}

.gl-entity-table .gl-validate-error .gl-validate-message {
  display: inline-block;
  color: red;
}
</style>
