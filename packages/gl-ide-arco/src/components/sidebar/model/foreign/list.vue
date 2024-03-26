<script lang="ts">
export default {
  name: 'GlModelTableForeignList'
};
</script>
<script lang="ts" setup>
import {reactive, ref, watch, computed} from 'vue';
import type {TableColumnData} from '@arco-design/web-vue';
import {modelApi, utils} from "@geelato/gl-ui";
import type {QueryTableColumnForm, QueryTableForeignForm, Pagination} from "@geelato/gl-ui";
import {enableStatusOptions} from './searchTable';
import GlModelTableForeignForm from './form.vue';

type PageParams = {
  connectId: string; // 数据库连接主键
  tableId: string; // 模型主键
  tableName: string; // 模型名称
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
  height: {type: Number, default: 0}
});

// 分页列表参数
type Column = TableColumnData & { checked?: true };
const columns = computed<TableColumnData[]>(() => []);
const cloneColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<QueryTableColumnForm[]>([]);
const loading = ref<boolean>(false);
const scrollbar = ref(true);
const scroll = ref({x: 2000, y: props.height});
const generateFilterData = () => {
  return {
    id: '',
    mainTable: props.parameter.tableName || '',
    mainTableCol: '',
    foreignTable: '',
    foreignTableCol: '',
    enableStatus: '',
    createAt: [],
    appId: '',
    tenantCode: props.parameter?.tenantCode || '',
  };
};
const filterData = ref(generateFilterData());
/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: Record<string, any> = {current: 1, pageSize: props.pageSize}) => {
  loading.value = true;
  try {
    const {data} = await modelApi.queryTableForeigns(params);
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
    await modelApi.deleteTableForeign(id);
    successBack(id);
    if (successBack && typeof successBack === 'function') successBack(id);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
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
  if (filterData.value.mainTable) {
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

/* 表单参数 */
const formPage = ref({
  id: '',// 主键
  visible: false,//
  parameter: {connectId: '', mainTable: '', appId: '', tenantCode: ''},// 是否可编辑模型名称
  formState: 'add',//
  formCol: 1,//
  title: '模型外键',
  width: ''
});
/* 列表，按钮、操作列 */
const viewTable = (id: string) => {
  formPage.value.formState = 'view';
  formPage.value.title = '查看模型外键';
  formPage.value.id = id;
  formPage.value.visible = true;
}
const addTable = (ev: MouseEvent) => {
  formPage.value.formState = 'add';
  formPage.value.title = '新增模型外键';
  formPage.value.id = '';
  formPage.value.visible = true;
};
const editTable = (id: string) => {
  formPage.value.formState = 'edit';
  formPage.value.title = '编辑模型外键';
  formPage.value.id = id;
  formPage.value.visible = true;
}

const saveSuccess = (data: QueryTableForeignForm, type: string) => {
  reset();
}
const deleteTable = (data: QueryTableForeignForm) => {
  deleteData(data.id, (id: string) => {
    reset();
  });
}

watch(() => props.parameter, (val) => {
  reset();
  formPage.value.parameter = {
    connectId: props.parameter.connectId,
    mainTable: props.parameter.tableName,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}, {deep: true, immediate: true});
watch(() => props.height, (val) => {
  scroll.value.y = props.height;
}, {deep: true, immediate: true});
</script>

<template>
  <GlModelTableForeignForm v-model:visible="formPage.visible"
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
            <a-form-item field="mainTableCol" label="主表字段">
              <a-input v-model="filterData.mainTableCol" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="isModal?12:8">
            <a-form-item field="foreignTable" label="外表表名">
              <a-input v-model="filterData.foreignTable" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="isModal?12:8">
            <a-form-item field="foreignTableCol" label="外表字段">
              <a-input v-model="filterData.foreignTableCol" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="isModal?12:8">
            <a-form-item field="enableStatus" label="状态">
              <a-select v-model="filterData.enableStatus" placeholder="全部">
                <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="item.label" :value="item.value"/>
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
            <gl-iconfont type="gl-search"/>
          </template>
          查询
        </a-button>
        <a-button @click="reset($event)">
          <template #icon>
            <gl-iconfont type="gl-reset"/>
          </template>
          重置
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-divider style="margin-top: 0"/>
  <a-row style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button v-show="formState==='edit'" type="primary" @click="addTable($event)">
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
      @page-change="onPageChange">
    <template #columns>
      <a-table-column :width="80" align="center" data-index="index" title="序号">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="250" data-index="mainTable" title="主表表名"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="mainTableCol" title="主表字段"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="200" data-index="foreignTable" title="外表表名"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="foreignTableCol" title="外表字段"/>
      <a-table-column :width="100" data-index="enableStatus" title="状态">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.enableStatus, enableStatusOptions) }}
        </template>
      </a-table-column>
      <a-table-column :width="100" data-index="seqNo" title="排序"/>
      <a-table-column :width="180" data-index="createAt" title="创建时间"/>
      <a-table-column v-show="formState==='edit'" :width="50*2" align="center" data-index="operations" fixed="right" title="操作">
        <template #cell="{ record }">
          <a-button size="small" type="text" @click="editTable(record.id)">
            编辑
          </a-button>
          <a-popconfirm content="是否删除该条数据？" position="tr" type="warning" @ok="deleteTable(record.id)">
            <a-button size="small" status="danger" type="text">
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </template>
    <template #empty>
      <a-empty style="width: 78%;"/>
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