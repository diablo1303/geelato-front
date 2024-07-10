<script lang="ts">
export default {
  name: 'GlModelTableAppList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch, computed} from 'vue';
import {modelApi, useGlobal, utils} from "@geelato/gl-ui";
import type {TableColumnData, TableSortable} from '@arco-design/web-vue';
import type {Pagination, QueryAppTableForm} from "@geelato/gl-ui";
import {approvalNeedOptions, approvalStatusOptions, enableStatusOptions} from '../searchTable';
import GlModelTableAppForm from "./form.vue";

type PageParams = {
  connectId: string; // 数据库连接主键
  tableId: string; // 模型主键
  tableName: string; // 模型名称
  tableAppId: string; // 应用主键
  isSync: boolean; // 是否同步
  isSystem: boolean; // 是否系统表
  author: boolean; // 是否应用表
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'add', 'edit', 'delete']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'edit'},
  isModal: {type: Boolean, default: false},
  pageSize: {type: Number, default: 10000},
  height: {type: Number, default: 0},
});

// 分页列表参数
const global = useGlobal();
type Column = TableColumnData & { checked?: true };
const columns = computed<TableColumnData[]>(() => []);
const cloneColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);
const scrollbar = ref(true);
const scroll = ref({x: 1500, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  createAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''}
});
const lastSort = ref<string>('updateAt|desc');
const generateFilterData = () => {
  return {
    id: '',
    appId: '',
    appName: '',
    tableId: props.parameter.tableId || '',
    tableName: props.parameter.tableName || '',
    permissionName: '',
    approvalNeed: '',
    approvalStatus: '',
    enableStatus: '1',
    createAt: [],
    tenantCode: props.parameter?.tenantCode || '',
  };
};
const filterData = ref(generateFilterData());
/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: Record<string, any>) => {
  loading.value = true;
  try {
    const {data} = await modelApi.queryAppTables(params);
    renderData.value = data;
    pagination.current = params.current;
    pagination.pageSize = basePagination.pageSize;
    pagination.total = renderData.value.length;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  } finally {
    loading.value = false;
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
    await modelApi.deleteAppTable(id);
    if (successBack && typeof successBack === 'function') successBack(id);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 条件查询 - 搜索
 */
const search = (ev?: Event) => {
  fetchData({...basePagination, ...filterData.value, order: lastSort.value});
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
const conditionChange = (value: string | number | boolean | Record<string, any> | (string | number | boolean | Record<string, any>)[]) => {
  condition();
}
/**
 * 条件查询 - 重置
 */
const reset = (ev?: Event) => {
  basePagination.current = 1;
  filterData.value = generateFilterData();
  if (filterData.value.tableId && filterData.value.tableName) {
    search();
  }
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

/* 表单参数 */
const formPage = ref({
  id: '',// 主键
  visible: false,
  parameter: {author: true, tableId: '', tableName: '', tableAppId: '', appId: '', tenantCode: ''},// 是否可编辑模型名称
  formState: 'add',
  formCol: 1,
  title: '',
  width: ''
});
/* 列表，按钮、操作列 */
const viewTable = (id: string) => {
  formPage.value.formState = 'view';
  formPage.value.id = id;
  formPage.value.visible = true;
}
const addTable = (ev?: MouseEvent) => {
  formPage.value.formState = 'add';
  formPage.value.id = '';
  formPage.value.visible = true;
};
const editTable = (data: QueryAppTableForm) => {
  formPage.value.formState = ['draft'].includes(data.approvalStatus) ? 'edit' : 'view';
  formPage.value.id = data.id;
  formPage.value.visible = true;
}

const saveSuccess = (data: QueryAppTableForm, type: string) => {
  if (type === 'add') {
    reset();
    emits('add', data);
  } else if (type === 'edit') {
    search();
    emits('edit', data);
  }
}
const deleteTable = (data: QueryAppTableForm) => {
  deleteData(data.id, (id: string) => {
    condition();
    emits('delete', data);
  });
}

const approvalRecord = async (record: QueryAppTableForm, status: string) => {
  try {
    const params = {...record};
    params.approvalStatus = status;
    await modelApi.createOrUpdateAppTable(params);
    global.$message.success({content: `授权审批 -> ${status === 'agree' ? '同意' : '拒绝'}！`})
    condition();
  } catch (err) {
    condition();
  }
}

watch(() => props.parameter, (val) => {
  formPage.value.parameter = {
    tableId: props.parameter.tableId || '',
    tableName: props.parameter.tableName,
    tableAppId: props.parameter?.tableAppId || '',
    author: props.parameter?.author || false,
    appId: !!props.parameter.author ? props.parameter?.appId : '',
    tenantCode: props.parameter?.tenantCode || '',
  };
  reset();
}, {deep: true, immediate: true});

watch(() => props.height, (val) => {
  scroll.value.y = props.height;
}, {deep: true, immediate: true});
</script>

<template>
  <GlModelTableAppForm v-model:visible="formPage.visible"
                       :formCol="formPage.formCol"
                       :formState="formPage.formState"
                       :modelValue="formPage.id"
                       :parameter="formPage.parameter"
                       :title="formPage.title"
                       :width="formPage.width"
                       @saveSuccess="saveSuccess"/>

  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: 6 }" :model="filterData" :wrapper-col-props="{ span: 18 }" label-align="left">
        <a-row :gutter="16">
          <a-col :span="isModal?12:8">
            <a-form-item field="appName" label="应用名称">
              <a-input v-model="filterData.appName" allow-clear @clear="condition" @press-enter="condition"/>
            </a-form-item>
          </a-col>
          <a-col :span="isModal?12:8">
            <a-form-item field="permissionName" label="权限名称">
              <a-input v-model="filterData.permissionName" allow-clear @clear="condition" @press-enter="condition"/>
            </a-form-item>
          </a-col>
          <a-col :span="isModal?12:8">
            <a-form-item field="approvalNeed" label="是否审批">
              <a-select v-model="filterData.approvalNeed" :options="approvalNeedOptions" placeholder="全部"
                        allow-clear @clear="condition" @change="conditionChange"/>
            </a-form-item>
          </a-col>
          <a-col :span="isModal?12:8">
            <a-form-item field="approvalStatus" label="审批状态">
              <a-select v-model="filterData.approvalStatus" :options="approvalStatusOptions" placeholder="全部"
                        allow-clear @clear="condition" @change="conditionChange"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 84px"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :size="18" direction="vertical">
        <a-button type="primary" @click="condition">
          <template #icon>
            <gl-iconfont type="gl-search"/>
          </template>
          查询
        </a-button>
        <a-button @click="reset">
          <template #icon>
            <gl-iconfont type="gl-reset"/>
          </template>
          重置
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-divider style="margin-top: 0"/>
  <a-row v-if="!!parameter.author" style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button v-show="formState==='edit'" type="primary" @click="addTable">
          <template #icon>
            <gl-iconfont type="gl-plus-circle"/>
          </template>
          新建
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-table
      :key="height"
      :bordered="{cell:true}"
      :columns="(cloneColumns as TableColumnData[])"
      :data="renderData"
      :loading="loading"
      :pagination="false"
      :scroll="scroll"
      :scrollbar="scrollbar"
      :stripe="true"
      column-resizable
      row-key="id"
      @page-change="onPageChange" @sorter-change="onSorterChange">
    <template #columns>
      <a-table-column :width="70" align="center" data-index="index" fixed="left" title="序号">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :width="180" data-index="appName" fixed="left" title="应用名称"/>
      <a-table-column :width="180" data-index="tableName" title="模型名称">
        <template #cell="{ record }">
          {{ `${record.tableTitle}[${record.tableName}]` }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="300" data-index="permissionName" title="权限名称">
        <template #cell="{ record }">
          <a-space v-if="record.permissionName" direction="vertical">
            <span v-for="item of record.permissionName.split('\n\t')">{{ item }}</span>
          </a-space>
        </template>
      </a-table-column>
      <!--      <a-table-column :width="70" data-index="enableStatus" title="状态">
              <template #cell="{ record }">
                {{ utils.getOptionLabel(record.enableStatus, enableStatusOptions) }}
              </template>
            </a-table-column>-->
      <!--      <a-table-column :width="90" data-index="approvalNeed" title="是否审批">
              <template #cell="{ record }">
                {{ utils.getOptionLabel(record.approvalNeed, approvalNeedOptions) }}
              </template>
            </a-table-column>-->
      <a-table-column :width="90" data-index="approvalStatus" title="审批状态">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.approvalStatus, approvalStatusOptions) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="creatorName" title="申请人员"/>
      <a-table-column :sortable="sortable.createAt" :width="180" data-index="createAt" title="申请时间"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="210" data-index="description" title="补充描述"/>
      <a-table-column v-show="formState==='edit'" :width="230" align="center" data-index="operations" fixed="right" title="操作">
        <template #cell="{ record,isDefault=record.viewType==='default'}">
          <a-tooltip content="对该模型权限申请“同意”或“拒绝”！">
            <a-dropdown position="bottom">
              <a-button :disabled="formState==='view' || !!parameter.author" size="small" type="text">
                审批
              </a-button>
              <template #content>
                <a-doption style="color: rgb(var(--success-6));" @click="approvalRecord(record,'agree')">
                  <template #icon>
                    <gl-iconfont type="gl-check-circle"/>
                  </template>
                  同意
                </a-doption>
                <a-doption style="color: rgb(var(--warning-6));" @click="approvalRecord(record,'reject')">
                  <template #icon>
                    <gl-iconfont type="gl-close-circle"/>
                  </template>
                  拒绝
                </a-doption>
              </template>
            </a-dropdown>
          </a-tooltip>
          <a-button :disabled="formState==='view'" size="small" type="text" @click="editTable(record)">
            编辑
          </a-button>
          <!--    删除      -->
          <a-popconfirm content="是否删除该条数据？" position="tr" type="warning" @ok="deleteTable(record)">
            <a-button :disabled="formState==='view'" size="small" status="danger" type="text">
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </template>
    <template #empty>
      <a-empty style="width: 57%;"/>
    </template>
  </a-table>
</template>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

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

.wrapper {
  position: relative;
}

.button-disabled {
  cursor: not-allowed;
  color: var(--color-text-3) !important;
  background-color: transparent !important;
  border: 1px solid transparent !important;
}
</style>