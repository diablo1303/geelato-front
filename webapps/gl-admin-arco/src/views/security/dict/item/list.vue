<template v-model="pageData">
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: 6 }" :model="filterData" :wrapper-col-props="{ span: 18 }" label-align="left">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item v-show="false">
              <a-input v-show="false" v-model="filterData.itemName"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('security.dictItem.index.form.itemName')" field="name">
              <a-input v-model="filterData.itemName" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('security.dictItem.index.form.itemCode')" field="code">
              <a-input v-model="filterData.itemCode" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('security.dictItem.index.form.enableStatus')" field="enableStatus">
              <a-select v-model="filterData.enableStatus" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('security.dictItem.index.form.createAt')" field="createAt">
              <a-range-picker v-model="filterData.createAt" style="width: 100%"/>
            </a-form-item>
          </a-col>
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
        <a-button v-if="pageData.params.pId" type="primary" @click="exportDictItems($event)">
          <template #icon>
            <icon-export/>
          </template>
          {{ $t('searchTable.operation.export') }}
        </a-button>
      </a-space>
    </a-col>
    <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
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
                  <a-checkbox v-model="item.checked" @change="handleChange($event, item as TableColumnData, index)"></a-checkbox>
                </div>
                <div class="title">
                  {{ item.title === '#' ? $t('security.dictItem.index.form.index') : $t(`${item.title}`) }}
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
      :default-expand-all-rows="true"
      :loading="loading"
      :pagination="basePagination.pageSize>1000?false:pagination"
      :stripe="true"
      column-resizable
      row-key="id"
      @page-change="onPageChange">
    <template #columns>
      <a-table-column :title="$t('security.dictItem.index.form.index')" :width="80" align="center" data-index="index" fixed="left">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.dictItem.index.form.itemName')" :tooltip="true" :width="150" data-index="itemName" fixed="left"/>
      <a-table-column :ellipsis="true" :title="$t('security.dictItem.index.form.itemCode')" :tooltip="true" :width="140" data-index="itemCode"/>
      <a-table-column :title="$t('security.dictItem.index.form.seqNo')" :width="100" data-index="seqNo"/>
      <a-table-column :title="$t('security.dictItem.index.form.enableStatus')" :width="100" data-index="enableStatus">
        <template #cell="{ record }">
          {{ $t(`security.dictItem.index.form.enableStatus.${record.enableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.dictItem.index.form.createAt')" :width="170" data-index="createAt"/>
      <a-table-column :ellipsis="true" :title="$t('security.dictItem.index.form.itemRemark')" :tooltip="true" :width="200" data-index="itemRemark"/>
      <a-table-column
          v-show="pageData.formState==='edit'" :title="$t('security.dictItem.index.form.operations')" :width="240" align="center"
          data-index="operations" fixed="right">
        <template #cell="{ record }">
          <a-button size="small" type="text" @click="configTable(record.id)">
            {{ $t('searchTable.columns.operations.subset') }}
          </a-button>
          <!--          <a-button size="small" type="text" @click="addChildTable(record.id)">
                      {{ $t('searchTable.operation.create') }}
                    </a-button>-->
          <a-button size="small" type="text" @click="editTable(record.id)">
            {{ $t('searchTable.columns.operations.edit') }}
          </a-button>
          <a-popconfirm :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning" @ok="deleteTable(record.id)">
            <a-button size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </template>
  </a-table>
  <DictItemDrawer ref="dictItemDrawerRef"></DictItemDrawer>
  <DictItemLocker ref="dictItemLockerRef"></DictItemLocker>
</template>

<script lang="ts" setup>
/* 导入 */
import {nextTick, reactive, ref, shallowRef, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import type {TableColumnData} from '@arco-design/web-vue';
import {Notification} from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';
// 分页列表
import {Pagination} from '@/types/global';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
// 引用其他对象、方法
import {columns, enableStatusOptions} from "@/views/security/dict/item/searchTable";
import {
  deleteDictItem as deleteList,
  FilterDictItemForm as FilterForm,
  getDict,
  pageQueryDictItem as pageQueryList,
  QueryDictItemForm,
  queryDictItems
} from '@/api/security';
import {ListUrlParams, PageQueryFilter, PageQueryRequest} from '@/api/base';
// 引用其他页面
import {useRoute} from "vue-router";
import DictItemDrawer from "@/views/security/dict/item/drawer.vue";
import DictItemLocker from "@/views/security/dict/item/locker.vue";
import {exportWps, fetchFileById} from "@/api/attachment";

/* 列表 */
const route = useRoute();
type Column = TableColumnData & { checked?: true };
const pageData = ref({current: 1, pageSize: 10, formState: 'edit', isModal: false, params: {pId: '', pName: ''}});
const dictItemDrawerRef = ref(null);
const dictItemLockerRef = shallowRef(DictItemLocker);
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
// 搜索条件
const generateFilterData = (): FilterForm => {
  return {
    id: '', pid: '', dictId: '', itemName: '', itemCode: '', enableStatus: '', createAt: [],
    appId: (route.params && route.params.appId as string) || '',
    tenantCode: (route.params && route.params.tenantCode as string) || '',
  };
};
const filterData = ref(generateFilterData());

/**
 * tree
 * @param cForms
 * @param forms
 */
const formatTree = (cForms: QueryDictItemForm[], forms: QueryDictItemForm[]) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const cItem of cForms) {
    cItem.children = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of forms) {
      if (cItem.id === item.pid) {
        cItem.children.push(item);
      }
    }
    if (cItem.children && cItem.children.length > 0) {
      formatTree(cItem.children, forms);
    } else {
      delete cItem.children;
    }
  }

  return cForms;
}

const formatTree1 = (totalData: QueryDictItemForm[]) => {
  const forms: QueryDictItemForm[] = [];
  if (totalData && totalData.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of totalData) {
      if (!item.pid) {
        forms.push(item);
      }
    }
  }
  formatTree(forms, totalData);
  return forms;
}

/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest = {current: pageData.value.current, pageSize: pageData.value.pageSize}) => {
  setLoading(true);
  try {
    const {data} = await pageQueryList(params);
    // @ts-ignore
    renderData.value = formatTree1(data.items);
    pagination.current = params.current;
    pagination.pageSize = basePagination.pageSize;
    pagination.total = data.total;
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
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
  filterData.value.dictId = pageData.value.params.pId || '';
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
const configTable = (id: string) => {
  if (dictItemLockerRef.value) {
    dictItemLockerRef.value?.openForm({action: 'edit', params: {parentId: id, ...pageData.value.params}, closeBack: reset});
  }
}
const addTable = (ev: MouseEvent) => {
  if (pageData.value.isModal && !pageData.value.params.pId) {
    Notification.warning(t('security.dict.index.notice.warning2'));
    return;
  }
  if (dictItemDrawerRef.value) {
    // @ts-ignore
    dictItemDrawerRef.value?.openForm({action: 'add', params: pageData.value.params, closeBack: reset});
  }
};
const exportDictItems = async (ev?: MouseEvent) => {
  if (!pageData.value.params.pId) {
    Notification.warning(t('security.dict.index.notice.warning2'));
    return;
  }
  // {"valueMap": {}, "valueMapList": [{"dictItem": []}]}
  const exportData = {"valueMap": {}, "valueMapList": []}
  try {
    const dictData = await getDict(pageData.value.params.pId);
    // @ts-ignore
    dictData.data.enableStatus = dictData.data.enableStatus === 1 ? '启用' : '禁用';
    exportData.valueMap = dictData.data || {};
    const itemData = await queryDictItems({dictId: pageData.value.params.pId} as QueryDictItemForm);
    const dictItem: any[] = [];
    itemData.data.forEach((item: QueryDictItemForm) => {
      // @ts-ignore
      item.enableStatus = item.enableStatus === 1 ? '启用' : '禁用';
      dictItem.push(item);
    });
    // @ts-ignore
    exportData.valueMapList.push({"dictItem": dictItem});
    console.log(exportData);
    const {data} = await exportWps('data', '4942276091403440128', exportData, pageData.value.params.pName || '字典管理数据导出');
    if (data && data.id) fetchFileById(data.id);
  } catch (err) {
    console.log(err);
  }
}


const addChildTable = (id: string) => {
  if (dictItemDrawerRef.value) {
    // @ts-ignore
    dictItemDrawerRef.value?.openForm({action: 'add', params: {parentId: id, ...pageData.value.params}, closeBack: reset});
  }
}
const viewTable = (id: string) => {
  if (dictItemDrawerRef.value) {
    // @ts-ignore
    dictItemDrawerRef.value?.openForm({action: 'view', 'id': id, params: pageData.value.params});
  }
}
const editTable = (id: string) => {
  if (dictItemDrawerRef.value) {
    // @ts-ignore
    dictItemDrawerRef.value?.openForm({action: 'edit', 'id': id, params: pageData.value.params, closeBack: reset});
  }
}
const deleteTable = (id: string) => {
  deleteData(id, () => {
    reset();
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
  pageData.value.formState = urlParams.action || 'edit';
  pageData.value.isModal = urlParams.isModal || false;
  pageData.value.params.pId = urlParams.params?.pId || '';
  pageData.value.params.pName = urlParams.params?.pName || '';
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