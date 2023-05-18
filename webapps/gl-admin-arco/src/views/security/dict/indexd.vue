<template>
  <div class="container">
    <Breadcrumb :items="['sercurity.dict.index.menu.list', 'sercurity.dict.index.menu.list.searchTable']"/>
    <a-card class="general-card" :title="$t('sercurity.dict.index.menu.list.searchTable')">
      <a-row>
        <a-col :flex="1">
          <a-form :model="filterData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="dicName" :label="$t('sercurity.dict.index.form.dicName')">
                  <a-input v-model="filterData.dicName"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="dicCode" :label="$t('sercurity.dict.index.form.dicCode')">
                  <a-input v-model="filterData.dicCode"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="createAt" :label="$t('sercurity.dict.index.form.createAt')">
                  <a-range-picker v-model="filterData.createAt" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="tenantCode" :label="$t('sercurity.dict.index.form.tenantCode')">
                  <a-input v-model="filterData.tenantCode"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="enableStatus" :label="$t('sercurity.dict.index.form.enableStatus')">
                  <a-select v-model="filterData.enableStatus" :placeholder="$t('searchTable.form.selectDefault')">
                    <a-option v-for="item of enableStatusOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical"/>
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search/>
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
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
            <a-button type="primary" @click="addTable">
              <template #icon>
                <icon-plus/>
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search">
              <icon-refresh size="18"/>
            </div>
          </a-tooltip>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover trigger="click" position="bl" @popup-visible-change="popupVisibleChange">
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
                      <a-checkbox v-model="item.checked" @change="handleChange($event, item as TableColumnData, indexd)"></a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? $t('sercurity.dict.index.form.index') : $t(`${item.title}`) }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
          v-model:selectedKeys="selectedKeys"
          row-key="id" column-resizable
          :loading="loading"
          :pagination="pagination"
          :columns="(cloneColumns as TableColumnData[])"
          :data="renderData"
          :bordered="{cell:true}"
          :row-selection="rowSelection"
          :stripe="true"
          @page-change="onPageChange">
        <template #columns>
          <a-table-column :title="$t('sercurity.dict.index.form.index')" data-index="index" width="80" align="center">
            <template #cell="{  rowIndex }">
              {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
            </template>
          </a-table-column>
          <a-table-column :title="$t('sercurity.dict.index.form.dicName')" data-index="dicName" width="150" ellipsis="true" tooltip="true"></a-table-column>
          <a-table-column :title="$t('sercurity.dict.index.form.dicCode')" data-index="dicCode" width="150" ellipsis="true" tooltip="true"></a-table-column>
          <a-table-column :title="$t('sercurity.dict.index.form.tenantCode')" data-index="tenantCode" width="120"></a-table-column>
          <a-table-column :title="$t('sercurity.dict.index.form.seqNo')" data-index="seqNo" width="100"></a-table-column>
          <a-table-column :title="$t('sercurity.dict.index.form.enableStatus')" data-index="enableStatus" width="120">
            <template #cell="{ record }">
              {{ $t(`sercurity.dict.index.form.enableStatus.${record.enableStatus}`) }}
            </template>
          </a-table-column>
          <a-table-column :title="$t('sercurity.dict.index.form.createAt')" data-index="createAt" width="180"></a-table-column>
          <a-table-column :title="$t('sercurity.dict.index.form.dicRemark')" data-index="dicRemark" width="200" ellipsis="true"
                          :tooltip="{position:'right'}"></a-table-column>
          <a-table-column :title="$t('sercurity.dict.index.form.operations')" data-index="operations" width="230" align="center" fixed="right">
            <template #cell="{ record }">
              <a-button v-permission="['admin']" type="text" size="small" @click="viewTable(record.id)">
                {{ $t('searchTable.columns.operations.view') }}
              </a-button>
              <a-button v-permission="['admin']" type="text" size="small" @click="editTable(record.id)">
                {{ $t('searchTable.columns.operations.edit') }}
              </a-button>
              <a-popconfirm :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning" @ok="deleteTable(record.id)">
                <a-button v-permission="['admin']" type="text" size="small">
                  {{ $t('searchTable.columns.operations.delete') }}
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
  <DictForm ref="dictFormRef"></DictForm>
</template>

<script lang="ts" setup>
import {nextTick, reactive, ref, watch} from 'vue';
import useLoading from '@/hooks/loading';
import {deleteDict, pageQueryDict, PageQueryFilter, PageQueryRequest} from '@/api/sercurity_service'
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {columns, enableStatusOptions} from "@/views/security/dict/searchTable";
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import DictForm from './formd.vue'


type Column = TableColumnData & { checked?: true };
/* 列表 */
const generateFilterData = () => {
  return {id: '', dicName: '', dicCode: '', enableStatus: '', tenantCode: '', createAt: []};
};
const {loading, setLoading} = useLoading(true);
const renderData = ref<PageQueryFilter[]>([]);
const filterData = ref(generateFilterData());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const selectedKeys = ref([]);
const rowSelection = reactive({type: 'checkbox', showCheckedAll: true, onlyCurrent: false});
const basePagination: Pagination = {current: 1, pageSize: 10};
const pagination = reactive({...basePagination,});
const dictFormRef = ref(null);
const fetchData = async (params: PageQueryRequest = {current: 1, pageSize: 10}) => {
  setLoading(true);
  try {
    const {data} = await pageQueryDict(params);
    renderData.value = data.items;
    pagination.current = params.current;
    pagination.total = data.total;
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
const search = () => {
  fetchData({
    ...basePagination,
    ...filterData.value,
  } as unknown as PageQueryRequest);
};
const reset = () => {
  filterData.value = generateFilterData();
  search();
};
/* 获取列表数据 */
fetchData();
const onPageChange = (current: number) => {
  fetchData({...basePagination, current});
};
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
const popupVisibleChange = (val: boolean) => {
  if (val) {
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

/* 列表，按钮、操作列 */
const addTable = () => {
  if (dictFormRef.value) {
    dictFormRef.value?.openForm('add', null, reset);
  }
};
const viewTable = (id: string) => {
  if (dictFormRef.value) {
    dictFormRef.value?.openForm('view', id);
  }
}
const editTable = (id: string) => {
  if (dictFormRef.value) {
    dictFormRef.value?.openForm('edit', id, reset);
  }
}
const deleteTable = (id: string) => {
  deleteData(id);
}
const deleteData = async (id: string) => {
  try {
    const {data} = await deleteDict(id);
    reset();
  } catch (err) {
    console.log(err);
  }
};
</script>

<script lang="ts">
export default {
  name: 'SearchTable',
};
</script>

<style scoped lang="less">
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
</style>
