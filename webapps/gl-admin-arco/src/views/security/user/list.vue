<template v-model="pageData">
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: 6 }" :model="filterData" :wrapper-col-props="{ span: 18 }" label-align="left">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item v-show="false">
              <a-input v-show="false" v-model="filterData.orgId"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('security.user.index.form.name')" field="name">
              <a-input v-model="filterData.name" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('security.user.index.form.loginName')" field="name">
              <a-input v-model="filterData.loginName" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('security.user.index.form.orgName')" field="code">
              <a-input v-model="filterData.orgName" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="pageData.isModal?12:8">
                      <a-form-item :label="$t('security.user.index.form.createAt')" field="createAt">
                        <a-range-picker v-model="filterData.createAt" style="width: 100%"/>
                      </a-form-item>
                    </a-col>-->
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('security.user.index.form.sex')" field="sex">
              <a-select v-model="filterData.sex" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of sexOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('security.user.index.form.type')" field="type">
              <a-select v-model="filterData.type" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('security.user.index.form.source')" field="source">
              <a-select v-model="filterData.source" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of sourceOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
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
                  {{ item.title === '#' ? $t('security.user.index.form.index') : $t(`${item.title}`) }}
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
      :pagination="pagination"
      :scroll="scroll"
      :scrollbar="scrollbar"
      :stripe="true" column-resizable
      row-key="id" @page-change="onPageChange">
    <template #columns>
      <a-table-column :title="$t('security.user.index.form.index')" :width="80" align="center" data-index="index">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.name')" :tooltip="true" :width="120" data-index="name"/>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.loginName')" :tooltip="true" :width="120" data-index="loginName"/>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.jobNumber')" :tooltip="true" :width="120" data-index="jobNumber"/>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.orgName')" :tooltip="true" :width="200" data-index="orgName"></a-table-column>
      <a-table-column :title="$t('security.user.index.form.mobilePhone')" :width="150" data-index="mobilePhone"></a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.email')" :tooltip="true" :width="200" data-index="email"></a-table-column>
      <a-table-column :title="$t('security.user.index.form.post')" :width="120" data-index="post"></a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.address')" :tooltip="true" :width="200" data-index="address">
        <template #cell="{  record }">
          {{ record.provinceCode }} - {{ record.cityCode }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.user.index.form.sex')" :width="100" data-index="sex">
        <template #cell="{ record }">
          {{ $t(`security.user.index.form.sex.${record.sex}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.user.index.form.type')" :width="120" data-index="status">
        <template #cell="{ record }">
          {{ $t(`security.user.index.form.type.${record.type}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.user.index.form.source')" :width="120" data-index="status">
        <template #cell="{ record }">
          {{ $t(`security.user.index.form.source.${record.source}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.user.index.form.enableStatus')" :width="100" data-index="enableStatus">
        <template #cell="{ record }">
          {{ $t(`security.user.index.form.enableStatus.${record.enableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.user.index.form.seqNo')" :width="100" data-index="seqNo"></a-table-column>
      <a-table-column :title="$t('security.user.index.form.createAt')" :width="180" data-index="createAt"></a-table-column>
      <a-table-column
          :title="$t('security.user.index.form.operations')" :width="pageData.formState==='edit'?306:100" align="center" data-index="operations"
          fixed="right">
        <template #cell="{ record }">
          <a-popconfirm :content="$t('searchTable.columns.operations.resetMsg')" position="tr" type="warning" @ok="resetPwdTable(record.id)">
            <a-button v-show="pageData.formState==='edit'" size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.reset') }}
            </a-button>
          </a-popconfirm>
          <a-button size="small" type="text" @click="viewTable(record.id)">
            {{ $t('searchTable.columns.operations.view') }}
          </a-button>
          <a-button v-show="pageData.formState==='edit'" size="small" type="text" @click="editTable(record.id)">
            {{ $t('searchTable.columns.operations.edit') }}
          </a-button>
          <a-popconfirm :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning" @ok="deleteTable(record.id)">
            <a-button v-show="pageData.formState==='edit'" size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </template>
  </a-table>

  <UserTabForm ref="userTabFormRef"></UserTabForm>
  <UserDrawer ref="userDrawerRef"></UserDrawer>
  <UserForm ref="userFormRef"></UserForm>
</template>

<script lang="ts" setup>
/* 导入 */
import {nextTick, reactive, ref, watch} from 'vue';
import useLoading from '@/hooks/loading';
import type {TableColumnData} from '@arco-design/web-vue';
import {Modal} from "@arco-design/web-vue";
// 分页列表
import {Pagination} from '@/types/global';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
// 引用其他对象、方法
import {columns, sexOptions, sourceOptions, typeOptions} from '@/views/security/user/searchTable'
import {deleteUser as deleteList, FilterUserForm as FilterForm, pageQueryUser as pageQueryList, resetPassword} from '@/api/security';
import {ListUrlParams, PageQueryFilter, PageQueryRequest} from '@/api/base';
// 引用其他页面
import UserForm from '@/views/security/user/form.vue';
import UserDrawer from '@/views/security/user/drawer.vue';
import UserTabForm from '@/views/security/user/tabForm.vue';
import {useI18n} from "vue-i18n";
import {copyToClipboard} from "@/utils/strings";
import {useRoute} from "vue-router";

/* 列表 */
const route = useRoute();
type Column = TableColumnData & { checked?: true };
const pageData = ref({current: 1, pageSize: 10, formState: 'edit', isModal: false, params: {orgId: '', orgName: ''}});
const userFormRef = ref(null);
const userTabFormRef = ref(null);
const userDrawerRef = ref(null);
// 加载
const {t} = useI18n();
const {loading, setLoading} = useLoading(true);
// 分页列表参数
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: pageData.value.current, pageSize: pageData.value.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<PageQueryFilter[]>([]);
const scrollbar = ref(true);
const scroll = {x: 2000};
// 搜索条件
const generateFilterData = (): FilterForm => {
  return {
    id: '',
    jobNumber: '',
    name: '',
    loginName: '',
    enName: '',
    orgId: '',
    orgName: '',
    sex: '',
    source: '',
    type: '',
    enableStatus: '',
    createAt: [],
    tenantCode: (route.params && route.params.tenantCode as string) || '',
    cooperatingOrgId: ''
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
  filterData.value.orgId = pageData.value.params.orgId || '';
  filterData.value.orgName = pageData.value.params.orgName || '';
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
const addTable = (ev: MouseEvent) => {
  if (userDrawerRef.value) {
    // @ts-ignore
    userDrawerRef.value?.openForm({action: 'add', closeBack: reset});
  }
};
const resetPwdTable = async (id: string) => {
  try {
    const {data} = await resetPassword(id);
    // @ts-ignore
    const pwd: string = data || data.plainPassword;
    // Notification.success(t('security.dict.index.notice.success'));
    if (pwd) {
      Modal.success({
        title: t('security.user.index.form.password'),
        content: pwd,
        okText: "复制",
        onBeforeOk: (done: any) => {
          copyToClipboard(pwd, t('copy.to.clipboard.success'), t('copy.to.clipboard.fail'));
          done(true);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
}
const viewTable = (id: string) => {
  if (userDrawerRef.value) {
    // @ts-ignore
    userDrawerRef.value?.openForm({action: 'view', 'id': id, pageSize: 5, isModal: true});
  }
}
const editTable = (id: string) => {
  if (userDrawerRef.value) {
    // @ts-ignore
    userDrawerRef.value?.openForm({action: 'edit', 'id': id, pageSize: 5, isModal: true, closeBack: reset});
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
  pageData.value.params.orgId = urlParams.params?.orgId || '';
  pageData.value.params.orgName = urlParams.params?.orgName || '';
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