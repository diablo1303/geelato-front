<script lang="ts">
export default {
  name: 'ApplicationList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import {Message, TableColumnData, TableSortable} from '@arco-design/web-vue';
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";
import {PageSizeOptions, PageQueryFilter, PageQueryRequest} from '@/api/base';
// 页面所需 对象、方法
import {deleteApp as deleteList, pageQueryApps as pageQueryList, QueryAppForm as QueryForm} from '@/api/application'
import favicon from '@/assets/favicon.ico';
import {appTypeOptions, watermarkOptions} from "./searchTable";
// 引入组件
import ApplicationForm from './form.vue';

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

const router = useRouter();
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
const scroll = ref({x: 2000, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
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
    id: props.parameter?.appId || '',
    name: '',
    type: '',
    code: '',
    watermark: '',
    versionInfo: '',
    applyStatus: '',
    designStatus: '',
    createAt: [],
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

/* 表单参数 */
const formParams = ref({
  visible: false,
  isModal: true,
  title: '',
  width: '1020px',
  height: '',
  parameter: {appId: '', tenantCode: ''},
  formState: 'add',
  id: '',
  formCol: 2,
});
/* 列表，按钮、操作列 */
const enterTable = (data: QueryForm, type: string) => {
  if (data && router) {
    if (!data.id || !data.tenantCode) {
      Message.error("参数缺少，请补全数据{租户编码、应用主键}");
      return
    }
    switch (type) {
      case 'index':
        window.open(router.resolve({
          name: 'pageWrapper',
          params: {tenantCode: data.tenantCode, appId: data.id}
        }).href, "_blank");
        break;
      case 'design':
        console.log('window.location.host: ', window.location.host)
        window.open(`${window.location.protocol}//${window.location.host}/ide.html?tenantCode=${data.tenantCode}&appId=${data.id}&appName=${data.name}`, "_blank")
        break;
      case 'settings':
        console.log('window.location.host: ', window.location.host)
        window.open(`${window.location.protocol}//${window.location.host}/appSettings.html?tenantCode=${data.tenantCode}&appId=${data.id}&appName=${data.name}`, "_blank")
        break;
      case 'version':
        console.log('window.location.host: ', window.location.host)
        window.open(`${window.location.protocol}//${window.location.host}/appVersion.html?tenantCode=${data.tenantCode}&appId=${data.id}&appName=${data.name}`, "_blank")
        break;
      case 'manage':
        break;
      default:
        break;
    }
  } else {
    Message.error("导航出错，请刷新页面");
  }
}
const viewTable = (data: QueryForm) => {
  formParams.value = Object.assign(formParams.value, {
    id: data.id, visible: true, formState: 'view'
  });
}
const addTable = (ev: MouseEvent) => {
  formParams.value = Object.assign(formParams.value, {
    id: '', visible: true, formState: 'add'
  });
};
const editTable = (data: QueryForm) => {
  formParams.value = Object.assign(formParams.value, {
    id: data.id, visible: true, formState: 'edit'
  });
}
const deleteTable = (data: QueryForm) => {
  deleteData(data.id, (id: string) => {
    condition();
    emits('delete', data);
  });
}

/**
 * 表单反馈方法，保存成功
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
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
    // 加载数据
    reset();
  }
}, {deep: true, immediate: true});
</script>

<template>
  <ApplicationForm v-model:visible="formParams.visible"
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
            <a-form-item :label="$t('application.app.list.name')" field="name">
              <a-input v-model="filterData.name" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('application.app.list.code')" field="code">
              <a-input v-model="filterData.code" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('application.app.list.type')" field="type">
              <a-select v-model="filterData.type" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="(item,index) of appTypeOptions" :key="index" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('application.app.list.watermark')" field="watermark">
              <a-select v-model="filterData.watermark" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of watermarkOptions" :key="item.value as string" :label="$t(`${item.label}`)"
                          :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.dictItem.index.form.createAt')" field="createAt">
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
      <a-table-column :title="$t('application.app.list.index')" :width="70" align="center" data-index="index">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.logo')" :tooltip="true" :width="70" align="center" data-index="logo">
        <template #cell="{record}">
          <img :src="record.logo?record.logo:favicon" alt="logo" style="width: 25px;height: 25px"/>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.name')" :tooltip="true" :width="210" data-index="name">
        <template #cell="{ record }">
          <CopyToClipboard v-if="record.id" :model-value="record.id" :title="$t('copy.to.clipboard.button.key.title')"/>
          {{ record.name }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.code')" :tooltip="true" :width="180" data-index="code"/>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.type')" :tooltip="true" :width="100" data-index="type">
        <template #cell="{ record }">
          {{ record.type ? $t(`application.app.list.type.${record.type}`) : "" }}
        </template>
      </a-table-column>
      <!-- <a-table-column :ellipsis="true" :title="$t('application.app.list.versionInfo')" :tooltip="true" :width="120" data-index="versionInfo"/>-->
      <a-table-column :ellipsis="true" :title="$t('application.app.list.applyStatus')" :tooltip="true" :width="120" data-index="applyStatus">
        <template #cell="{ record }">
          {{ [0, 1].includes(record.applyStatus) ? $t(`application.app.list.status.${record.applyStatus}`) : "" }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.designStatus')" :tooltip="true" :width="120" data-index="designStatus">
        <template #cell="{ record }">
          {{ [0, 1].includes(record.designStatus) ? $t(`application.app.list.status.${record.designStatus}`) : "" }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.icon')" :tooltip="true" :width="120" data-index="icon">
        <template #cell="{record}">
          <GlIconfont :type="record.icon"/>
          {{ record.icon }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.watermark')" :tooltip="true" :width="120" data-index="watermark">
        <template #cell="{ record }">
          {{ [0, 1].includes(record.watermark) ? $t(`application.app.list.watermark.${record.watermark}`) : "" }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :sortable="sortable.seqNo" :title="$t('application.app.list.seqNo')" :tooltip="true" :width="120" align="right"
                      data-index="seqNo"/>
      <a-table-column :ellipsis="true" :sortable="sortable.createAt" :title="$t('application.app.list.createAt')" :tooltip="true" :width="180"
                      data-index="createAt"/>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.appStorage')" :tooltip="true" :width="180" data-index="appStorage">
        <template #cell="{ record }">
          <CopyToClipboard v-if="record.appStorage" :model-value="record.appStorage"/>
          {{ record.appStorage }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.description')" :tooltip="true" :width="240" data-index="description"/>
      <a-table-column :title="$t('application.app.list.operations')" :width="400" align="center" data-index="operations" fixed="right">
        <template #cell="{ record }">
          <a-button :disabled="![1].includes(record.applyStatus)" size="small" type="text" @click="enterTable(record,'index')">
            {{ $t('application.app.list.operations.enter.index') }}
          </a-button>
          <a-button :disabled="formState==='view'||![1].includes(record.designStatus)" size="small" type="text" @click="enterTable(record,'design')">
            {{ $t('application.app.list.operations.enter.design') }}
          </a-button>
          <a-button :disabled="formState==='view'" size="small" type="text" @click="enterTable(record,'settings')">
            {{ $t('application.app.list.operations.enter.settings') }}
          </a-button>
          <a-button :disabled="formState==='view'" size="small" type="text" @click="enterTable(record,'version')">
            {{ $t('application.app.list.operations.enter.version') }}
          </a-button>
          <a-button :disabled="formState==='view'" size="small" type="text" @click="editTable(record)">
            {{ $t('application.app.list.operations.edit') }}
          </a-button>
          <a-popconfirm :content="$t('application.app.list.operations.delete.popContent')" position="tr" type="warning" @ok="deleteTable(record)">
            <a-button :disabled="formState==='view'" size="small" status="danger" type="text">
              {{ $t('application.app.list.operations.delete') }}
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