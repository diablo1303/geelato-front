<script lang="ts">
export default {
  name: 'UserList'
}
</script>
<script lang="ts" setup>
import {nextTick, computed, reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import {TableColumnData, TableRowSelection, TableData, Message, SelectOptionData} from "@arco-design/web-vue";
import {QueryUserForm, securityApi} from "@geelato/gl-ui";
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
const renderData = ref<QueryUserForm[]>([]);
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
const generateFilterData = () => {
  return {
    id: '', jobNumber: '', name: '', loginName: '', enName: '', orgId: '', orgName: '', sex: '', source: '', type: ''
  };
};
const filterData = ref(generateFilterData());
const columns = computed<TableColumnData[]>(() => []);
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
  setLoading(true);
  try {
    const {data} = await securityApi.pageQueryUser(params);
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
  fetchData({...basePagination, ...filterData.value,});
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

const getSelectOptionLabel = (value: string, options: SelectOptionData[]) => {
  for (let i = 0; i < options.length; i += 1) {
    if (value == options[i].value) {
      return options[i].label;
    }
  }
  return '';
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
            <a-form-item label="名称" field="name">
              <a-input v-model="filterData.name" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="登录名" field="loginName">
              <a-input v-model="filterData.loginName" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工号" field="jobNumber">
              <a-input v-model="filterData.jobNumber" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="性别" field="sex">
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
      @select="listSelect"
      @selectAll="listSelectAll"
      @page-change="onPageChange">
    <template #columns>
      <a-table-column title="序号" :width="60" align="center" data-index="index">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" title="名称" :tooltip="true" :width="120" data-index="name"/>
      <a-table-column :ellipsis="true" title="登录名" :tooltip="true" :width="120" data-index="loginName"/>
      <a-table-column :ellipsis="true" title="工号" :tooltip="true" :width="120" data-index="jobNumber"/>
      <a-table-column :ellipsis="true" title="组织" :tooltip="true" :width="200" data-index="orgName"/>
      <a-table-column :ellipsis="true" title="电话" :tooltip="true" :width="150" data-index="mobilePhone"/>
      <a-table-column :ellipsis="true" title="邮箱" :tooltip="true" :width="200" data-index="email"/>
      <a-table-column :ellipsis="true" title="邮箱" :tooltip="true" :width="120" data-index="post"/>
      <a-table-column title="性别" :width="100" data-index="sex">
        <template #cell="{ record }">
          {{ getSelectOptionLabel(record.sex, sexOptions) }}
        </template>
      </a-table-column>
      <a-table-column title="类型" :width="120" data-index="type">
        <template #cell="{ record }">
          {{ getSelectOptionLabel(record.sex, typeOptions) }}
        </template>
      </a-table-column>
      <a-table-column title="来源" :width="120" data-index="source">
        <template #cell="{ record }">
          {{ getSelectOptionLabel(record.sex, sourceOptions) }}
        </template>
      </a-table-column>
      <a-table-column title="排序" :width="100" data-index="seqNo"/>
      <a-table-column title="创建时间" :width="180" data-index="createAt"/>
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