<script lang="ts">
export default {
  name: 'UserList'
}
</script>
<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue';
import {Message, TableSortable} from "@arco-design/web-vue";
import type {TableColumnData, TableRowSelection, SelectOptionData, TableData} from "@arco-design/web-vue";
import type {QueryUserForm} from "@geelato/gl-ui";
import {securityApi, utils} from "@geelato/gl-ui";

interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
  showPageSize?: boolean;
  pageSizeOptions?: Array<number>
}

type PageParams = { appId?: string; tenantCode?: string; }

const emits = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  modelValue: {type: Array<string | number>, default: []},
  orgId: {type: String, default: ''},// 组织name
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  visible: {type: Boolean, default: false},// 控制弹窗隐显
  maxCount: {type: Number, default: 0},// 取值数量
  pageSize: {type: Number, default: 20}, // 分页数
  height: {type: Number, default: 420}
});

const loading = ref<boolean>(false);
// 分页列表参数
type Column = TableColumnData & { checked?: true };
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const renderData = ref<QueryUserForm[]>([]);
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const pagination = reactive({
  ...basePagination,
  showTotal: true,
  showPageSize: true,
  pageSizeOptions: [5, 10, 20, 50, 100, 200]
});
const scrollbar = ref(true);
const scroll = {x: 1960, y: 285};
const rowSelection = ref<TableRowSelection>({
  type: 'radio',
  showCheckedAll: false,
  width: 60,
  fixed: false,
  checkStrictly: true,
  onlyCurrent: false,
  selectedRowKeys: []
});
const sortable = ref<Record<string, TableSortable>>({
  seqNo: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  updateAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  createAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''}
});
const lastSort = ref<string>('updateAt|desc');

// 搜索条件
const generateFilterData = () => {
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
    enableStatus: '1',
    createAt: [],
    tenantCode: props.parameter?.tenantCode || '',
    cooperatingOrgId: ''
  };
};
const filterData = ref(generateFilterData());

/* 0:female 女;1:male 男 */
const sexOptions = computed<SelectOptionData[]>(() => [
  {label: "女性", value: 0,}, {label: '男性', value: 1,}
]);
/* 0:员工账号|1:系统账号|2:企业外人员 */
const typeOptions = computed<SelectOptionData[]>(() => [
  {label: '员工账号', value: 0,}, {label: '系统账号', value: 1,}, {label: '企业外人员', value: 2,}
]);
/* 0:本地用户|1:系统同步 */
const sourceOptions = computed<SelectOptionData[]>(() => [
  {label: '本地用户', value: 0,}, {label: '系统同步', value: 1,}
]);
const enableStatusOptions = computed<SelectOptionData[]>(() => [
  {label: '禁用', value: 0,}, {label: '启用', value: 1,}
]);
// 查询到的数据
const depositData = ref<QueryUserForm[]>([]);

const getDepositDataIds = () => {
  const ids: string[] = [];
  if (depositData.value && depositData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const dep of depositData.value) {
      if (dep && dep.id && !ids.includes(dep.id)) {
        ids.push(dep.id);
      }
    }
  }

  return ids;
}

const getDepositData = (keys: (string | number)[]): QueryUserForm[] => {
  const data: QueryUserForm[] = [];
  if (keys && keys.length > 0) {
    for (let i = 0; i < keys.length; i += 1) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of depositData.value) {
        if (keys[i] === item.id) {
          data.push(item);
          break;
        }
      }
    }
  }
  return data;
}

const setDepositData = (data: QueryUserForm[]) => {
  if (data && data.length > 0) {
    const ids = getDepositDataIds() || [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      if (!ids.includes(item.id)) {
        ids.push(item.id);
        depositData.value.push(item);
      }
    }
  }
}

/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: Record<string, any>) => {
  loading.value = true;
  try {
    const {data} = await securityApi.pageQueryUser(params);
    renderData.value = data.items as unknown as QueryUserForm[];
    pagination.current = params.current;
    pagination.pageSize = basePagination.pageSize;
    pagination.total = data.total;
    setDepositData(data.items as unknown as QueryUserForm[]);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
/**
 * 条件查询 - 搜索
 */
const search = (ev?: Event) => {
  fetchData({order: lastSort.value, ...basePagination, ...filterData.value,});
};
/**
 * 条件查询 - 重置
 */
const reset = (ev?: Event) => {
  basePagination.current = 1;
  filterData.value = generateFilterData();
  filterData.value.orgId = props.orgId || '';
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
/**
 * 分页 - 数据条变更
 * @param pageSize
 */
const onPageSizeChange = (pageSize: number) => {
  basePagination.current = 1;
  basePagination.pageSize = pageSize;
  search();
}
/**
 * 分页 - 排序变更
 * @param dataIndex 排序字段
 * @param direction 排序方向
 */
const onSorterChange = (dataIndex: string, direction: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(sortable.value)) {
    // @ts-ignore
    sortable.value[key].sortOrder = dataIndex === key ? direction : '';
  }
  lastSort.value = direction ? `${dataIndex}|${direction}`.replace(/end/g, '') : '';
  basePagination.current = 1;
  search();
}

/* 页面操作 */
const selectedKeys = ref<(string | number)[]>(props.modelValue);
/**
 * 点击行选择器时触发
 * @param rowKeys
 * @param rowKey
 * @param record
 */
const listSelect = (rowKeys: (string | number)[], rowKey: string | number, record: TableData) => {
  if (props.maxCount > 1 && rowKeys.length > props.maxCount) {
    return;
  }
  emits('change', rowKeys.includes(rowKey), [record]);
}
const listRowClick = (record: QueryUserForm) => {
  if (selectedKeys.value.includes(record.id)) {
    selectedKeys.value = selectedKeys.value.filter(item => item !== record.id);
  } else {
    selectedKeys.value.push(record.id);
  }
  emits('change', selectedKeys.value.includes(record.id), [record]);
}
/**
 * 点击全选选择器时触发
 * @param checked
 */
const listSelectAll = (checked: boolean) => {
  emits('change', checked, renderData.value);
}

watch(() => selectedKeys, () => {
  if (props.maxCount > 1 && selectedKeys.value.length > props.maxCount) {
    selectedKeys.value = selectedKeys.value.splice(0, props.maxCount);
    Message.warning({content: '超过最大选择量', duration: 3 * 1000});
  }
  emits("update:modelValue", selectedKeys.value);
}, {deep: true, immediate: true});

watch(() => props, () => {
  // 选中值
  selectedKeys.value = props.modelValue;
  // 可选数量
  rowSelection.value.type = props.maxCount === 1 ? 'radio' : 'checkbox';
  rowSelection.value.showCheckedAll = props.maxCount === 0;
}, {deep: true, immediate: true});

watch(() => props.orgId, () => {
  if (props.visible === true) reset();
}, {deep: true, immediate: true});
</script>
<template>
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: 6 }" :model="filterData" :wrapper-col-props="{ span: 18 }" label-align="left">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item v-show="false">
              <a-input v-show="false" v-model="filterData.orgId"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="name" label="名称">
              <a-input v-model="filterData.name" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="loginName" label="登录名">
              <a-input v-model="filterData.loginName" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="jobNumber" label="工号">
              <a-input v-model="filterData.jobNumber" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="sex" label="性别">
              <a-select v-model="filterData.sex" placeholder="全部">
                <a-option v-for="item of sexOptions" :key="item.value as string" :label="item.label" :value="item.value"/>
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
            <GlIconfont type='gl-search'/>
          </template>
          查询
        </a-button>
        <a-button @click="reset($event)">
          <template #icon>
            <GlIconfont type='gl-reset'/>
          </template>
          重置
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-table
      v-model:selected-keys="selectedKeys"
      :bordered="{cell:true}"
      :columns="(cloneColumns as TableColumnData[])"
      :data="renderData"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :scroll="scroll"
      :scrollbar="scrollbar"
      :stripe="true"
      column-resizable
      row-key="id"
      @pageSizeChange="onPageSizeChange"
      @rowClick="listRowClick"
      @select="listSelect"
      @selectAll="listSelectAll"
      @page-change="onPageChange"
      @sorter-change="onSorterChange">
    <template #columns>
      <a-table-column :width="70" align="center" data-index="index" title="序号">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="name" title="名称"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="loginName" title="登录名"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="jobNumber" title="工号"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="80" data-index="enableStatus" title="状态">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.enableStatus, enableStatusOptions) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="orgName" title="组织"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="mobilePhone" title="电话"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="200" data-index="email" title="邮箱"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="post" title="职务"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="100" data-index="sex" title="性别">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.sex, sexOptions) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="type" title="类型">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.sex, typeOptions) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="source" title="来源">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.sex, sourceOptions) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :sortable="sortable.seqNo" :tooltip="true" :width="100" align="right" data-index="seqNo" title="排序"/>
      <a-table-column :ellipsis="true" :sortable="sortable.updateAt" :tooltip="true" :width="180" data-index="updateAt" title="更新时间"/>
      <a-table-column :ellipsis="true" :sortable="sortable.createAt" :tooltip="true" :width="180" data-index="createAt" title="创建时间"/>
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