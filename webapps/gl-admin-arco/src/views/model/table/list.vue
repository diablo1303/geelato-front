<template v-model="pageData">
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: 6 }" :model="filterData" :wrapper-col-props="{ span: 18 }" label-align="left">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item v-show="false">
              <a-input v-show="false" v-model="filterData.connectId"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.table.index.form.title')" field="title">
              <a-input v-model="filterData.title"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.table.index.form.entityName')" field="entityName">
              <a-input v-model="filterData.entityName"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.table.index.form.tableName')" field="tableName">
              <a-input v-model="filterData.tableName"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.table.index.form.linked')" field="linked">
              <a-select v-model="filterData.linked" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of linkedOptions" :key="item.value" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.table.index.form.tableType')" field="tableType">
              <a-select v-model="filterData.tableType" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of tableTypeOptions" :key="item.value" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.table.index.form.enableStatus')" field="enableStatus">
              <a-select v-model="filterData.enableStatus" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of enableStatusOptions" :key="item.value" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 84px"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :size="18" direction="vertical">
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
        <a-button v-show="pageData.formState==='edit'" type="primary" @click="addTable">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
        <a-button v-show="pageData.formState==='edit'" type="primary">
          <template #icon>
            <icon-sync/>
          </template>
          {{ $t('model.connect.index.model.sync.model') }}
        </a-button>
        <a-button v-show="pageData.formState==='edit'" type="primary">
          <template #icon>
            <icon-sync/>
          </template>
          {{ $t('model.connect.index.model.sync.table') }}
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
                  <a-checkbox v-model="item.checked" @change="handleChange($event, item as TableColumnData, index)"></a-checkbox>
                </div>
                <div class="title">
                  {{ item.title === '#' ? $t('model.table.index.form.index') : $t(`${item.title}`) }}
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
      <a-table-column :title="$t('model.table.index.form.index')" align="center" data-index="index" width="80">
        <template #cell="{  rowIndex }">{{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}</template>
      </a-table-column>
      <a-table-column :title="$t('model.table.index.form.title')" data-index="title" ellipsis="true" tooltip="true" width="200"/>
      <a-table-column :title="$t('model.table.index.form.entityName')" data-index="entityName" ellipsis="true" tooltip="true" width="200"/>
      <a-table-column :title="$t('model.table.index.form.tableName')" data-index="tableName" ellipsis="true" tooltip="true" width="200"/>
      <a-table-column :title="$t('model.table.index.form.tableType')" data-index="tableType" width="100">
        <template #cell="{ record }">
          {{ $t(`model.table.index.form.tableType.${record.tableType}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.table.index.form.linked')" data-index="linked" width="100">
        <template #cell="{ record }">
          {{ $t(`model.table.index.form.linked.${record.linked}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.table.index.form.enableStatus')" data-index="enableStatus" width="100">
        <template #cell="{ record }">
          {{ $t(`model.table.index.form.enableStatus.${record.enableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.table.index.form.seqNo')" data-index="seqNo" width="100"/>
      <a-table-column :title="$t('model.table.index.form.createAt')" data-index="createAt" width="180"/>
      <a-table-column :title="$t('model.table.index.form.tableComment')" data-index="tableComment" ellipsis="true" tooltip="true" width="200"/>
      <a-table-column :title="$t('model.table.index.form.description')" data-index="description" ellipsis="true" tooltip="true" width="200"/>
      <a-table-column
v-show="pageData.formState==='edit'" :title="$t('model.table.index.form.operations')"
                      align="center" data-index="operations" fixed="right" :width="170">
        <template #cell="{ record }">
          <a-button v-permission="['admin']" size="small" type="text" @click="editTable(record.id)">
            {{ $t('searchTable.columns.operations.edit') }}
          </a-button>
          <a-popconfirm :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning" @ok="deleteTable(record.id)">
            <a-button v-permission="['admin']" size="small" type="text" status="danger">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </template>
  </a-table>
  <TableForm ref="tableFormRef"></TableForm>
  <TableDrawer ref="tableDrawerRef"></TableDrawer>
</template>

<script lang="ts" setup>
/* 导入 */
import {nextTick, reactive, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
// 分页列表
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
// 引用其他对象、方法
import {ListUrlParams, PageQueryFilter, PageQueryRequest} from '@/api/service/base_service';
import {deleteTable as deleteList, pageQueryTables as pageQueryList, QueryTableForm as QueryForm} from '@/api/service/model_service';
import {columns, enableStatusOptions, linkedOptions, tableTypeOptions} from '@/views/model/table/searchTable';
// 引用其他页面
import TableForm from '@/views/model/table/form.vue';
import TableDrawer from '@/views/model/table/drawer.vue';
import {Notification} from "@arco-design/web-vue";

/* 列表 */
type Column = TableColumnData & { checked?: true };
const pageData = ref({
  current: 1, pageSize: 10, formState: 'edit', isModal: false, params: {pId: '', pName: ''},
  modalAddBack: (data: QueryForm) => {
  }, modalEditBack: (data: QueryForm) => {
  }, modalDeleteBack: (id: string) => {
  }
});
const tableFormRef = ref(null);
const tableDrawerRef = ref(null);

// 国际化
const {t} = useI18n();
// 加载
const {loading, setLoading} = useLoading(true);
// 分页列表参数
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: pageData.value.current, pageSize: pageData.value.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<PageQueryFilter[]>([]);

/* 列表 */
const generateFilterData = () => {
  return {
    id: '',
    connectId: '',
    title: '',
    tableName: '',
    entityName: '',
    tableType: '',
    enableStatus: '',
    linked: '',
    createAt: []
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
    renderData.value = data.items;
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
 * 条件查询 - 搜索
 */
const search = () => {
  fetchData({...basePagination, ...filterData.value,} as unknown as PageQueryRequest);
};
/**
 * 条件查询 - 重置
 */
const reset = () => {
  basePagination.current = pageData.value.current;
  filterData.value = generateFilterData();
  filterData.value.connectId = pageData.value.params.pId || '';
  search();
};
/**
 * 分页 - 页面跳转
 * @param current
 */
const onPageChange = (current: number) => {
  basePagination.current = current;
  search();
};

/* 列表，按钮、操作列 */
const addTable = () => {
  if (pageData.value.isModal && !pageData.value.params.pId) {
    Notification.warning(t('security.dict.index.notice.warning2'));
    return;
  }
  if (tableDrawerRef.value) {
    // @ts-ignore
    tableDrawerRef.value?.openForm({
      action: 'add', params: pageData.value.params, closeBack: (data: QueryForm) => {
        reset();
        pageData.value.modalAddBack(data);
      }
    });
  }
};
const viewTable = (id: string) => {
  if (tableDrawerRef.value) {
    // @ts-ignore
    tableDrawerRef.value?.openForm({action: 'view', 'id': id, params: pageData.value.params});
  }
}
const editTable = (id: string) => {
  if (tableDrawerRef.value) {
    // @ts-ignore
    tableDrawerRef.value?.openForm({
      action: 'edit', 'id': id, params: pageData.value.params, closeBack: (data: QueryForm) => {
        reset();
        pageData.value.modalEditBack(data);
      }
    });
  }
}

const deleteTable = (id: string) => {
  deleteData(id, () => {
    reset();
    pageData.value.modalDeleteBack(id);
  });
}
const deleteData = async (id: string, successBack: any) => {
  try {
    await deleteList(id);
    successBack();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

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

/* 对外调用方法 */
const loadList = (urlParams: ListUrlParams) => {
  // 参数设置
  pageData.value.formState = urlParams.action || 'edit';
  pageData.value.isModal = urlParams.isModal || false;
  pageData.value.params.pId = urlParams.params?.pId || '';
  pageData.value.params.pName = urlParams.params?.pName || '';
  basePagination.pageSize = urlParams.pageSize || pageData.value.pageSize;
  // 方法反馈 新增、编辑、删除
  pageData.value.modalAddBack = urlParams.modalAddBack ? urlParams.modalAddBack : pageData.value.modalAddBack;
  pageData.value.modalEditBack = urlParams.modalEditBack ? urlParams.modalEditBack : pageData.value.modalEditBack;
  pageData.value.modalDeleteBack = urlParams.modalDeleteBack ? urlParams.modalDeleteBack : pageData.value.modalDeleteBack;
  // 初始化
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

.wrapper {
  position: relative;
}
</style>
