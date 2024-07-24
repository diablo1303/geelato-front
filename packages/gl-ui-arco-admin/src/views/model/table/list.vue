<script lang="ts">
export default {
  name: 'GlModelTableList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import type {SelectOptionData, TableColumnData, TableSortable} from '@arco-design/web-vue';
import {utils, modelApi, applicationApi} from '@geelato/gl-ui'
import type {PageQueryFilter, PageQueryRequest, FormParams, QueryAppForm, QueryTableForm} from '@geelato/gl-ui';
// 页面所需 对象、方法
import useLoading from '../../../hooks/loading';
import {type Pagination, PageSizeOptions} from '../../../types/global';
import {columns, enableStatusOptions, sourceTypeOptions, tableTypeOptions} from './searchTable';
// 引入组件
import ModelTableForm from './form.vue';

// 页面所需参数
type PageParams = {
  connectId: string; // 连接主键
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
const scroll = ref({x: 1800, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  entityName: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  seqNo: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  createAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''}
});
const lastSort = ref<string>('createAt|desc');
// 列表 - 查询条件布局
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
// 列表 - 查询条件
const generateFilterData = () => {
  return {
    id: '',
    connectId: props.parameter.connectId || '',
    title: '',
    tableName: '',
    entityName: '',
    tableType: '',
    enableStatus: '',
    linked: '',
    sourceType: '',
    createAt: [],
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
};
const filterData = ref(generateFilterData());
const appSelectOptions = ref<SelectOptionData[]>([]);

/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest) => {
  setLoading(true);
  try {
    const {data} = await modelApi.pageQueryTables(params);
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
    await modelApi.deleteTable(id);
    if (successBack && typeof successBack === 'function') successBack(id);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};
/**
 * 是否将应用所有模型同步至数据库
 */
const tableInit = async () => {
  try {
    const {data} = await modelApi.initTables(props.parameter.appId);
    reset();
    emits('add');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
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
const condition = () => {
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

/* 表单参数 */
const formParams = ref<FormParams>({
  visible: false,
  isModal: true,
  title: '',
  width: '1020px',
  height: '',
  parameter: {connectId: '', appId: '', tenantCode: ''},
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
const viewTable = (data: QueryTableForm) => {
  formParams.value = Object.assign(formParams.value, {
    id: data.id, visible: true, formState: 'view'
  });
}
/**
 * 列表按钮 - 编辑表单
 * @param data
 */
const editTable = (data: QueryTableForm) => {
  formParams.value = Object.assign(formParams.value, {
    id: data.id, visible: true, formState: 'edit'
  });
}
/**
 * 列表按钮 - 删除
 * 当前排序、过滤条件不变
 * @param data
 */
const deleteTable = (data: QueryTableForm) => {
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
const saveSuccess = (data: QueryTableForm, type: string) => {
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
    // 应用信息
    appSelectOptions.value = [];
    applicationApi.getAppSelectOptions({id: '', tenantCode: props.parameter?.tenantCode || ''},
        (data: QueryAppForm[]) => {
          if (data != null && data.length > 0) {
            // eslint-disable-next-line no-restricted-syntax
            for (const item of data) {
              appSelectOptions.value.push({'value': item.id, 'label': item.name});
            }
          }
        });
    // 页面设置
    scroll.value.y = props.height;
    basePagination.pageSize = props.pageSize;
    // 表单参数
    formParams.value.parameter = {
      connectId: props.parameter.connectId || '',
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
    // 加载数据
    reset();
  }
}, {deep: true, immediate: true});
</script>

<template>
  <ModelTableForm v-model:visible="formParams.visible"
                  :formCol="formParams.formCol"
                  :formState="formParams.formState"
                  :height="formParams.height"
                  :isModal="formParams.isModal"
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
            <a-form-item :label="$t('model.table.index.form.entityName')" field="entityName">
              <a-input v-model="filterData.entityName" allow-clear @clear="condition" @press-enter="condition"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.table.index.form.title')" field="title">
              <a-input v-model="filterData.title" allow-clear @clear="condition" @press-enter="condition"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.table.index.form.tableType')" field="tableType">
              <a-select v-model="filterData.tableType" :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @clear="condition" @change="condition">
                <a-option v-for="(item,index) of tableTypeOptions" :key="index" :disabled="item.disabled"
                          :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.table.index.form.enableStatus')" field="enableStatus">
              <a-select v-model="filterData.enableStatus"
                        :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @clear="condition" @change="condition">
                <a-option v-for="(item,index) of enableStatusOptions" :key="index"
                          :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.table.index.form.appId')" field="appId">
              <a-select v-model="filterData.appId" :options="appSelectOptions" :placeholder="$t('searchTable.form.selectDefault')"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.table.index.form.sourceType')" field="sourceType">
              <a-select v-model="filterData.sourceType" :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @clear="condition" @change="condition">
                <a-option v-for="(item,index) of sourceTypeOptions" :key="index"
                          :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 84px"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :size="18" direction="vertical" style="align-items: flex-start;">
        <a-button type="primary" @click="condition">
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
        <a-button v-if="filterCol===2" :disabled="formState==='view'" type="primary" @click="addTable($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-divider style="margin-top: 0"/>
  <a-row v-if="false" style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button v-show="formState==='edit'" type="primary" @click="addTable($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
        <a-popconfirm :content="$t('model.table.index.model.title.init.dataMsg')" position="tr" type="warning" @ok="tableInit">
          <a-button :disabled="formState==='view'||!parameter.appId" type="primary">
            <template #icon>
              <icon-sync/>
            </template>
            {{ $t('model.table.index.model.title.init.data') }}
          </a-button>
        </a-popconfirm>
      </a-space>
    </a-col>
  </a-row>
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
      <a-table-column :title="$t('model.table.index.form.index')" :width="70" align="center" data-index="index" fixed="left">
        <template #cell="{  rowIndex }">{{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}</template>
      </a-table-column>
      <a-table-column :ellipsis="true" :sortable="sortable.entityName" :title="$t('model.table.index.form.entityName')" :tooltip="true" :width="210"
                      data-index="entityName" fixed="left"/>
      <a-table-column :ellipsis="true" :title="$t('model.table.index.form.title')" :tooltip="true" :width="180" data-index="title"/>
      <a-table-column :title="$t('model.table.index.form.tableType')" :width="120" data-index="tableType">
        <template #cell="{ record }">
          {{ $t(`model.table.index.form.tableType.${record.tableType}`) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.table.index.form.appId')" :tooltip="true" :width="150" data-index="appId">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.appId, appSelectOptions) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.table.index.form.sourceType')" :tooltip="true" :width="120" data-index="sourceType">
        <template #cell="{ record }">
          {{ $t(`model.table.index.form.sourceType.${record.sourceType}`) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.table.index.form.packBusData')" :tooltip="true" :width="130" data-index="packBusData">
        <template #cell="{ record }">
          {{ $t(`model.table.index.form.packBusData.${record.packBusData}`) }}
        </template>
      </a-table-column>
      <a-table-column v-if="false" :title="$t('model.table.index.form.linked')" :width="100" data-index="linked">
        <template #cell="{ record }">
          {{ $t(`model.table.index.form.linked.${record.linked}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.table.index.form.enableStatus')" :width="90" data-index="enableStatus">
        <template #cell="{ record }">
          {{ $t(`model.table.index.form.enableStatus.${record.enableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :sortable="sortable.seqNo" :title="$t('model.table.index.form.seqNo')" :width="120" data-index="seqNo"/>
      <a-table-column :sortable="sortable.createAt" :title="$t('model.table.index.form.createAt')" :width="180" data-index="createAt"/>
      <a-table-column :ellipsis="true" :title="$t('model.table.index.form.tableComment')" :tooltip="true" :width="240" data-index="tableComment"/>
      <a-table-column :ellipsis="true" :title="$t('model.table.index.form.description')" :tooltip="true" :width="240" data-index="description"/>
      <a-table-column v-show="formState==='edit'" :title="$t('model.table.index.form.operations')" :width="180" align="center" data-index="operations"
                      fixed="right">
        <template #cell="{ record,isST = ['system'].includes(record.sourceType)}">
          <a-tooltip v-if="isST" :content="$t('searchTable.tables.operations.sourceType.warning')">
            <a-button class="button-disabled" size="small" type="text">
              {{ $t('searchTable.columns.operations.edit') }}
            </a-button>
          </a-tooltip>
          <a-button v-else :disabled="formState==='view'" size="small" type="text" @click="editTable(record)">
            {{ $t('searchTable.columns.operations.edit') }}
          </a-button>
          <a-tooltip v-if="isST" :content="$t('searchTable.tables.operations.sourceType.warning')">
            <a-button class="button-disabled" size="small" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-tooltip>
          <a-popconfirm v-else :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning"
                        @ok="deleteTable(record)">
            <a-button :disabled="formState==='view'" size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </template>
    <template #empty>
      <a-empty style="width: 48%;"/>
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