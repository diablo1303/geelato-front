<script setup lang="ts">
// @ts-nocheck
import {
  computed,
  nextTick, onMounted,
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
import type {Action, Pagination} from "../../types/global";
// import { SelectOptionData } from "@arco-design/web-vue/es/select/interface";
import cloneDeep from "lodash/cloneDeep";
import Sortable from "sortablejs";
import {
  entityApi,
  FieldMeta,
  EntityReader,
  EntityReaderParam,
  MixUtil,
  CheckUtil,
} from "@geelato/gl-ui";
import type {Column, TableColumnDataPlus} from "./table";
import {useGlobal} from "@geelato/gl-ui";
import {ComponentMeta} from "@/components/gl-toolbar/toolbar";

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
    type: Array as PropType<TableColumnData[]>,
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
});

const {loading, setLoading} = useLoading(true);
const {t} = CheckUtil.isBrowser() ? useI18n() : {
  t: () => {
  }
};
const renderData = ref([]);

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
};
const pagination = reactive({
  ...basePagination,
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
    columnData = props.columns as Array<TableColumnData>;
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
  pageNo?: number;
  params?: Array<EntityReaderParam>;
}) => {
  setLoading(true);
  try {
    const entityReader = createEntityReader();
    // @ts-ignore
    entityReader.params = readerInfo?.params;
    const response = await entityApi.queryByEntityReader(entityReader);
    console.log('table > fetch data and response:', response)
    renderData.value = response.data.data;
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

onMounted(() => {
  fetchData();
})
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
      const el = document.getElementById("tableSetting") as HTMLElement;
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

watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
      emit("updateColumns", showColumns.value);
    },
    {deep: true, immediate: true}
);

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
  return MixUtil.evalPlus(ctx.column.xRenderScript, ctx, "ctx");
};
defineExpose({search, popupVisibleChange, handleChange});
</script>

<template>
  <a-table
      row-key="id"
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
  >
    <template #optional="{ record }">
      <a-space>
      <template v-for="(columnAction,index) in columnActions" :key="index">
        <GlComponent v-if="columnAction" :glComponentInst="columnAction"></GlComponent>
        <!--        <a-button size="mini" :status="columnAction.status"-->
        <!--                  @click="$modal.info({ title: 'Name', content: record.name })">-->
        <!--          {{ columnAction.title }}-->
        <!--        </a-button>-->
      </template>
      </a-space>
    </template>
    <template #enableStatus="{ record, column, rowIndex }">
      {{ evalExpression({record, column, rowIndex}) }}
    </template>
  </a-table>
</template>

<style scoped></style>
