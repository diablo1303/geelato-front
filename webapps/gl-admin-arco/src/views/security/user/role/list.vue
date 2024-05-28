<script lang="ts">
export default {
  name: 'List'
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
  deleteRoleUser as deleteList,
  QueryRoleUserForm as QueryForm,
  pageQueryRoleUserOf as pageQueryList,
  QueryRoleForm,
  insertRoleUser,
  getRoleSelectOptions
} from '@/api/security';
import {enableStatusOptions, typeOptions} from "@/views/security/role/searchTable";
import RoleForm from "@/views/security/role/form.vue";
import UserSelectRoleForm from "@/views/security/user/role/form.vue";

// 页面所需参数
type PageParams = {
  orgId?: string; // 组织主键
  userId?: string; // 用户主键
  roleId?: string; // 角色主键
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
const scroll = ref({x: 1300, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  roleWeight: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  roleSeqNo: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  createAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''}
});
const lastSort = ref<string>('');
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
    roleEnableStatus: '',
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
 * 当前排序、过滤条件不变
 * @param data
 */
const deleteTable = (data: QueryForm) => {
  deleteData(data.id, (id: string) => {
    condition();
    emits('delete', data);
  });
}

/* 常用字段选择 */
const roleSelectOptions = ref<QueryRoleForm[]>([]);
const selectVisible = ref(false);
const selectAll = ref<boolean>(false);
const selectData = ref<string[]>([]);
/**
 * 选择内容与全选联动
 */
const selectChange = () => {
  let isAll = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of roleSelectOptions.value) {
    if (item.enableStatus && !selectData.value.includes(item.id)) {
      isAll = false;
    }
  }
  selectAll.value = isAll;
}
/**
 * 全选与选择项联动
 */
const selectAllChange = () => {
  if (selectAll.value === true) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of roleSelectOptions.value) {
      if (item.enableStatus && !selectData.value.includes(item.id)) {
        selectData.value.push(item.id);
      }
    }
  } else {
    selectData.value = [];
  }
}
/**
 * 添加选择的字段
 * @param ev
 */
const closeTrigger = async (ev?: MouseEvent) => {
  if (selectData.value.length > 0) {
    try {
      await insertRoleUser({
        userId: props.parameter.userId || '',
        roleId: selectData.value.join(",") || ''
      } as unknown as QueryForm);
      selectVisible.value = false;
      reset();
    } catch (err) {
      console.log(err);
    }
  } else {
    Message.warning('请至少选择一项！');
  }
}
watch(() => selectVisible, (val) => {
  if (selectVisible.value === true) {
    selectData.value = [];
    selectAll.value = false;
  }
}, {deep: true, immediate: true});

/* 表单参数 */
const formParams = ref({
  visible: false,
  isModal: true,
  title: '添加角色',
  width: '',
  height: '',
  parameter: {orgId: '', appId: '', tenantCode: ''},
  formState: 'add',
  id: '',
  formCol: 1,
});
/**
 * 列表按钮 - 新增表单
 * @param ev
 */
const addTable = (ev: MouseEvent) => {
  formParams.value = Object.assign(formParams.value, {
    id: '', visible: true, formState: 'add', parameter: props.parameter,
  });
};
const saveSuccess = async (data: Record<string, any>) => {
  const roleIds = data.roleIds || [];
  if (roleIds.length > 0) {
    try {
      await insertRoleUser({
        userId: props.parameter.userId || '',
        roleId: roleIds.join(",") || ''
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
    // 角色信息
    getRoleSelectOptions({
      order: 'weight|desc',
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }, (data: QueryRoleForm[]) => {
      roleSelectOptions.value = data || [];
    }, () => {
      roleSelectOptions.value = [];
    });
    // 页面设置
    scroll.value.y = props.height;
    basePagination.pageSize = props.pageSize;
    // 加载数据
    reset();
  }
}, {deep: true, immediate: true});
</script>

<template>
  <UserSelectRoleForm v-model:visible="formParams.visible"
                      :formCol="formParams.formCol"
                      :formState="formParams.formState"
                      :height="formParams.height"
                      :modelValue="formParams.id"
                      :parameter="formParams.parameter"
                      :title="formParams.title"
                      :width="formParams.width"
                      @saveSuccess="saveSuccess"/>

  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: labelCol }" :model="filterData" :wrapper-col-props="{ span: wrapperCol }" label-align="left">
        <a-row :gutter="wrapperCol">
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.role.index.form.name')" field="roleName">
              <a-input v-model="filterData.roleName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.role.index.form.code')" field="roleCode">
              <a-input v-model="filterData.roleCode" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.role.index.form.weight')" field="roleWeight">
              <a-input-number v-model="filterData.roleWeight" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.role.index.form.type')" field="roleType">
              <a-select v-model="filterData.roleType" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.role.index.form.enableStatus')" field="roleEnableStatus">
              <a-select v-model="filterData.roleEnableStatus" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-if="!selectVisible" :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.role.index.form.createAt')" field="createAt">
              <a-range-picker v-model="filterData.createAt" style="width: 100%"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 84px"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :size="18" direction="vertical" style="align-items: flex-end;">
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
        <a-button :disabled="formState==='view'" type="primary" status="success" @click="addTable">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
        <a-trigger v-if="false" v-model:popup-visible="selectVisible" :popup-translate="[0, -32]" position="br" trigger="click">
          <a-button :disabled="formState==='view'" status="success" :type="selectVisible?'text':'primary'">
            <template #icon>
              <icon-plus/>
            </template>
            {{ $t('searchTable.operation.create') }}
          </a-button>
          <template #content>
            <a-space style="align-items: flex-end;">
              <a-select v-model="selectData" :style="{width:'320px'}" allow-clear allow-search multiple scrollbar
                        placeholder="选择角色，关联当前用户" @change="selectChange">
                <a-option v-for="(item,index) of roleSelectOptions" :key="index"
                          :disabled="!item.enableStatus"
                          :label="`${item.weight} ${item.name} ${item.code}`"
                          :title="item.enableStatus?item.description:'已禁用，不可选'"
                          :value="item.id"/>
                <template #header>
                  <div class="check-all">
                    <a-checkbox v-model="selectAll" class="check-all-radio" @change="selectAllChange">
                      <span class="check-all-span">{{ $t('searchTable.app.operations.all') }}</span>
                    </a-checkbox>
                  </div>
                </template>
              </a-select>
              <a-button type="primary" @click="closeTrigger">
                <template #icon>
                  <icon-save/>
                </template>
                {{ $t('security.dictItem.index.popover.ok') }}
              </a-button>
            </a-space>
          </template>
        </a-trigger>
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
      <a-table-column :title="$t('security.role.index.form.index')" :width="70" align="center" data-index="index">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.role.index.form.name')" :tooltip="true" :width="180" data-index="roleName"/>
      <a-table-column :sortable="sortable.roleWeight" :title="$t('security.role.index.form.weight')" :width="90" align="center" data-index="roleWeight"/>
      <a-table-column :ellipsis="true" :title="$t('security.role.index.form.code')" :tooltip="true" :width="150" data-index="roleCode"/>
      <a-table-column :title="$t('security.role.index.form.type')" :width="120" data-index="roleType">
        <template #cell="{ record }">
          {{ $t(`security.role.index.form.type.${record.roleType}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.role.index.form.enableStatus')" :width="90" data-index="roleEnableStatus">
        <template #cell="{ record }">
          {{ $t(`security.role.index.form.enableStatus.${record.roleEnableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :sortable="sortable.roleSeqNo" :title="$t('security.role.index.form.seqNo')" :width="120" align="right" data-index="roleSeqNo"/>
      <a-table-column :sortable="sortable.createAt" :title="$t('security.role.index.form.createAt')" :width="180" data-index="createAt"/>
      <a-table-column :title="$t('security.role.index.form.operations')" :width="100" align="center" data-index="operations" fixed="right">
        <template #cell="{ record }">
          <a-popconfirm :content="$t('searchTable.columns.operations.relevance.deleteMsg')" position="tr" type="warning" @ok="deleteTable(record)">
            <a-button :disabled="formState==='view'" size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
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

.check-all {
  padding: 6px 12px;

  &-radio {
    width: 100%
  }

  &-span {
    font-weight: 600;
    color: rgb(var(--primary-6));
  }
}
</style>