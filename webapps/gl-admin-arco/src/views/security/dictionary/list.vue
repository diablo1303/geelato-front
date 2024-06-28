<script lang="ts">
export default {
  name: 'DictionaryList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import {SelectOptionData, TableColumnData, TableSortable} from '@arco-design/web-vue';
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";
import {PageSizeOptions, PageQueryFilter, PageQueryRequest, getOptionLabel} from '@/api/base';
// 页面所需 对象、方法
import {queryAppSelectOptions} from "@/api/application";
import {
  deleteDict as deleteList,
  QueryDictForm as QueryForm,
  pageQueryDict as pageQueryList,
  exportDictAndItems,
} from '@/api/security'
import {columns, enableStatusOptions} from "@/views/security/dictionary/searchTable";
// 引入组件
import DictionaryLayout from './layout.vue';
import DictionaryForm from './form.vue';

// 页面所需 参数
type PageParams = {
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
const pagination = reactive({...basePagination, showTotal: true, showPageSize: true, pageSizeOptions: PageSizeOptions});
// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 1750, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  dictCode: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  seqNo: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  updateAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
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
    dictName: '',
    dictCode: '',
    enableStatus: '',
    createAt: [],
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
};
const filterData = ref(generateFilterData());
const appSelectOptions = ref<SelectOptionData[]>([]);

/**
 * 分页查询方法
 * {current: 1, pageSize: pagination.pageSize, order: lastSort.value}
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

/* 表单参数 */
const formParams = ref({
  visible: false,
  isModal: true,
  title: '',
  width: '',
  height: '',
  parameter: {appId: '', tenantCode: ''},
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

const layoutParams = ref({
  visible: false,
  isModal: true,
  title: '',
  width: '80%',
  height: window.innerHeight * 0.8,
  parameter: {appId: '', tenantCode: ''},
  formState: 'add',
  id: '',
  formCol: 1,
});
/**
 * 列表按钮 - 新增表单
 * @param ev
 */
/* const addTable = (ev: MouseEvent) => {
  layoutParams.value = Object.assign(layoutParams.value, {
    id: '', visible: true, formState: 'add', title: '新建数据字典',
  });
}; */
/**
 * 列表按钮 - 配置字典项
 * @param data
 */
const configTable = (data: QueryForm) => {
  layoutParams.value = Object.assign(layoutParams.value, {
    id: data.id, visible: true, formState: 'edit', title: '', parameter: {
      appId: data.appId || '', tenantCode: data.tenantCode || ''
    }
  });
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
 * @param _action
 */
const saveSuccess = (data: QueryForm, _action: string) => {
  if (_action === 'add') {
    reset();
    emits('add', data);
  } else if (_action === 'edit') {
    search();
    emits('edit', data);
  }
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 应用信息
    if (!props.parameter.appId) {
      queryAppSelectOptions({
        id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
      }, (data: SelectOptionData[]) => {
        appSelectOptions.value = data || [];
      }, () => {
        appSelectOptions.value = [];
      });
    }
    // 修改列表高度
    scroll.value.y = props.height;
    layoutParams.value.height = window.innerHeight * 0.8;
    // 修改列表查询条数
    basePagination.pageSize = props.pageSize;
    // 设置页面参数
    formParams.value.parameter = {
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
    layoutParams.value.parameter = {
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
    // 重置查询
    reset();
  }
}, {deep: true, immediate: true});
</script>

<template>
  <DictionaryForm v-model:visible="formParams.visible"
                  :formCol="formParams.formCol"
                  :formState="formParams.formState"
                  :height="formParams.height"
                  :isModal="formParams.isModal"
                  :modelValue="formParams.id"
                  :parameter="formParams.parameter"
                  :title="formParams.title"
                  :width="formParams.width"
                  @saveSuccess="saveSuccess"/>

  <DictionaryLayout v-model:visible="layoutParams.visible"
                    :formCol="layoutParams.formCol"
                    :formState="layoutParams.formState"
                    :height="layoutParams.height"
                    :isModal="layoutParams.isModal"
                    :modelValue="layoutParams.id"
                    :parameter="layoutParams.parameter"
                    :title="layoutParams.title"
                    :width="layoutParams.width"
                    @saveSuccess="saveSuccess"/>

  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: labelCol }" :model="filterData" :wrapper-col-props="{ span: wrapperCol }" label-align="left">
        <a-row :gutter="wrapperCol">
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.dict.index.form.dictName')" field="dictName">
              <a-input v-model="filterData.dictName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.dict.index.form.dictCode')" field="dictCode">
              <a-input v-model="filterData.dictCode" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.dict.index.form.enableStatus')" field="enableStatus">
              <a-select v-model="filterData.enableStatus" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-if="!parameter.appId" :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.dict.index.form.appId')" field="appId">
              <a-select v-model="filterData.appId" :options="appSelectOptions" :placeholder="$t('searchTable.form.selectDefault')" allow-search/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.dict.index.form.createAt')" field="createAt">
              <a-range-picker v-model="filterData.createAt" style="width: 100%" @clear="condition($event)" @change="condition"/>
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
        <a-button v-show="formState==='edit'" type="primary" @click="addTable($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
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
      <a-table-column :title="$t('security.dict.index.form.index')" :width="70" align="center" data-index="index" fixed="left">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.dict.index.form.dictName')" :tooltip="true" :width="180" data-index="dictName" fixed="left">
        <template #cell="{ record }">
          <CopyToClipboard v-if="record.id" :model-value="record.id" :title="$t('copy.to.clipboard.button.key.title')"/>
          {{ record.dictName }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :sortable="sortable.dictCode" :title="$t('security.dict.index.form.dictCode')" :tooltip="true" :width="180"
                      data-index="dictCode">
        <template #cell="{ record }">
          <CopyToClipboard v-if="record.dictCode" :model-value="record.dictCode"/>
          {{ record.dictCode }}
        </template>
      </a-table-column>
      <a-table-column v-if="!parameter.appId" :ellipsis="true" :title="$t('security.dict.index.form.appId')" :tooltip="true" :width="180"
                      data-index="appId">
        <template #cell="{ record }">
          {{ getOptionLabel(record.appId, appSelectOptions) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.dict.index.form.enableStatus')" :width="90" data-index="enableStatus">
        <template #cell="{ record }">
          {{ $t(`security.dict.index.form.enableStatus.${record.enableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :sortable="sortable.seqNo" :title="$t('security.dict.index.form.seqNo')" :width="120" align="right" data-index="seqNo"/>
      <a-table-column :ellipsis="true" :tooltip="true" :title="$t('security.dict.index.form.creatorName')" :width="130" data-index="creatorName"/>
      <a-table-column :ellipsis="true" :tooltip="true" :sortable="sortable.createAt" :title="$t('security.dict.index.form.createAt')" :width="180"
                      data-index="createAt"/>
      <a-table-column :ellipsis="true" :tooltip="true" :title="$t('security.dict.index.form.updaterName')" :width="130" data-index="updaterName"/>
      <a-table-column :ellipsis="true" :tooltip="true" :sortable="sortable.updateAt" :title="$t('security.dict.index.form.updateAt')" :width="180"
                      data-index="updateAt"/>
      <a-table-column :ellipsis="true" :title="$t('security.dict.index.form.dictRemark')" :tooltip="{position:'right'}" :width="240" data-index="dictRemark"/>
      <a-table-column v-show="formState==='edit'" :title="$t('security.dict.index.form.operations')" :width="260" align="center" data-index="operations"
                      fixed="right">
        <template #cell="{ record }">
          <a-button size="small" type="text" @click="exportDictAndItems(record.id)">
            {{ $t('searchTable.operation.export') }}
          </a-button>
          <a-button size="small" type="text" @click="configTable(record)">
            {{ $t('searchTable.columns.operations.config') }}
          </a-button>
          <!--          <a-button :disabled="formState==='view'" size="small" type="text" @click="editTable(record)">
                      {{ $t('searchTable.columns.operations.edit') }}
                    </a-button>-->
          <a-popconfirm :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning" @ok="deleteTable(record)">
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