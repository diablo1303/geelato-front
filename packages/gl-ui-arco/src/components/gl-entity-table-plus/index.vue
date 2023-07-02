<script lang="ts">
/**
 *  整合gl-query、gl-toolbar、gl-table形成完整可直接使用的table应用
 */
export default {
  name: "GlEntityTablePlus"
}
</script>
<script setup lang="ts">
// @ts-nocheck
import GlQuery from "../gl-query/index.vue";
import GlToolbar from "../gl-toolbar/index.vue";
import GlEntityTable from "../gl-entity-table/index.vue";
import {computed, inject, onMounted, type PropType, ref} from "vue";
import type {EntityReaderParam} from "@geelato/gl-ui";
import QueryItem from "../gl-query/query";
import cloneDeep from "lodash/cloneDeep";
import {
  type SizeProps,
  type Column,
  defaultTable,
  type TableColumnDataPlus, BaseInfo, logicDeleteFieldName,
} from "../gl-entity-table/table";
import Toolbar, {defaultToolbar} from "../gl-toolbar/toolbar";
import {useI18n} from "vue-i18n";
import {CheckUtil, entityApi, PageProvideKey, PageProvideProxy, GlIconfont, utils, mixins} from "@geelato/gl-ui";
import type {Action} from "../../types/global";

/**
 *  change:在表格编辑状态时，更换表格数据时触发
 */
const emits = defineEmits(['changeRecord', 'fetchSuccess'])
const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const {t} = CheckUtil.isBrowser() ? useI18n() : {
  t: () => {
  }
};


const props = defineProps({
  base: {
    type: Object as PropType<BaseInfo>,
    default() {
      return new BaseInfo()
    }
  },
  query: {
    type: Array as PropType<Array<QueryItem>>,
    required: true,
    default() {
      return [];
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
  columnActions: {
    type: Array as PropType<Action[]>,
    default() {
      return []
    }
  },
  size: {
    type: String as PropType<SizeProps>,
  },
  ...mixins.props
});
// 数据预处理
onMounted(() => {
  props.columns.forEach((item, index) => {
    if (item.xRenderFnBody) {
      const fn = `(record,column,rowIndex)=>{return ${item.xRenderFnBody}}`;
      // eslint-disable-next-line no-eval
      item.render = eval(fn);
    }
  });
  // console.log("转换后的table:", props.columns);
})

const tableSettingId = utils.gid('tSetting', 20)
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
const onUpdateRow = (data: { record: object, rowIndex: number }) => {
  console.log('GlEntityTablePlus > onUpdateRow() > data:', data)
  emits('changeRecord', data)
}

let lastEntityReaderParams: Array<EntityReaderParam>;
// 在初始化（init）时，GlQuery组件的事件会触发：@search="onSearch"
const onSearch = (entityReaderParams: Array<EntityReaderParam>) => {
  // console.log("onSearch() > entityReaderParams:", entityReaderParams);
  tableRef.value.search(entityReaderParams);
  lastEntityReaderParams = entityReaderParams;
}
const refresh = (event?: MouseEvent) => {
  onSearch(lastEntityReaderParams);
};

const queryRef = ref(null);
const addRow = () => {
  tableRef.value.addRow()
}
/**
 * 删除行，并刷新
 * 默认为逻辑删除，依据属性base.isLogicDeleteMode进行区分
 * @param params
 */
const deleteRow = (params: any) => {
  const id = params[0].id
  if (props.base.isLogicDeleteMode === false) {
    entityApi.delete(props.base.entityName, {id: id}).then(() => {
      refresh()
    })
  } else {
    entityApi.save(props.base.entityName, {id, [logicDeleteFieldName]: 1}).then(() => {
      refresh()
    })
  }
  console.log('GlEntityTablePlus > deleteRow() > params:', params)
}
const saveRow = () => {

}
const rowSelection = computed(() => {
  return props.base.checkType === 'checkbox' || props.base.checkType === 'radio' ? {
    type: props.base.checkType,
    showCheckedAll: props.base.showCheckAll && props.base.checkType === 'checkbox'
  } : undefined
})

const getRenderData = () => {
  return tableRef.value.getRenderData()
}

const getRenderColumns = () => {
  return tableRef.value.getRenderColumns()
}
const getDeleteData = () => {
  return tableRef.value.getDeleteData()
}

const validateTable = () => {
  return tableRef.value.validateTable()
}
const onFetchSuccess = (args: any) => {
  emits('fetchSuccess', args)
}
defineExpose([deleteRow, refresh, getRenderData, getRenderColumns, getDeleteData, validateTable])
</script>

<template>
  <a-card class="general-card" :title="base.tableTitle" :body-style="{padding:base.tablePadding}">
    <GlQuery v-if="query" v-show="base.showQuery!==false" ref="queryRef" :items="query" @search="onSearch"></GlQuery>
    <a-divider v-show="base.showQuery!==false" style="margin-top: 16px"/>
    <GlToolbar v-show="base.showToolbar!==false" v-bind="toolbar" style="margin-bottom: 8px">
      <template #leftItems>
        <div v-if="base.enableEdit" class="action-icon">
          <a-button @click="addRow" shape="round" type="text" size="small">
            <GlIconfont type="gl-plus-circle"></GlIconfont>&nbsp;添加一行
          </a-button>
        </div>
      </template>
      <template #rightItems>
        <a-tooltip content="刷新">
          <div class="action-icon" @click="refresh">
            <GlIconfont type="gl-refresh"></GlIconfont>
          </div>
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
        <a-tooltip :content="t('searchTable.actions.columnSetting')">
          <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
          >
            <div class="action-icon">
              <GlIconfont type="gl-setting"></GlIconfont>
            </div>
            <template #content>
              <div :id="tableSettingId">
                <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                >
                  <div style="margin-right: 4px; cursor: move">
                    <!--   TODO 待支持拖拽排序 -->
                    <!--                    <GlIconfont type="gl-drag-arrow"></GlIconfont>-->
                  </div>
                  <div>
                    <a-checkbox
                        v-model="item.checked"
                        @change="handleChange($event, item, index)"
                    >
                    </a-checkbox>
                  </div>
                  <div class="title">
                    {{ item.title === "#" ? "序号" : item.title }}
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
        :entityName="base.entityName"
        :columns="columns"
        :columnActions="columnActions"
        :size="size"
        :showPagination=base.showPagination
        :enableEdit="base.enableEdit"
        :isFormSubTable="base.isFormSubTable"
        :subTablePidName="base.subTablePidName"
        :isLogicDeleteMode="base.isLogicDeleteMode"
        :rowSelection="rowSelection"
        @updateColumns="onUpdateColumns"
        @updateRow="onUpdateRow"
        @fetchSuccess="onFetchSuccess"
        :glIsRuntime="glIsRuntime"
        :glRuntimeFlag="glRuntimeFlag"
    ></GlEntityTable>
  </a-card>
</template>

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
