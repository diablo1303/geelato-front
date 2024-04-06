<script lang="ts">
export default {
  name: 'RoleUserList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import {Message, TableColumnData, TableSortable} from '@arco-design/web-vue';
import {PageSizeOptions} from '@/api/base';
// 页面所需 对象、方法
import {PageQueryFilter, PageQueryRequest} from '@/api/base';
import {deleteRoleUser as deleteList, insertRoleUser, pageQueryRoleUserOf as pageQueryList, QueryRoleUserForm, QueryUserForm,} from '@/api/security';
import {enableStatusOptions, sexOptions, typeOptions} from "@/views/security/user/searchTable";
import UserChooseBox from "@/components/user-choose-box/index.vue";


// 页面所需 参数
type PageParams = {
  roleId: string;
  permissionId: string;
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue']);
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
const pagination = reactive({...basePagination, showTotal: true, showPageSize: true, pageSizeOptions: PageSizeOptions});
// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 1870, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  updateAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: 'descend'}
});
const lastSort = ref<string>('updateAt|desc');
// 列表 - 查询条件布局
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
// 列表 - 查询条件
const generateFilterData = () => {
  return {
    roleId: props.parameter.roleId || '',
    roleName: '',
    roleCode: '',
    roleType: '',
    roleWeight: '',
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
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
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
    ...basePagination, ...filterData.value, order: lastSort.value
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
 * @param id
 */
const deleteTable = (id: string) => {
  deleteData(id, (id: string) => {
    condition();
  });
}

const openUserSelect = () => {
  selectData.value = '';
  selectVisible.value = true;
}

const confirmModal = async (data: QueryUserForm[]) => {
  if (data && data.length > 0) {
    const userIds: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      if (!userIds.includes(item.id)) {
        userIds.push(item.id);
      }
    }
    try {
      await insertRoleUser({
        roleId: props.parameter.roleId,
        userId: userIds.join(',')
      } as unknown as QueryRoleUserForm);
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
            <a-form-item :label="$t('security.user.index.form.name')" field="userName">
              <a-input v-model="filterData.userName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.user.index.form.enName')" field="userEnName">
              <a-input v-model="filterData.userEnName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.user.index.form.loginName')" field="userLoginName">
              <a-input v-model="filterData.userLoginName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.user.index.form.orgName')" field="userOrgName">
              <a-input v-model="filterData.userOrgName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.user.index.form.type')" field="userType">
              <a-select v-model="filterData.userType" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.user.index.form.enableStatus')" field="userEnableStatus">
              <a-select v-model="filterData.userEnableStatus" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 136px"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :size="18" direction="vertical">
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
        <a-button :disabled="formState==='view'" status="success"
                  type="primary" @click="openUserSelect">
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
      <a-table-column :title="$t('security.user.index.form.index')" :width="70" align="center" data-index="index">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.name')" :tooltip="true" :width="120" data-index="userName"/>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.enName')" :tooltip="true" :width="120" data-index="userEnName"/>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.loginName')" :tooltip="true" :width="120" data-index="userLoginName"/>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.jobNumber')" :tooltip="true" :width="120" data-index="userJobNumber"/>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.orgName')" :tooltip="true" :width="180" data-index="userOrgName"/>
      <a-table-column :title="$t('security.user.index.form.mobilePhone')" :width="150" data-index="userMobilePhone"/>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.email')" :tooltip="true" :width="180" data-index="userEmail"/>
      <a-table-column :ellipsis="true" :title="$t('security.user.index.form.post')" :tooltip="true" :width="120" data-index="userPost"/>
      <a-table-column :title="$t('security.user.index.form.sex')" :width="90" data-index="userSex">
        <template #cell="{ record }">
          {{ $t(`security.user.index.form.sex.${record.userSex}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.user.index.form.type')" :width="120" data-index="userType">
        <template #cell="{ record }">
          {{ $t(`security.user.index.form.type.${record.userType}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.user.index.form.source')" :width="120" data-index="userSource">
        <template #cell="{ record }">
          {{ $t(`security.user.index.form.source.${record.userSource}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.user.index.form.enableStatus')" :width="90" data-index="userEnableStatus">
        <template #cell="{ record }">
          {{ $t(`security.user.index.form.enableStatus.${record.userEnableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :sortable="sortable.updateAt" :title="$t('security.user.index.form.createAt')" :width="180" data-index="updateAt"/>
      <a-table-column :title="$t('security.permission.index.form.operations')" :width="90" align="center" data-index="operations" fixed="right">
        <template #cell="{ record }">
          <a-popconfirm :content="$t('searchTable.columns.operations.relevance.deleteMsg')" position="tr" type="warning" @ok="deleteTable(record.id)">
            <a-button :disabled="formState==='view'" size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </template>
  </a-table>

  <UserChooseBox v-model:model-value="selectData"
                 v-model:visible="selectVisible"
                 :only-modal="true"
                 :parameter="props.parameter"
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
</style>