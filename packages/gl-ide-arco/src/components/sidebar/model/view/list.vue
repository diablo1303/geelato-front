<script lang="ts">
export default {
  name: 'GlModelTableViewList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch, computed} from 'vue';
import type {TableColumnData, TableData} from '@arco-design/web-vue';
import {modelApi, useGlobal, utils} from "@geelato/gl-ui";
import type {QueryViewForm, QueryTableForm, QueryTableColumnForm, Pagination} from "@geelato/gl-ui";
import {enableStatusOptions, viewTypeOptions, linkedOptions} from './searchTable';
import GlModelTableViewForm from "./form.vue";
import GlModelTablePermissionModal from "../table/permission/modal.vue";

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
  height: {type: Number, default: 0},
  tableSync: {type: Boolean, default: false},
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
const scroll = ref({x: 2000, y: props.height});
const generateFilterData = () => {
  return {
    id: '',
    connectId: props.parameter.connectId || '',
    entityName: props.parameter.tableName || '',
    title: '',
    viewName: '',
    viewType: '',
    enableStatus: '',
    linked: '',
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
    const {data} = await modelApi.queryViews(params);
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
    await modelApi.deleteView(id);
    successBack(id);
    if (successBack && typeof successBack === 'function') successBack(id);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

const resetDefault = async (params: QueryTableForm, successBack?: any, failBack?: any) => {
  try {
    await modelApi.resetDefaultView(params);
    if (successBack && typeof successBack === 'function') successBack();
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

const releaseTableView = async (params: QueryViewForm, successBack?: any, failBack?: any) => {
  try {
    await modelApi.releaseMetaView(params.viewName, params.viewConstruct);
    if (successBack && typeof successBack === 'function') successBack();
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}
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
  if (filterData.value.connectId && filterData.value.entityName) {
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

const releaseTable = (record: QueryViewForm) => {
  releaseTableView(record, () => {
    global.$message.success({content: '发布成功！'})
    reset();
  })
}
const resetTable = (ev?: MouseEvent) => {
  resetDefault({
    id: props.parameter.tableId, connectId: props.parameter.connectId, entityName: props.parameter.tableName
  } as unknown as QueryTableForm, function () {
    global.$message.success({content: '重置成功！'})
    reset();
  });
}
/* 表单参数 */
const formPage = ref({
  id: '',// 主键
  visible: false,//
  parameter: {connectId: '', entityName: '', appId: '', tenantCode: ''},// 是否可编辑模型名称
  formState: 'add',//
  formCol: 2,//
  title: '模型视图',
  width: '67%'
});
/* 列表，按钮、操作列 */
const viewTable = (id: string) => {
  formPage.value.formState = 'view';
  formPage.value.title = '查看模型视图';
  formPage.value.id = id;
  formPage.value.visible = true;
}
const addTable = (ev?: MouseEvent) => {
  formPage.value.formState = 'add';
  formPage.value.title = '新建模型视图';
  formPage.value.id = '';
  formPage.value.visible = true;
};
const editTable = (id: string) => {
  formPage.value.formState = 'edit';
  formPage.value.title = '编辑模型视图';
  formPage.value.id = id;
  formPage.value.visible = true;
}

const permissionFormPage = ref({
  id: '',// 主键
  visible: false,//
  parameter: {connectId: '', object: '', type: '', appId: '', tenantCode: ''},
  formState: 'add',//
  formCol: 1,//
  title: '视图权限',
  width: '67%',
});
const openViewPermission = (data: QueryViewForm) => {
  permissionFormPage.value.parameter = {
    connectId: data.connectId, object: data.viewName, type: 'dp,mp', appId: data.appId, tenantCode: data.tenantCode
  };
  permissionFormPage.value.visible = true;
}

const saveSuccess = (data: QueryViewForm, type: string) => {
  reset();
}
const deleteTable = (data: QueryViewForm) => {
  deleteData(data.id, (id: string) => {
    reset();
  });
}

watch(() => props.parameter, (val) => {
  reset();
  formPage.value.parameter = {
    connectId: props.parameter.connectId,
    entityName: props.parameter.tableName,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}, {deep: true, immediate: true});

watch(() => props.height, (val) => {
  scroll.value.y = props.height;
}, {deep: true, immediate: true});
</script>

<template>
  <GlModelTableViewForm v-model:visible="formPage.visible"
                        :formCol="formPage.formCol"
                        :formState="formPage.formState"
                        :modelValue="formPage.id"
                        :parameter="formPage.parameter"
                        :title="formPage.title"
                        :width="formPage.width"
                        @saveSuccess="saveSuccess"/>

  <GlModelTablePermissionModal v-model:visible="permissionFormPage.visible"
                               :formCol="permissionFormPage.formCol"
                               :formState="permissionFormPage.formState"
                               :parameter="permissionFormPage.parameter"
                               :title="permissionFormPage.title"
                               :width="permissionFormPage.width"/>
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: 6 }" :model="filterData" :wrapper-col-props="{ span: 18 }" label-align="left">
        <a-row :gutter="16">
          <a-col :span="isModal?12:8">
            <a-form-item field="viewName" label="名称(英文)">
              <a-input v-model="filterData.viewName" allow-clear @clear="search" @press-enter="search"/>
            </a-form-item>
          </a-col>
          <a-col :span="isModal?12:8">
            <a-form-item field="title" label="名称(中文)">
              <a-input v-model="filterData.title" allow-clear @clear="search" @press-enter="search"/>
            </a-form-item>
          </a-col>
          <a-col :span="isModal?12:8">
            <a-form-item field="viewType" label="视图类型">
              <a-select v-model="filterData.viewType" :options="viewTypeOptions" placeholder="全部"/>
            </a-form-item>
          </a-col>
          <a-col :span="isModal?12:8">
            <a-form-item field="enableStatus" label="状态">
              <a-select v-model="filterData.enableStatus" :options="enableStatusOptions" placeholder="全部"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 84px"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :size="18" direction="vertical">
        <a-button type="primary" @click="search">
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
  <a-row style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button v-show="formState==='edit'" type="primary" @click="addTable">
          <template #icon>
            <gl-iconfont type="gl-plus-circle"/>
          </template>
          新建 自定义视图
        </a-button>
        <a-button v-show="formState==='edit'" type="primary" @click="resetTable">
          <template #icon>
            <gl-iconfont type="gl-reset"/>
          </template>
          重置 默认视图
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
      <a-table-column :width="80" align="center" data-index="index" fixed="left" title="序号">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="viewName" fixed="left" title="名称（英文）"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="title" title="名称（中文）"/>
      <a-table-column :width="100" data-index="enableStatus" title="状态">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.enableStatus, enableStatusOptions) }}
        </template>
      </a-table-column>
      <a-table-column :width="120" data-index="viewType" title="视图类型">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.viewType, viewTypeOptions) }}
        </template>
      </a-table-column>
      <a-table-column v-if="false" :width="100" data-index="linked" title="连接状态">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.linked, linkedOptions) }}
        </template>
      </a-table-column>
      <a-table-column :width="100" data-index="seqNo" title="排序"/>
      <a-table-column :width="180" data-index="createAt" title="创建时间"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="200" data-index="description" title="补充描述"/>
      <a-table-column v-show="formState==='edit'" :width="48*4" align="center" data-index="operations" fixed="right" title="操作">
        <template #cell="{ record,isDefault=record.viewType==='default'}">
          <a-button v-if="isDefault" size="small" type="text" @click="viewTable(record.id)">
            查看
          </a-button>
          <a-button v-else size="small" type="text" @click="editTable(record.id)">
            编辑
          </a-button>
          <!--    发布      -->
          <a-tooltip v-if="!tableSync" content="表格未同步至数据库，不能发布！">
            <a-button class="button-disabled" size="small" type="text">
              发布
            </a-button>
          </a-tooltip>
          <a-popconfirm v-else content="是否发布该条视图？" position="tr" type="info" @ok="releaseTable(record)">
            <a-button size="small" type="text">
              发布
            </a-button>
          </a-popconfirm>
          <!--    权限      -->
          <a-button size="small" type="text" @click="openViewPermission(record)">
            权限
          </a-button>
          <!--    删除      -->
          <a-popconfirm content="是否删除该条数据？" position="tr" type="warning" @ok="deleteTable(record.id)">
            <a-button size="small" status="danger" type="text">
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