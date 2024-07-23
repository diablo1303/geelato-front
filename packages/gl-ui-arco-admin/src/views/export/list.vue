<script lang="ts">
export default {
  name: 'GlExportList'
};
</script>

<script lang="ts" setup>
/* 导入 */
import {reactive, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import {Message} from '@arco-design/web-vue';
import type {TableColumnData, SelectOptionData} from '@arco-design/web-vue';
// 分页列表
import useLoading from '../../hooks/loading';
import {useUserStore} from "../../store";
// 引用其他对象、方法
import {fileApi} from '@geelato/gl-ui';
import type {PageQueryFilter, PageQueryRequest, Pagination} from '@geelato/gl-ui';
import {fileTypeOptions} from "./searchTable";


/* 列表 */
const route = useRoute();
const userStore = useUserStore();
type Column = TableColumnData & { checked?: true };
const pageData = ref({
  current: 1,
  pageSize: 10,
  tenantCode: (route.params && route.params.tenantCode as string) || '',
  creator: userStore.id || '',
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
const generateFilterData = () => {
  return {
    name: '',
    size: '',
    type: '',
    creator: pageData.value.creator,
    createAt: [],
    genre: 'exportFile',
    appId: '',
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
    const {data} = await fileApi.exportFileList(params);
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
const search = () => {
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

const getLabel = (value: string, options: SelectOptionData[]) => {
  if (value && options && options.length > 0) {
    // eslint-disable-next-line no-import-assign,no-restricted-syntax
    for (let i = 0; i < options.length; i += 1) {
      if (options[i]?.value === value) {
        return options[i]?.label || "";
      }
    }
  }
  return "";
}

/* 列表，按钮、操作列 */
const downloadFile = (id: string, isPdf?: boolean) => {
  const url = fileApi.getDownloadUrlById(id, isPdf);
  if (url) {
    window.open(url, "_blank")
  } else {
    Message.warning(t('export.file.index.form.operation.download.fail'));
  }
}

reset();
</script>

<template v-model="pageData">
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: 6 }" :model="filterData" :wrapper-col-props="{ span: 18 }" label-align="left">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item :label="$t('export.file.index.form.name')" field="name">
              <a-input v-model="filterData.name" allow-clear @clear="search" @press-enter="search"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('export.file.index.form.type')" field="type">
              <a-select v-model="filterData.type" :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @change="search" @clear="search">
                <a-option v-for="item of fileTypeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('export.file.index.form.createAt')" field="createAt">
              <a-range-picker v-model="filterData.createAt" style="width: 100%" @change="search" @clear="search"/>
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
      <a-table-column :ellipsis="true" :title="$t('export.file.index.form.type')" :tooltip="true" :width="150" data-index="type">
        <template #cell="{  record }">
          {{ getLabel(record.type, fileTypeOptions) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('export.file.index.form.size')" :tooltip="true" :width="150" data-index="size">
        <template #cell="{  record }">
          {{ record.size }} KB
        </template>
      </a-table-column>
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