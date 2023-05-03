<template>
  <div>
    <GlQuery ref="queryRef" v-bind="query" @search="onSearch"></GlQuery>
    <a-divider style="margin-top: 16px" />
    <GlToolbar v-bind="toolbar" style="margin-bottom: 8px">
<!--      <template #leftItems>-->
<!--        <a-button type="primary">-->
<!--          <template #icon>-->
<!--            <icon-plus-circle />-->
<!--          </template>-->
<!--          新增-->
<!--        </a-button>-->
<!--        <a-button type="outline">-->
<!--          <template #icon>-->
<!--            <icon-export />-->
<!--          </template>-->
<!--          导出-->
<!--        </a-button>-->
<!--      </template>-->
      <template #rightItems>
        <a-tooltip :content="t('searchTable.actions.refresh')">
          <div class="action-icon" @click="onRefresh">
            <icon-refresh size="18" />
          </div>
        </a-tooltip>
        <a-dropdown @select="handleSelectDensity">
          <a-tooltip :content="t('searchTable.actions.density')">
            <div class="action-icon">
              <icon-line-height size="18" />
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
        <a-tooltip :content="t('searchTable.actions.columnSetting')">
          <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
          >
            <div class="action-icon">
              <icon-settings size="18" />
            </div>
            <template #content>
              <div id="tableSetting">
                <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                >
                  <div style="margin-right: 4px; cursor: move">
                    <icon-drag-arrow />
                  </div>
                  <div>
                    <a-checkbox
                        v-model="item.checked"
                        @change="handleChange($event, item, index)"
                    >
                    </a-checkbox>
                  </div>
                  <div class="title">
                    {{ item.title === "#" ? "序列号" : item.title }}
                  </div>
                </div>
              </div>
            </template>
          </a-popover>
        </a-tooltip>
      </template>
    </GlToolbar>
    <GlEntityTable
        ref="tableRef"
        :entityName="entityName"
        :columns="columns"
        :columnActions="columnActions"
        :size="size"
        @updateColumns="onUpdateColumns"
    ></GlEntityTable>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/**
 * 整合gl-query、gl-toolbar、gl-table形成完整可直接使用的table应用
 */
import GlQuery from "../gl-query/index.vue";
import GlToolbar from "../gl-toolbar/index.vue";
import GlEntityTable from "../gl-entity-table/index.vue";
import {computed, onMounted, type PropType, ref} from "vue";
import type { EntityReader, EntityReaderParam } from "@geelato/gl-ui";
import { type Query, defaultQuery } from "../gl-query/query";
import cloneDeep from "lodash/cloneDeep";
import {
  type SizeProps,
  type Column,
  defaultTable,
  type TableColumnDataPlus,
} from "../gl-entity-table/table";
import { type Toolbar, defaultToolbar } from "../gl-toolbar/toolbar";
import { useI18n } from "vue-i18n";
import { CheckUtil } from "@geelato/gl-ui";
import type {Action} from "../../types/global";
const { t } = CheckUtil.isBrowser() ? useI18n() : { t: ()=>{} };

const props = defineProps({
  // entityReaderInfo: {
  //   type: Object as PropType<EntityReader>,
  //   required: true,
  // },
  entityName: {
    type: String,
    required: true,
  },
  query: {
    type: Object as PropType<Query>,
    required: true,
    default() {
      return defaultQuery;
    },
  },
  toolbar: {
    type: Object as PropType<Toolbar>,
    required: true,
    default() {
      return defaultToolbar;
    },
  },
  columns: {
    type: Array as PropType<TableColumnDataPlus[]>,
    required: true,
    default() {
      return defaultTable;
    },
  },
  /**
   *  列上的操作配置
   */
  columnActions:{
    type:Array as PropType<Action[]>,
    default(){
      return []
    }
  },
  size: {
    type: String as PropType<SizeProps>,
  },
});
// 数据预处理
onMounted(()=>{
  props.columns.forEach((item, index) => {
    if (item.xRenderFnBody) {
      const fn = `(record,column,rowIndex)=>{return ${item.xRenderFnBody}}`;
      // eslint-disable-next-line no-eval
      item.render = eval(fn);
    }
  });
  console.log("转换后的table:", props.columns);
})


const size = ref<SizeProps>(props.size || "medium");
const densityList = computed(() => [
  {
    name: t("searchTable.size.mini"),
    value: "mini",
  },
  {
    name: t("searchTable.size.small"),
    value: "small",
  },
  {
    name: t("searchTable.size.medium"),
    value: "medium",
  },
  {
    name: t("searchTable.size.large"),
    value: "large",
  },
]);
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

const handleSelectDensity = (
  val: string | number | Record<string, any> | undefined,
  e: Event
) => {
  size.value = val as SizeProps;
};

const showColumns = ref<Column[]>([]);
const tableRef = ref();
// const search = (queryFormModal: object) => {
//   tableRef.value.search(queryFormModal);
// };
const popupVisibleChange = (val: boolean) => {
  tableRef.value.popupVisibleChange(val);
};
const handleChange = (event: any, item: any, index: number) => {
  tableRef.value.handleChange(event, item, index);
};
const onUpdateColumns = (showColumnsValue: any) => {
  showColumns.value = showColumnsValue;
};

let lastEntityReaderParams: Array<EntityReaderParam>;
const onSearch = (entityReaderParams: Array<EntityReaderParam>) => {
  console.log("onSearch() > entityReaderParams:", entityReaderParams);
  tableRef.value.search(entityReaderParams);
  lastEntityReaderParams = entityReaderParams;
};
const onRefresh = (event: MouseEvent) => {
  onSearch(lastEntityReaderParams);
};

const queryRef = ref(null);
</script>

<style scoped lang="less">
.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

//.active {
//  color: #0960bd;
//  background-color: #e3f4fc;
//}
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
