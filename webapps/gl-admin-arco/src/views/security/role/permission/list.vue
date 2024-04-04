<script lang="ts">
export default {
  name: 'RolePermissionList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import {TableColumnData, TableSortable} from '@arco-design/web-vue';
import {PageSizeOptions} from '@/api/base';
// 页面所需 对象、方法
import {PageQueryFilter, PageQueryRequest} from '@/api/base';
import {deleteRolePermission as deleteList, pageQueryRolePermissionOf as pageQueryList,} from '@/api/security';
import {typeOptions} from '@/views/security/permission/searchTable';

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
const scroll = ref({x: 1480, y: props.height});
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
    permissionId: props.parameter.permissionId || '',
    permissionName: '',
    permissionCode: '',
    permissionType: '',
    permissionObject: '',
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
            <a-form-item :label="$t('security.permission.index.form.name')" field="permissionName">
              <a-input v-model="filterData.permissionName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.permission.index.form.code')" field="permissionCode">
              <a-input v-model="filterData.permissionCode" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.permission.index.form.type')" field="permissionType">
              <a-select v-model="filterData.permissionType" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of typeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.permission.index.form.object')" field="permissionObject">
              <a-input v-model="filterData.permissionObject" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 84px"/>
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
      <a-table-column :title="$t('security.permission.index.form.index')" :width="70" align="center" data-index="index">
        <template #cell="{  rowIndex }">{{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}</template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.permission.index.form.name')" :tooltip="true" :width="180" data-index="permissionName"/>
      <a-table-column :ellipsis="true" :title="$t('security.permission.index.form.code')" :tooltip="true" :width="180" data-index="permissionCode"/>
      <a-table-column :title="$t('security.permission.index.form.type')" :width="120" data-index="permissionType">
        <template #cell="{ record }">
          {{ record.permissionType ? $t(`security.permission.index.form.type.${record.permissionType}`) : '' }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.permission.index.form.object')" :tooltip="true" :width="180" data-index="permissionObject"/>
      <a-table-column :ellipsis="true" :title="$t('security.permission.index.form.rule')" :tooltip="true" :width="180" data-index="permissionRule"/>
      <a-table-column :ellipsis="true" :title="$t('security.permission.index.form.description')" :tooltip="true" :width="240"
                      data-index="permissionDescription"/>
      <a-table-column :sortable="sortable.updateAt" :title="$t('security.permission.index.form.updateAt')" :width="180" data-index="updateAt"/>
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