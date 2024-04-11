<script lang="ts">
export default {
  name: 'FileTemplateList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import {Modal, TableColumnData, TableSortable} from '@arco-design/web-vue';
import {PageSizeOptions, PageQueryFilter, PageQueryRequest, FormParams} from '@/api/base';
// 页面所需 对象、方法
import {
  deleteFileTemplate as deleteList,
  QueryFileTemplateForm as QueryForm,
  generateTemplateOrMetaFile,
  pageQueryFileTemplate as pageQueryList
} from '@/api/template';
import {columns, enableStatusOptions, fileTypeOptions, useTypeOptions} from "@/views/security/file/searchTable";
import {getValueByKeys} from "@/api/sysconfig";
import {downloadFileByBase64Data, fetchFileById} from "@/api/attachment";
import {isJSON} from "@/utils/is";
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";
import {copyToClipboard} from "@/utils/strings";
// 引入组件
import FileTemplateForm from './form.vue';

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
const scroll = ref({x: 1200, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  createAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''}
});
const lastSort = ref<string>('updateAt|desc');
// 列表 - 查询条件布局
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
// 列表 - 查询条件
const generateFilterData = () => {
  return {
    id: '',
    title: '',
    useType: '',
    fileType: '',
    fileCode: '',
    template: '',
    templateRule: '',
    enableStatus: '',
    description: '',
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

const generateFile = async (id: string, type: string) => {
  try {
    const {data} = await generateTemplateOrMetaFile(id, type);
    reset();
  } catch (err) {
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

const downloadFileFailed = (key: string, title: string) => {
  Modal.error({
    title: `${title}`, content: t('security.file.index.example.failed.content'),
    okText: `${t('security.file.index.example.failed.okText')} ${key}`,
    async onOk() {
      await copyToClipboard(`${key}`, t('copy.to.clipboard.success'), t('copy.to.clipboard.fail'));
    }
  });
}

const downloadImportOrExportExample = async (configKey: string) => {
  try {
    const {data} = await getValueByKeys(configKey);
    if (data) {
      if (isJSON(data)) {
        downloadFileByBase64Data(JSON.parse(data));
      } else {
        fetchFileById(data, () => {
          downloadFileFailed(configKey, t('security.file.index.example.file.failed'));
        });
      }
    } else {
      downloadFileFailed(configKey, t('security.file.index.example.get.failed'));
    }
  } catch (err) {
    console.log(err);
  }
}

/* 表单参数 */
const formParams = ref({
  visible: false,
  isModal: true,
  title: '',
  width: '80%',
  height: window.innerHeight * 0.8 - 64,
  parameter: {appId: '', tenantCode: ''},
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
/**
 * 列表按钮 - 删除
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
    formParams.value.height = window.innerHeight * 0.8 - 64;
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
  <FileTemplateForm v-model:visible="formParams.visible"
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
            <a-form-item :label="$t('security.file.index.form.title')" field="title">
              <a-input v-model="filterData.title" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.file.index.form.useType')" field="useType">
              <a-select v-model="filterData.useType" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of useTypeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.file.index.form.fileType')" field="fileType">
              <a-select v-model="filterData.fileType" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of fileTypeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.file.index.form.fileCode')" field="fileCode">
              <a-input v-model="filterData.fileCode" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.file.index.form.enableStatus')" field="enableStatus">
              <a-select v-model="filterData.enableStatus" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <!--          <a-col :span="(labelCol+wrapperCol)/filterCol">
                      <a-form-item :label="$t('security.file.index.form.createAt')" field="createAt">
                        <a-range-picker v-model="filterData.createAt" style="width: 100%"/>
                      </a-form-item>
                    </a-col>-->
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
        <a-tooltip :content="$t('security.file.index.example.import.tip')">
          <a-button type="outline" @click="downloadImportOrExportExample('ImportExampleTypeMeta')">
            <template #icon>
              <icon-download/>
            </template>
            {{ $t('security.file.index.example.import.text') }}
          </a-button>
        </a-tooltip>
        <a-tooltip :content="$t('security.file.index.example.export.tip')">
          <a-button type="outline" @click="downloadImportOrExportExample('ExportExampleMeta')">
            <template #icon>
              <icon-download/>
            </template>
            {{ $t('security.file.index.example.export.text') }}
          </a-button>
        </a-tooltip>
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
      <a-table-column :title="$t('security.file.index.form.index')" :width="70" align="center" data-index="index">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.file.index.form.title')" :tooltip="true" :width="240" data-index="title">
        <template #cell="{ record }">
          <CopyToClipboard v-model="record.id" :title="$t('copy.to.clipboard.button.key.title')"/>
          {{ record.title }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.file.index.form.useType')" :width="90" data-index="useType">
        <template #cell="{ record }">
          {{ record.useType ? $t(`security.file.index.form.useType.${record.useType}`) : '' }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('security.file.index.form.fileType')" :width="90" data-index="fileType">
        <template #cell="{ record }">
          {{ record.fileType ? $t(`security.file.index.form.fileType.${record.fileType}`) : '' }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('security.file.index.form.fileCode')" :tooltip="true" :width="150" data-index="fileCode"/>
      <a-table-column :title="$t('security.file.index.form.enableStatus')" :width="90" data-index="enableStatus">
        <template #cell="{ record }">
          {{ $t(`security.file.index.form.enableStatus.${record.enableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :sortable="sortable.createAt" :title="$t('security.file.index.form.createAt')" :width="180" data-index="createAt"/>
      <a-table-column :title="$t('security.file.index.form.operations')" :width="340" align="center" data-index="operations" fixed="right">
        <template #cell="{ record }">
          <a-dropdown :disabled="formState==='view'" position="br" trigger="hover">
            <a-button :disabled="formState==='view'" size="small" type="text">
              {{ $t('security.file.list.operations.generate') }}
            </a-button>
            <template #content>
              <a-doption v-if="['import'].includes(record.useType)">
                <a-button size="small" type="text" @click="generateFile(record.id,'template')">
                  {{ $t('security.file.list.operations.generate.template') }}
                </a-button>
              </a-doption>
              <a-doption v-if="['import','export'].includes(record.useType)">
                <a-button size="small" type="text" @click="generateFile(record.id,'meta')">
                  {{ $t('security.file.list.operations.generate.meta') }}
                </a-button>
              </a-doption>
            </template>
          </a-dropdown>
          <a-button size="small" type="text" @click="viewTable(record)">
            {{ $t('searchTable.columns.operations.view') }}
          </a-button>
          <a-button :disabled="formState==='view'" size="small" type="text" @click="editTable(record)">
            {{ $t('searchTable.columns.operations.edit') }}
          </a-button>
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