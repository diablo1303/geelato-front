<script lang="ts">
export default {
  name: 'UserList'
}
</script>
<script lang="ts" setup>
import {nextTick, reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import {TableColumnData, TableRowSelection, TableData, Message} from "@arco-design/web-vue";
import {FilterUserForm as FilterForm, pageQueryUser as pageQueryList, QueryUserForm} from "@/api/security";
import {columns, sexOptions, sourceOptions, typeOptions} from "@/views/security/user/searchTable";
import {PageQueryFilter, PageQueryRequest} from "@/api/base";
import useLoading from "@/hooks/loading";
import {Pagination} from "@/types/global";
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';

const emits = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  modelValue: {type: Array<string | number>, default: []},
  orgId: {type: String, default: ''},// 组织name
  maxCount: {type: Number, default: 0},// 取值数量
  height: {type: Number, default: 420}
});

const {t} = useI18n();
const route = useRoute();
const {loading, setLoading} = useLoading(true);
// 分页列表参数
type Column = TableColumnData & { checked?: true };
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: 1, pageSize: 50};
const pagination = reactive({...basePagination,});
const renderData = ref<PageQueryFilter[]>([]);
const scrollbar = ref(true);
const scroll = {x: 2000, y: 285};
const rowSelection = ref<TableRowSelection>({
  type: 'radio',
  showCheckedAll: false,
  width: 60,
  fixed: false,
  checkStrictly: true,
  onlyCurrent: false,
  selectedRowKeys: []
});
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
    createAt: [],
    tenantCode: (route.params && route.params.tenantCode as string) || '',
    cooperatingOrgId: ''
  };
};
const filterData = ref(generateFilterData());
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
const fetchData = async (params: PageQueryRequest = basePagination) => {
  setLoading(true);
  try {
    const {data} = await pageQueryList(params);
    renderData.value = data.items;
    pagination.current = params.current;
    pagination.pageSize = basePagination.pageSize;
    pagination.total = data.total;
    setDepositData(data.items as unknown as QueryUserForm[]);
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

/* 页面操作 */
const selectedKeys = ref<(string | number)[]>([]);
/**
 * 点击行选择器时触发
 * @param rowKeys
 * @param rowKey
 * @param record
 */
const listSelect = (rowKeys: (string | number)[], rowKey: string | number, record: QueryUserForm) => {
  if (props.maxCount > 1 && rowKeys.length > props.maxCount) {
    return;
  }
  emits('change', rowKeys.includes(rowKey), [record]);
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
    Message.warning({content: t('userChooseBox.list.max.warn'), duration: 3 * 1000});
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
  // 组织变更
  reset();
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
            <a-form-item :label="$t('security.user.index.form.name')" field="name">
              <a-input v-model="filterData.name" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('security.user.index.form.loginName')" field="loginName">
              <a-input v-model="filterData.loginName" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('security.user.index.form.jobNumber')" field="jobNumber">
              <a-input v-model="filterData.jobNumber" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('security.user.index.form.sex')" field="sex">
              <a-select v-model="filterData.sex" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of sexOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value as string"/>
              </a-select>
            </a-form-item>
          </a-col>
          <!--          <a-col :span="12">
                      <a-form-item :label="$t('security.user.index.form.type')" field="type">
                        <a-select v-model="filterData.type" :placeholder="$t('searchTable.form.selectDefault')">
                          <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value as string"/>
                        </a-select>
                      </a-form-item>
                    </a-col>-->
          <!--          <a-col :span="12">
                      <a-form-item :label="$t('security.user.index.form.source')" field="source">
                        <a-select v-model="filterData.source" :placeholder="$t('searchTable.form.selectDefault')">
                          <a-option v-for="item of sourceOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value as string"/>
                        </a-select>
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
      @select="listSelect"
      @selectAll="listSelectAll"
      @page-change="onPageChange">
    <template #columns>
      <a-table-column :title="$t('security.user.index.form.index')" :width="60" align="center" data-index="index">
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
      <a-table-column :title="$t('security.user.index.form.seqNo')" :width="100" data-index="seqNo"></a-table-column>
      <a-table-column :title="$t('security.user.index.form.createAt')" :width="180" data-index="createAt"></a-table-column>
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