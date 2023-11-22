<template v-model="pageData">
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: 6 }" :model="filterData" :wrapper-col-props="{ span: 18 }" label-align="left">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item v-show="false">
              <a-input v-show="false" v-model="filterData.tableId"/>
              <a-input v-show="false" v-model="filterData.tableName"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.column.index.form.name')" field="name">
              <a-input v-model="filterData.name" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.column.index.form.title')" field="title">
              <a-input v-model="filterData.title" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.column.index.form.dataType')" field="selectType">
              <a-select v-model="filterData.selectType" :options="selectTypeOptions" :placeholder="$t('searchTable.form.selectDefault')">
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.column.index.form.nullable')" field="nullable">
              <a-select v-model="filterData.nullable" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option
                    v-for="item of nullableOptions" :key="item.value as string" :label="$t(`${item.label}`)"
                    :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.column.index.form.uniqued')" field="uniqued">
              <a-select v-model="filterData.uniqued" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option
                    v-for="item of uniquedOptions" :key="item.value as string" :label="$t(`${item.label}`)"
                    :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.column.index.form.enableStatus')" field="enableStatus">
              <a-select v-model="filterData.enableStatus" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option
                    v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="pageData.isModal?12:8">
                      <a-form-item :label="$t('security.org.index.form.createAt')" field="createAt">
                        <a-range-picker v-model="filterData.createAt" style="width: 100%"/>
                      </a-form-item>
                    </a-col>-->
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 84px"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :size="18" direction="vertical">
        <a-button type="primary" @click="search($event)">
          <template #icon>
            <icon-search/>
          </template>
          {{ $t('searchTable.form.search') }}
        </a-button>
        <a-button @click="reset($event)">
          <template #icon>
            <icon-refresh/>
          </template>
          {{ $t('searchTable.form.reset') }}
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-divider style="margin-top: 0"/>
  <a-row style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button v-show="pageData.formState==='edit'" type="primary" @click="addTable($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
      </a-space>
    </a-col>
    <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
      <a-tooltip :content="$t('searchTable.columns.operations.switch.tip')" :popup-visible="pageData.visible"
                 @mouseenter="()=>{pageData.visible=true}" @mouseleave="()=>{pageData.visible=false}">
        <a-switch v-model="pageData.checked" :before-change="beforeChange">
          <template #checked-icon>
            <icon-check/>
          </template>
          <template #unchecked-icon>
            <icon-close/>
          </template>
        </a-switch>
      </a-tooltip>
      <a-tooltip :content="$t('searchTable.actions.refresh')">
        <div class="action-icon" @click="search($event)">
          <icon-refresh size="18"/>
        </div>
      </a-tooltip>
      <a-tooltip :content="$t('searchTable.actions.columnSetting')">
        <a-popover position="bl" trigger="click" @popup-visible-change="popupVisibleChange">
          <div class="action-icon">
            <icon-settings size="18"/>
          </div>
          <template #content>
            <div id="tableSetting">
              <div v-for="(item, index) in showColumns" :key="item.dataIndex" class="setting">
                <div style="margin-right: 4px; cursor: move">
                  <icon-drag-arrow/>
                </div>
                <div>
                  <a-checkbox
                      v-model="item.checked"
                      @change="handleChange($event, item as TableColumnData, index)"></a-checkbox>
                </div>
                <div class="title">
                  {{ item.title === '#' ? $t('model.column.index.form.index') : $t(`${item.title}`) }}
                </div>
              </div>
            </div>
          </template>
        </a-popover>
      </a-tooltip>
    </a-col>
  </a-row>
  <a-table
      :bordered="{cell:true}"
      :columns="(cloneColumns as TableColumnData[])"
      :data="renderData"
      :loading="loading"
      :pagination="basePagination.pageSize>1000?false:pagination"
      :stripe="true"
      column-resizable
      row-key="id"
      @page-change="onPageChange">
    <template #columns>
      <a-table-column :title="$t('model.column.index.form.index')" :width="80" align="center" data-index="index" fixed="left">
        <template #cell="{  rowIndex }">{{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}</template>
      </a-table-column>
      <a-table-column
          :ellipsis="true" :title="$t('model.column.index.form.name')" :tooltip="true" :width="150" data-index="name" fixed="left">
        <template #cell="{record}">
          {{ record.name }}
          <a-button v-if="record.key===true" class="list-action-button-default" type="outline">
            {{ $t('model.column.index.form.name.key') }}
          </a-button>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.title')" :tooltip="true" :width="150" data-index="title"/>
      <a-table-column :title="$t('model.column.index.form.enableStatus')" :width="100" data-index="enableStatus">
        <template #cell="{ record }">
          {{ $t(`model.column.index.form.enableStatus.${record.enableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.fieldName')" :tooltip="true" :width="150" data-index="fieldName"/>
      <a-table-column v-if="pageData.params.pId===''" :ellipsis="true" :title="$t('model.column.index.form.tableName')" :tooltip="true" :width="250"
                      data-index="tableName"/>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.dataType')" :tooltip="true" :width="150" data-index="selectType">
        <template #cell="{record}">
          {{ formatSelectType(record.selectType) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.column.index.form.charMaxLength')" :width="130" data-index="charMaxLength"/>
      <a-table-column :title="$t('model.column.index.form.numericPrecision')" :width="130" data-index="numericPrecision"/>
      <a-table-column :title="$t('model.column.index.form.numericScale')" :width="130" data-index="numericScale"/>
      <a-table-column :title="$t('model.column.index.form.nullable')" :width="110" data-index="nullable">
        <template #cell="{ record }">
          {{ $t(`model.column.index.form.nullable.${record.nullable}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.column.index.form.key')" :width="110" data-index="key">
        <template #cell="{ record }">
          {{ $t(`model.column.index.form.key.${record.key}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.column.index.form.uniqued')" :width="110" data-index="uniqued">
        <template #cell="{ record }">
          {{ $t(`model.column.index.form.uniqued.${record.uniqued}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.column.index.form.numericSigned')" :width="110" data-index="numericSigned">
        <template #cell="{ record }">
          {{ $t(`model.column.index.form.numericSigned.${record.numericSigned}`) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.type')" :tooltip="true" :width="150" data-index="type"/>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.defaultValue')" :tooltip="true" :width="130" data-index="defaultValue"/>
      <a-table-column :title="$t('model.column.index.form.ordinalPosition')" :width="100" data-index="ordinalPosition"/>
      <a-table-column :title="$t('model.column.index.form.createAt')" :width="180" data-index="createAt"/>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.comment')" :tooltip="true" :width="200" data-index="comment"/>
      <a-table-column
          v-show="pageData.formState==='edit'" :title="$t('model.column.index.form.operations')"
          :width="230" align="center" data-index="operations" fixed="right">
        <template #cell="{ record,isDefault = defaultColumnMetas.includes(record.name)}">
          <!--          <a-button size="small" type="text" @click="addPermission(record)">
                      {{ $t('searchTable.columns.operations.permission') }}
                    </a-button>-->
          <a-tooltip v-if="isDefault" :content="$t('model.column.index.form.operations.disabled')">
            <a-button class="button-disabled" size="small" type="text">
              {{ $t('searchTable.columns.operations.alter') }}
            </a-button>
          </a-tooltip>
          <a-tooltip v-else :content="$t('searchTable.columns.operations.alter.warning')">
            <a-button size="small" type="text" @click="alterTable(record.id)">
              {{ $t('searchTable.columns.operations.alter') }}
            </a-button>
          </a-tooltip>
          <!--    编辑      -->
          <a-tooltip v-if="isDefault" :content="$t('model.column.index.form.operations.disabled')">
            <a-button class="button-disabled" size="small" type="text">
              {{ $t('searchTable.columns.operations.edit') }}
            </a-button>
          </a-tooltip>
          <a-button v-else size="small" type="text" @click="editTable(record.id)">
            {{ $t('searchTable.columns.operations.edit') }}
          </a-button>
          <!--    删除      -->
          <a-tooltip v-if="isDefault" :content="$t('model.column.index.form.operations.disabled')">
            <a-button class="button-disabled" size="small" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-tooltip>
          <a-popconfirm
              v-else :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning"
              @ok="deleteTable(record.id)">
            <a-button size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </template>
    <template #empty>
      <a-empty style="width: 33%;"/>
    </template>
  </a-table>
  <ColumnForm ref="columnFormRef"></ColumnForm>
  <ColumnDrawer ref="columnDrawerRef"></ColumnDrawer>
  <PermissionDrawer ref="permissionDrawerRef"></PermissionDrawer>
</template>

<script lang="ts" setup>
/* 导入 */
import {nextTick, reactive, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
// 分页列表
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue';
import {Notification} from "@arco-design/web-vue";
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
// 引用其他对象、方法
import {ListUrlParams, PageQueryFilter, PageQueryRequest} from '@/api/base';
import {deleteTableColumn as deleteList, FilterTableColumnForm, pageQueryTableColumns as pageQueryList, QueryTableColumnForm} from '@/api/model';
import {
  columns,
  columnSelectType,
  defaultColumnMetas,
  enableStatusOptions,
  nullableOptions,
  selectTypeOptions,
  uniquedOptions
} from '@/views/model/column/searchTable';
// 引用其他页面
import ColumnForm from '@/views/model/column/form.vue';
import ColumnDrawer from '@/views/model/column/drawer.vue';
import {useRoute} from "vue-router";
import PermissionDrawer from "@/views/model/table/permission/drawer.vue";

/* 列表 */
type Column = TableColumnData & { checked?: true };
const pageData = ref({
  current: 1, pageSize: 10, formState: 'edit',
  isModal: false, params: {pId: '', pName: ''},
  checked: true, visible: false
});
const columnFormRef = ref(null);
const columnDrawerRef = ref(null);
const permissionDrawerRef = ref(null);
// 国际化
const {t} = useI18n();
const route = useRoute();
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || ''
});
// 加载
const {loading, setLoading} = useLoading(true);
// 分页列表参数
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: pageData.value.current, pageSize: pageData.value.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<PageQueryFilter[]>([]);
const isDefault = ref(false);
/* 列表 */
const generateFilterData = (): FilterTableColumnForm => {
  return {
    id: '',
    tableId: '', // 表id
    tableName: '', // 表名
    title: '', // 实体属性中文,中文名
    name: '', // 列名
    dataType: '', // 数据类型
    selectType: '',
    key: '', // 列键
    nullable: '', // 是否可空 YES_OR_NO
    uniqued: '',//  // 唯一约束
    enableStatus: '', // 状态
    createAt: [],
    appId: routeParams.value.appId,
    tenantCode: routeParams.value.tenantCode,
  };
};
const filterData = ref(generateFilterData());
/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest = {current: pageData.value.current, pageSize: pageData.value.pageSize}) => {
  setLoading(true);
  try {
    const {data} = await pageQueryList(params);
    renderData.value = [];
    if (pageData.value.checked) {
      data.items.forEach((item, index) => {
        if (!defaultColumnMetas.value.includes((item as unknown as QueryTableColumnForm).name)) {
          renderData.value.push(item);
        }
      });
    } else {
      renderData.value = data.items;
    }
    pagination.current = params.current;
    pagination.pageSize = basePagination.pageSize;
    pagination.total = data.total;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  } finally {
    setLoading(false);
  }
};
/* 获取列表数据 */
fetchData();
/**
 * 删除
 * @param id
 * @param successBack
 */
const deleteData = async (id: string, successBack: any) => {
  try {
    await deleteList(id);
    successBack();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};
const beforeChange = () => {
  pageData.value.checked = !pageData.value.checked;
  search();
}
const formatSelectType = (value: string): string => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of columnSelectType) {
    if (item.value === value) {
      return item.label;
    }
  }
  return '';
}
/**
 * 条件查询 - 搜索
 */
const search = (ev?: Event) => {
  fetchData({...basePagination, ...filterData.value,} as unknown as PageQueryRequest);
};
/**
 * 条件查询 - 重置
 */
const reset = (ev?: Event) => {
  basePagination.current = pageData.value.current;
  filterData.value = generateFilterData();
  filterData.value.tableId = pageData.value.params.pId || '';
  filterData.value.tableName = pageData.value.params.pName || '';
  search();
};
/**
 * 分页 - 页面跳转
 * @param page
 */
const onPageChange = (page: number) => {
  basePagination.current = page;
  search();
};

/* 列表，按钮、操作列 */
const addTable = (ev: MouseEvent) => {
  if (pageData.value.isModal && !pageData.value.params.pId) {
    Notification.warning(t('security.dict.index.notice.warning2'));
    return;
  }
  if (columnDrawerRef.value) {
    const formParams: Record<string, any> = pageData.value.params || {};
    formParams.editName = true;
    // @ts-ignore
    columnDrawerRef.value?.openForm({action: 'add', params: formParams, closeBack: reset});
  }
};
const viewTable = (id: string) => {
  if (columnDrawerRef.value) {
    const formParams: Record<string, any> = pageData.value.params || {};
    formParams.editName = false;
    // @ts-ignore
    columnDrawerRef.value?.openForm({action: 'view', 'id': id, params: pageData.value.params});
  }
}
const editTable = (id: string) => {
  if (columnDrawerRef.value) {
    const formParams: Record<string, any> = pageData.value.params || {};
    formParams.editName = false;
    // @ts-ignore
    columnDrawerRef.value?.openForm({action: 'edit', 'id': id, params: pageData.value.params, closeBack: reset});
  }
}
const alterTable = (id: string) => {
  if (columnDrawerRef.value) {
    const formParams: Record<string, any> = pageData.value.params || {};
    formParams.editName = true;
    // @ts-ignore
    columnDrawerRef.value?.openForm({action: 'edit', 'id': id, params: pageData.value.params, closeBack: reset});
  }
}
const addPermission = (record: QueryTableColumnForm) => {
  if (permissionDrawerRef.value) {
    // @ts-ignore
    permissionDrawerRef.value?.openForm({
      action: pageData.value.formState, pageSize: 10000,
      isModal: pageData.value.isModal,
      params: {pId: record.id, pName: record.name, pType: 'ep'}
    });
  }
}

const deleteTable = (id: string) => {
  deleteData(id, () => {
    reset();
  });
}

/* 分页功能区 - 固定方法 */
const handleChange = (checked: boolean | (string | boolean | number)[], column: Column, index: number) => {
  if (!checked) {
    cloneColumns.value = showColumns.value.filter((item) => item.dataIndex !== column.dataIndex);
  } else {
    cloneColumns.value.splice(index, 0, column);
  }
};
const exchangeArray = <T extends Array<any>>(array: T, beforeIdx: number, newIdx: number, isDeep = false): T => {
  const newArray = isDeep ? cloneDeep(array) : array;
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(beforeIdx, 1, newArray.splice(newIdx, 1, newArray[beforeIdx]).pop());
  }
  return newArray;
};
const popupVisibleChange = (visible: boolean) => {
  if (visible) {
    nextTick(() => {
      const el = document.getElementById('tableSetting') as HTMLElement;
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const {oldIndex, newIndex} = e;
          exchangeArray(cloneColumns.value, oldIndex, newIndex);
          exchangeArray(showColumns.value, oldIndex, newIndex);
        }
      });
    });
  }
};
watch(() => columns.value, (val) => {
    cloneColumns.value = cloneDeep(val);
    cloneColumns.value.forEach((item, index) => {
      item.checked = true;
    });
    showColumns.value = cloneDeep(cloneColumns.value);
  },
  {deep: true, immediate: true}
);

/* 对外调用方法 */
const loadList = (urlParams: ListUrlParams) => {
  pageData.value.formState = urlParams.action || 'edit';
  pageData.value.isModal = urlParams.isModal || false;
  pageData.value.params.pId = urlParams.params?.pId || '';
  pageData.value.params.pName = urlParams.params?.pName || '';
  pageData.value.visible = true;
  setTimeout(() => {
    pageData.value.visible = false;
  }, 1000 * 1);
  basePagination.pageSize = urlParams.pageSize || pageData.value.pageSize;
  reset();
}

// 将方法暴露出去
defineExpose({loadList});
</script>

<script lang="ts">
export default {
  name: 'SearchTable'
};
</script>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
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

.button-disabled {
  cursor: not-allowed;
  color: var(--color-text-3) !important;
  background-color: transparent !important;
  border: 1px solid transparent !important;
}

.list-action-button-default {
  cursor: auto;
  height: 20px;
  font-size: 12px;
  border-radius: 5px;
  line-height: 20px;
  padding: 0 5px;
}
</style>
