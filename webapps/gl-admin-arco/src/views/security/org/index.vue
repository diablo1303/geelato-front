<template>
  <div class="container">
    <Breadcrumb :items="['sercurity.org.index.menu.list', 'sercurity.org.index.menu.list.searchTable']"/>
    <a-card class="general-card" :title="$t('sercurity.org.index.menu.list.searchTable')">
      <a-row>
        <a-col :flex="1">
          <a-form :model="filterData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="name" :label="$t('sercurity.org.index.form.name')">
                  <a-input v-model="filterData.name"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="code" :label="$t('sercurity.org.index.form.code')">
                  <a-input v-model="filterData.code"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="createAt" :label="$t('sercurity.org.index.form.createAt')">
                  <a-range-picker v-model="filterData.createAt" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('sercurity.org.index.form.status')">
                  <a-select v-model="filterData.status" :placeholder="$t('searchTable.form.selectDefault')">
                    <a-option v-for="item of statusOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="type" :label="$t('sercurity.org.index.form.type')">
                  <a-select v-model="filterData.type" :placeholder="$t('searchTable.form.selectDefault')">
                    <a-option v-for="item of typeOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
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
                      <a-checkbox v-model="item.checked" @change="handleChange($event, item as TableColumnData, index)"></a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? $t('sercurity.org.index.form.index') : $t(`${item.title}`) }}
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
          <a-table-column :title="$t('sercurity.org.index.form.index')" data-index="index" width="80" align="center">
            <template #cell="{  rowIndex }">
              {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
            </template>
          </a-table-column>
          <a-table-column :title="$t('sercurity.org.index.form.name')" data-index="name" width="150" ellipsis="true" tooltip="true"></a-table-column>
          <a-table-column :title="$t('sercurity.org.index.form.code')" data-index="code" width="150" ellipsis="true" tooltip="true"></a-table-column>
          <a-table-column :title="$t('sercurity.org.index.form.type')" data-index="type" width="120">
            <template #cell="{ record }">
              {{ $t(`sercurity.org.index.form.type.${record.type}`) }}
            </template>
          </a-table-column>
          <a-table-column :title="$t('sercurity.org.index.form.seqNo')" data-index="seqNo" width="100"></a-table-column>
          <a-table-column :title="$t('sercurity.org.index.form.status')" data-index="status" width="120">
            <template #cell="{ record }">
              {{ $t(`sercurity.org.index.form.status.${record.status}`) }}
            </template>
          </a-table-column>
          <a-table-column :title="$t('sercurity.org.index.form.createAt')" data-index="createAt" width="180"></a-table-column>
          <a-table-column :title="$t('sercurity.org.index.form.operations')" data-index="operations" width="230" align="center" fixed="right">
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
  <OrgForm ref="orgFormRef"></OrgForm>
</template>

<script lang="ts" setup>
import {nextTick, reactive, ref, watch} from 'vue';
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {deleteOrg, PageQueryFilter, pageQueryOrg, PageQueryRequest} from '@/api/sercurity_service'
import {columns, statusOptions, typeOptions} from '@/views/security/org/searchTable'
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import OrgForm from './form.vue';

type Column = TableColumnData & { checked?: true };
/* 列表 */
const generateFilterData = () => {
  return {id: '', name: '', code: '', status: '', type: '', createAt: []};
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
const orgFormRef = ref(null);

const fetchData = async (params: PageQueryRequest = {current: 1, pageSize: 10}) => {
  setLoading(true);
  try {
    const {data} = await pageQueryOrg(params);
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
  if (orgFormRef.value) {
    orgFormRef.value?.openForm('add', null, reset);
  }
};
const viewTable = (id: string) => {
  if (orgFormRef.value) {
    orgFormRef.value?.openForm('view', id);
  }
}
const editTable = (id: string) => {
  if (orgFormRef.value) {
    orgFormRef.value?.openForm('edit', id, reset);
  }
}
const deleteTable = (id: string) => {
  deleteData(id, function () {
    reset();
  });
}
const deleteData = async (id: string, successBack: any) => {
  try {
    const {data} = await deleteOrg(id);
    successBack();
  } catch (err) {
    console.log(err);
  }
};
</script>

<script lang="ts">
export default {
  name: 'SearchTable'
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
