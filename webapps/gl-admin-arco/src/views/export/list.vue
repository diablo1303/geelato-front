<template v-model="pageData">
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: 6 }" :model="filterData" :wrapper-col-props="{ span: 18 }" label-align="left">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item :label="$t('export.file.index.form.name')" field="name">
              <a-input v-model="filterData.name" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('export.file.index.form.type')" field="type">
              <a-input v-model="filterData.type" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('export.file.index.form.createAt')" field="createAt">
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
  <a-table
      :bordered="{cell:true}"
      :columns="(cloneColumns as TableColumnData[])"
      :data="renderData"
      :loading="loading"
      :pagination="pagination"
      :stripe="true"
      :style="{'height':'83%'}"
      column-resizable
      row-key="id"
      @page-change="onPageChange">
    <template #columns>
      <a-table-column :title="$t('export.file.index.form.index')" :width="80" align="center" data-index="index">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('export.file.index.form.name')" :tooltip="true" :width="150" data-index="name"/>
      <a-table-column :ellipsis="true" :title="$t('export.file.index.form.type')" :tooltip="true" :width="150" data-index="type"/>
      <a-table-column :ellipsis="true" :title="$t('export.file.index.form.size')" :tooltip="true" :width="150" data-index="size"/>
      <a-table-column :title="$t('export.file.index.form.createAt')" :width="180" data-index="createAt"></a-table-column>
      <a-table-column :title="$t('export.file.index.form.operations')" :width="230" align="center" data-index="operations" fixed="right">
        <template #cell="{ record }">
          <a-button size="small" type="text" @click="downloadFile(record.id)">
            {{ $t('export.file.index.form.operation.download') }}
          </a-button>
          <a-button v-if="['application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword'].includes(record.type)"
                    size="small" type="text" @click="downloadFile(record.id,true)">
            {{ $t('export.file.index.form.operation.pdf') }}
          </a-button>
        </template>
      </a-table-column>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
/* 导入 */
import {nextTick, reactive, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
import {useUserStore} from "@/store";
import {useRoute} from "vue-router";
import {Notification} from "@arco-design/web-vue";
// 分页列表
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
// 引用其他对象、方法
import {PageQueryFilter, PageQueryRequest} from '@/api/base';
import {exportFileList, FilterAttachmentForm, getDownloadUrlById} from "@/api/application";
import {columns} from "@/views/export/searchTable";


/* 列表 */
const route = useRoute();
const userStore = useUserStore();
type Column = TableColumnData & { checked?: true };
const pageData = ref({
  current: 1,
  pageSize: 10,
  tenantCode: (route.params && route.params.tenantCode as string) || '',
  creator: userStore.userInfo.id || '',
  formState: 'edit'
});
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
const generateFilterData = (): FilterAttachmentForm => {
  return {
    name: '',
    size: '',
    type: '',
    createAt: [],
    genre: 'exportFile',
    creator: pageData.value.creator,
    tenantCode: pageData.value.tenantCode,
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
    const {data} = await exportFileList(params);
    renderData.value = data.items;
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
const downloadFile = (id: string, isPdf?: boolean) => {
  const url = getDownloadUrlById(id, isPdf);
  if (url) {
    window.open(url, "_blank")
  } else {
    Notification.warning(t('export.file.index.form.operation.download.fail'));
  }
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

reset();
</script>

<script lang="ts">
export default {
  name: 'exportList'
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