<script lang="ts">
export default {
  name: 'UserOrgList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import {Message, TableColumnData, TableSortable} from '@arco-design/web-vue';
import {PageSizeOptions, PageQueryFilter, PageQueryRequest} from '@/api/base';
// 页面所需 对象、方法
import {
  deleteOrgUser as deleteList,
  QueryOrgUserForm as QueryForm,
  pageQueryOrgUserOf as pageQueryList,
  QueryOrgForm,
  insertOrgUser
} from '@/api/security';
import {categoryOptions, statusOptions, typeOptions} from "@/views/security/org/searchTable";
import OrgChooseBox from "@/components/org-choose-box/index.vue";

// 页面所需参数
type PageParams = {
  userId?: string; // 用户主键
  orgId?: string; // 组织主键
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'fetch', 'add', 'edit', 'delete']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'edit'}, // 页面状态
  filterCol: {type: Number, default: 3}, // 列表 - 搜索条件 - 一行显示个数
  pageSize: {type: Number, default: 10}, // 列表 - 条数
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
});

// 国际化
const {t} = useI18n();
// 加载功能
const {loading, setLoading} = useLoading(false);
// 列表
const renderData = ref<PageQueryFilter[]>([]);
// 列表 - 分页
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const pagination = reactive({
  ...basePagination, showTotal: true, showPageSize: true, pageSizeOptions: PageSizeOptions
});
// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 1350, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  orgCode: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  orgSeqNo: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  createAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''}
});
const lastSort = ref<string>('');
// 列表 - 查询条件布局
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
// 列表 - 查询条件
const generateFilterData = () => {
  return {
    orgId: props.parameter.orgId || '',
    orgName: '',
    orgCode: '',
    orgType: '',
    orgCategory: '',
    orgStatus: '',
    orgSeqNo: '',
    orgDescription: '',
    userId: props.parameter?.userId || '',
    userName: '',
    userEnName: '',
    userLoginName: '',
    userOrgId: '',
    userOrgName: '',
    userSex: '',
    userSource: '',
    userType: '',
    userPost: '',
    userEmail: '',
    userAddress: '',
    userMobilePrefix: '',
    userMobilePhone: '',
    userJobNumber: '',
    userCooperatingOrgId: '',
    userEnableStatus: '',
    userDescription: '',
    updateAt: [],
    createAt: [],
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
};
const filterData = ref(generateFilterData());
const selectData = ref<string>('');
const selectVisible = ref<boolean>(false);

/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest) => {
  setLoading(true);
  try {
    const {data} = await pageQueryList(params);
    renderData.value = data.items;
    pagination.current = params.current;
    pagination.pageSize = basePagination.pageSize;
    pagination.total = data.total;
    emits('fetch', 'success', renderData.value);
  } catch (err) {
    emits('fetch', 'fail');
  } finally {
    setLoading(false);
  }
};

/**
 * 单个数据删除接口
 * @param id
 * @param successBack
 * @param failBack
 */
const deleteData = async (id: string, successBack?: any, failBack?: any) => {
  try {
    await deleteList(id);
    if (successBack && typeof successBack === 'function') successBack(id);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 查询 - 基础
 * 排序，页数，条数，过滤
 * @param ev
 */
const search = (ev?: Event) => {
  fetchData({
    ...basePagination, ...filterData.value, order: `defaultOrg|desc${lastSort.value ? `,${lastSort.value}` : ''}`
  } as unknown as PageQueryRequest);
};
/**
 * 条件查询 - 搜索
 * 排序，页数（1），条数，过滤（√）
 * @param ev
 */
const condition = (ev?: Event) => {
  basePagination.current = 1;
  search();
}
/**
 * 条件查询 - 重置
 * 排序，页数（1），条数，过滤（×）
 */
const reset = (ev?: Event) => {
  basePagination.current = 1;
  filterData.value = generateFilterData();
  search();
};
/**
 * 分页 - 页面跳转
 * 排序，页数（current），条数，过滤
 * @param current
 */
const onPageChange = (current: number) => {
  basePagination.current = current;
  search();
};
/**
 * 分页 - 数据条变更
 * 排序，页数（current），条数（pageSize），过滤
 * @param pageSize
 */
const onPageSizeChange = (pageSize: number) => {
  basePagination.current = 1;
  basePagination.pageSize = pageSize;
  search();
}
/**
 * 分页 - 排序变更
 * 排序（dataIndex|direction），页数（1），条数，过滤
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

/**
 * 列表按钮 - 删除
 * 当前排序、过滤条件不变
 * @param data
 */
const deleteTable = (data: QueryForm) => {
  deleteData(data.id, (id: string) => {
    condition();
    emits('delete', data);
  });
}

const openOrgSelect = () => {
  selectData.value = '';
  selectVisible.value = true;
}

const confirmModal = async (data: QueryOrgForm[]) => {
  if (data && data.length > 0) {
    const orgIds: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      if (!orgIds.includes(item.id)) {
        orgIds.push(item.id);
      }
    }
    try {
      await insertOrgUser({
        userId: props.parameter.userId,
        orgId: orgIds.join(',')
      } as unknown as QueryForm);
      reset();
    } catch (err) {
      console.log(err);
    }
  } else {
    Message.warning('请至少选择一项！');
  }
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    scroll.value.y = props.height;
    basePagination.pageSize = props.pageSize;
    // 加载数据
    reset();
  }
}, {deep: true, immediate: true});
</script>

<template>
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: labelCol }" :model="filterData" :wrapper-col-props="{ span: wrapperCol }" label-align="left">
        <a-row :gutter="wrapperCol">
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.org.index.form.name')" field="orgName">
              <a-input v-model="filterData.orgName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.org.index.form.code')" field="orgCode">
              <a-input v-model="filterData.orgCode" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.org.index.form.type')" field="orgType">
              <a-select v-model="filterData.orgType" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.org.index.form.category')" field="orgCategory">
              <a-select v-model="filterData.orgCategory" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of categoryOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.org.index.form.status')" field="orgStatus">
              <a-select v-model="filterData.orgStatus" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of statusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.org.index.form.createAt')" field="createAt">
              <a-range-picker v-model="filterData.createAt" style="width: 100%"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 84px"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :size="18" direction="vertical" style="align-items: flex-start;">
        <a-button type="primary" @click="condition($event)">
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
        <a-button :disabled="formState==='view'" status="success" type="primary" @click="openOrgSelect">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-divider style="margin-top: 0"/>
  <a-table
      :bordered="{cell:true}"
      :columns="([] as TableColumnData[])"
      :data="renderData"
      :loading="loading"
      :pagination="pagination"
      :scroll="scroll"
      :scrollbar="scrollbar"
      :stripe="true"
      column-resizable
      row-key="id"
      @pageChange="onPageChange" @pageSizeChange="onPageSizeChange" @sorter-change="onSorterChange">
    <template #columns>
      <a-table-column :title="$t('security.org.index.form.index')" :width="70" align="center" data-index="index">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.org.index.form.name')" :tooltip="true" :width="210" data-index="orgName"/>
      <a-table-column :ellipsis="true" :title="$t('security.orgUser.index.form.relevance')" :tooltip="true" :width="100" data-index="defaultOrg">
        <template #cell="{ record }">
          <span v-if="record.defaultOrg===1" style="font-weight: bold;color: rgb(var(--primary-6));">{{ $t('security.orgUser.index.form.default') }}</span>
          <span v-else>{{ $t('security.orgUser.index.form.partJob') }}</span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :sortable="sortable.orgCode" :title="$t('security.org.index.form.code')" :tooltip="true" :width="150"
                      data-index="orgCode"/>
      <a-table-column :title="$t('security.org.index.form.type')" :width="120" data-index="orgType">
        <template #cell="{ record }">
          {{ record.orgType ? $t(`security.org.index.form.type.${record.orgType}`) : '' }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.org.index.form.category')" :width="90" data-index="orgCategory">
        <template #cell="{ record }">
          {{ record.orgCategory ? $t(`security.org.index.form.category.${record.orgCategory}`) : '' }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.org.index.form.status')" :width="90" data-index="orgStatus">
        <template #cell="{ record }">
          {{ $t(`security.org.index.form.status.${record.orgStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :sortable="sortable.orgSeqNo" :title="$t('security.org.index.form.seqNo')" :width="120" align="right" data-index="orgSeqNo"/>
      <a-table-column :sortable="sortable.createAt" :title="$t('security.org.index.form.createAt')" :width="180" data-index="createAt"/>
      <a-table-column :title="$t('security.org.index.form.operations')" :width="100" align="center" data-index="operations" fixed="right">
        <template #cell="{ record }">
          <a-tooltip v-if="record.defaultOrg===1" :content="$t('security.orgUser.index.form.operations.default')">
            <a-button :disabled="true" size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-tooltip>
          <a-popconfirm v-else :content="$t('searchTable.columns.operations.relevance.deleteMsg')" position="tr" type="warning" @ok="deleteTable(record)">
            <a-button :disabled="formState==='view'" size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </template>
  </a-table>

  <OrgChooseBox v-model:model-value="selectData"
                v-model:visible="selectVisible"
                :only-modal="true" :max-count="0" :has-root="false"
                @confirmModal="confirmModal"/>
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

.button-disabled {
  cursor: not-allowed;
  color: var(--color-text-3) !important;
  background-color: transparent !important;
  border: 1px solid transparent !important;
}
</style>