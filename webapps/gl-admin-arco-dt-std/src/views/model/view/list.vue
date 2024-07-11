<script lang="ts">
export default {
  name: 'ModelTableViewList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import {Message, TableColumnData, TableSortable} from '@arco-design/web-vue';
import {PageSizeOptions, PageQueryFilter, PageQueryRequest, FormParams} from '@/api/base';
// 页面所需 对象、方法
import {
  deleteView as deleteList,
  pageQueryViews as pageQueryList,
  QueryTableForm,
  QueryViewForm,
  QueryViewForm as QueryForm,
  releaseMetaView,
  resetDefaultView
} from '@/api/model';
import {columns, enableStatusOptions, viewTypeOptions} from './searchTable';
// 引入组件
import ModelTableViewForm from './form.vue';
import ModelTablePermissionForm from '../table/permission/form.vue';

// 页面所需参数
type PageParams = {
  connectId: string; // 数据库连接主键
  tableId: string; // 模型主键
  tableName: string; // 模型名称
  isSync: boolean; // 是否同步
  isSystem: boolean; // 是否系统表
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
const scroll = ref({x: 1200, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  viewName: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  seqNo: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  createAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''}
});
const lastSort = ref<string>('');
// 列表 - 查询条件布局
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
// 列表 - 查询条件
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

const resetDefault = async (params: QueryTableForm, successBack?: any, failBack?: any) => {
  try {
    await resetDefaultView(params);
    if (successBack && typeof successBack === 'function') successBack();
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

const releaseTableView = async (params: QueryViewForm, successBack?: any, failBack?: any) => {
  try {
    await releaseMetaView(params.viewName, params.viewConstruct);
    if (successBack && typeof successBack === 'function') successBack();
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

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

const releaseTable = (record: QueryViewForm) => {
  releaseTableView(record, () => {
    Message.success(t('model.view.index.model.info.release'));
    Message.warning({content: t('model.view.index.model.info.release.tip'), duration: 10 * 1000});
    reset();
  })
}
const resetTable = (ev?: MouseEvent) => {
  resetDefault({
    id: props.parameter.tableId, connectId: props.parameter.connectId, entityName: props.parameter.tableName
  } as unknown as QueryTableForm, function () {
    Message.success(t('model.view.index.model.info.reset'));
    reset();
  });
}

/* 表单参数 */
const formParams = ref<FormParams>({
  visible: false,
  isModal: true,
  title: '',
  width: '67%',
  height: '',
  parameter: {connectId: '', entityName: '', appId: '', tenantCode: ''},
  formState: 'add',
  id: '',
  formCol: 2,
});
/**
 * 列表按钮 - 新增表单
 * @param ev
 */
const addTable = (ev: MouseEvent) => {
  formParams.value = Object.assign(formParams.value, {
    id: '', visible: true, formState: 'add'
  });
};
/**
 * 列表按钮 - 查看表单
 * @param data
 */
const viewTable = (data: QueryForm) => {
  formParams.value = Object.assign(formParams.value, {
    id: data.id, visible: true, formState: 'view'
  });
}
/**
 * 列表按钮 - 编辑表单
 * @param data
 */
const editTable = (data: QueryForm) => {
  formParams.value = Object.assign(formParams.value, {
    id: data.id, visible: true, formState: 'edit'
  });
}
const permissionFormPage = ref({
  id: '',// 主键
  visible: false,//
  parameter: {connectId: '', object: '', type: '', appId: '', tenantCode: ''},
  formState: props.formState,//
  formCol: 1,//
  title: '视图权限',
  width: '67%',
});
const openViewPermission = (data: QueryViewForm) => {
  permissionFormPage.value.visible = true;
  permissionFormPage.value.parameter = {
    connectId: data.connectId,
    object: data.viewName, type: 'dp,mp',
    appId: data.appId, tenantCode: data.tenantCode
  };
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

/**
 * 表单反馈方法，保存成功
 * 新增：重置列表
 * 编辑：当前页数、排序、过滤条件不变
 * @param data
 * @param type
 */
const saveSuccess = (data: QueryForm, type: string) => {
  if (type === 'add') {
    reset();
    emits('add', data);
  } else if (type === 'edit') {
    search();
    emits('edit', data);
  }
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    scroll.value.y = props.height;
    basePagination.pageSize = props.pageSize;
    // 表单参数
    formParams.value.parameter = {
      connectId: props.parameter.connectId,
      entityName: props.parameter.tableName,
      appId: props.parameter?.appId || '',
      tenantCode: props.parameter?.tenantCode || '',
    };
    // 加载数据
    reset();
  }
}, {deep: true, immediate: true});
</script>

<template>
  <ModelTableViewForm v-model:visible="formParams.visible"
                      :formCol="formParams.formCol"
                      :formState="formParams.formState"
                      :height="formParams.height"
                      :isModal="formParams.isModal"
                      :modelValue="formParams.id"
                      :parameter="formParams.parameter"
                      :title="formParams.title"
                      :width="formParams.width"
                      @saveSuccess="saveSuccess"/>

  <ModelTablePermissionForm v-model:visible="permissionFormPage.visible"
                            :formCol="permissionFormPage.formCol"
                            :formState="permissionFormPage.formState"
                            :parameter="permissionFormPage.parameter"
                            :title="permissionFormPage.title"
                            :width="permissionFormPage.width"/>

  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: labelCol }" :model="filterData" :wrapper-col-props="{ span: wrapperCol }" label-align="left">
        <a-row :gutter="wrapperCol">
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.view.index.form.viewName')" field="viewName">
              <a-input v-model="filterData.viewName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.view.index.form.title')" field="title">
              <a-input v-model="filterData.title" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.view.index.form.viewType')" field="viewType">
              <a-select v-model="filterData.viewType" :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @clear="condition($event)" @change="condition">
                <a-option v-for="item of viewTypeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.view.index.form.enableStatus')" field="enableStatus">
              <a-select v-model="filterData.enableStatus" :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @clear="condition($event)" @change="condition">
                <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
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
      </a-space>
    </a-col>
  </a-row>
  <a-divider style="margin-top: 0"/>
  <a-row style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button :disabled="formState==='view'" type="primary" @click="addTable($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.operation.create') }} {{ $t('model.view.index.form.viewType.custom') }}
        </a-button>
        <a-button :disabled="formState==='view'" type="primary" @click="resetTable($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.form.reset') }} {{ $t('model.view.index.form.viewType.default') }}
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-table
      :bordered="{cell:true}"
      :columns="([] as TableColumnData[])"
      :data="renderData"
      :loading="loading"
      :pagination="pageSize>200?false:pagination"
      :scroll="scroll"
      :scrollbar="scrollbar"
      :stripe="true"
      column-resizable
      row-key="id"
      @pageChange="onPageChange" @pageSizeChange="onPageSizeChange" @sorter-change="onSorterChange">
    <template #columns>
      <a-table-column :title="$t('model.view.index.form.index')" :width="80" align="center" data-index="index" fixed="left">
        <template #cell="{  rowIndex }">{{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}</template>
      </a-table-column>
      <a-table-column :ellipsis="true" :sortable="sortable.viewName" :title="$t('model.view.index.form.viewName')" :tooltip="true" :width="200"
                      data-index="viewName" fixed="left"/>
      <a-table-column :ellipsis="true" :title="$t('model.view.index.form.title')" :tooltip="true" :width="200" data-index="title"/>
      <!-- <a-table-column :title="$t('model.view.index.form.entityName')" data-index="entityName" :ellipsis="true" :tooltip="true" :width="200"/>-->
      <a-table-column :title="$t('model.view.index.form.enableStatus')" :width="100" data-index="enableStatus">
        <template #cell="{ record }">
          {{ $t(`model.view.index.form.enableStatus.${record.enableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.view.index.form.viewType')" :width="120" data-index="viewType">
        <template #cell="{ record }">
          {{ $t(`model.view.index.form.viewType.${record.viewType}`) }}
        </template>
      </a-table-column>
      <a-table-column v-if="false" :title="$t('model.view.index.form.linked')" :width="100" data-index="linked">
        <template #cell="{ record }">
          {{ $t(`model.view.index.form.linked.${record.linked}`) }}
        </template>
      </a-table-column>
      <a-table-column :sortable="sortable.seqNo" :title="$t('model.view.index.form.seqNo')" :width="120" align="right" data-index="seqNo"/>
      <a-table-column :sortable="sortable.createAt" :title="$t('model.view.index.form.createAt')" :width="180" data-index="createAt"/>
      <a-table-column :ellipsis="true" :title="$t('model.view.index.form.description')" :tooltip="true" :width="200" data-index="description"/>
      <a-table-column v-show="formState==='edit'" :title="$t('model.view.index.form.operations')" :width="360" align="center"
                      data-index="operations" fixed="right">
        <template #cell="{ record,isDefault=record.viewType==='default'}">
          <a-button v-if="isDefault || formState==='view'" size="small" type="text" @click="viewTable(record)">
            {{ $t('searchTable.columns.operations.view') }}
          </a-button>
          <a-button v-else :disabled="formState==='view'" size="small" type="text" @click="editTable(record)">
            {{ $t('searchTable.columns.operations.edit') }}
          </a-button>
          <!--    发布      -->
          <a-tooltip v-if="parameter.isSync===false" :content="$t('model.view.index.form.operations.noRel')">
            <a-button class="button-disabled" size="small" type="text">
              {{ $t('searchTable.columns.operations.release') }}
            </a-button>
          </a-tooltip>
          <a-popconfirm v-else :content="$t('searchTable.columns.operations.releaseMsg')" position="tr" type="info" @ok="releaseTable(record)">
            <a-button :disabled="formState==='view'" size="small" type="text">
              {{ $t('searchTable.columns.operations.release') }}
            </a-button>
          </a-popconfirm>
          <!--    权限      -->
          <a-button size="small" type="text" @click="openViewPermission(record)">
            {{ $t('searchTable.columns.operations.permission') }}
          </a-button>
          <!--    删除      -->
          <a-popconfirm :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning"
                        @ok="deleteTable(record)">
            <a-button :disabled="formState==='view'" size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
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