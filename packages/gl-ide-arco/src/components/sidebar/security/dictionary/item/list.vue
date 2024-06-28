<script lang="ts">
export default {
  name: 'GlDictionaryEntryList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import type {TableColumnData, TableSortable} from '@arco-design/web-vue';
import {securityApi, utils} from "@geelato/gl-ui";
import type {QueryDictItemForm, Pagination, QueryDictForm} from "@geelato/gl-ui";
import {enableStatusOptions} from "../searchTable";
// 引入组件
import GlDictionaryEntryForm from './form.vue';
import GlDictionaryEntryLocker from './locker.vue';


// 页面所需 参数
type PageParams = {
  pid: string; // 父级主键
  dictId: string; // 字典主键
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'fetch', 'change', 'add', 'edit', 'delete']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'edit'}, // 页面状态
  filterCol: {type: Number, default: 3}, // 列表 - 搜索条件 - 一行显示个数
  pageSize: {type: Number, default: 10}, // 列表 - 条数
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
});

// 加载功能
const loading = ref<boolean>(false);
// 列表
const renderData = ref<QueryDictItemForm[]>([]);
// 列表 - 分页
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const pagination = reactive({
  ...basePagination, showTotal: true, showPageSize: true,
  pageSizeOptions: [5, 10, 20, 50, 100, 200]
});
// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 1200, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  itemCode: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  seqNo: {sortDirections: ['descend', 'ascend'], sorter: true, sortOrder: ''},
  createAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''}
});
const lastSort = ref<string>('seqNo|asc');
// 列表 - 查询条件布局
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
// 列表 - 查询条件
const generateFilterData = () => {
  return {
    id: '',
    pid: props.parameter.pid || '',
    dictId: props.parameter.dictId || '',
    itemName: '',
    itemCode: '',
    enableStatus: '',
    createAt: [],
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
};
const filterData = ref(generateFilterData());


/**
 * 迭代设置树的子节点
 * @param cForms
 * @param forms
 */
const treeIteration = (cForms: QueryDictItemForm[], forms: QueryDictItemForm[]) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const cItem of cForms) {
    cItem.children = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of forms) {
      if (cItem.id === item.pid) {
        cItem.children.push(item);
      }
    }
    if (cItem.children && cItem.children.length > 0) {
      treeIteration(cItem.children, forms);
    } else {
      delete cItem.children;
    }
  }

  return cForms;
}

/**
 * 设置树的根节点
 * @param totalData
 */
const setTree = (totalData: QueryDictItemForm[]) => {
  const forms: QueryDictItemForm[] = [];
  if (totalData && totalData.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of totalData) {
      if (!item.pid) {
        forms.push(item);
      }
    }
  }
  treeIteration(forms, totalData);
  return forms;
}


/**
 * 分页查询方法
 * {current: 1, pageSize: pagination.pageSize, order: lastSort.value}
 * @param params
 */
const fetchData = async (params: Record<string, any>) => {
  loading.value = true;
  try {
    const {data} = await securityApi.queryDictItems(params);
    emits('fetch', 'success', data);
    renderData.value = setTree(data);
  } catch (err) {
    emits('fetch', 'fail');
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
    await securityApi.deleteDictItem(id);
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
  parameter: {dictId: '', appId: '', tenantCode: ''},
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
    id: '', title: '新建字典项', visible: true, formState: 'add'
  });
};
/**
 * 列表按钮 - 查看表单
 * @param data
 */
const viewTable = (data: QueryDictItemForm) => {
  formParams.value = Object.assign(formParams.value, {
    id: data.id, title: '查看字典项', visible: true, formState: 'view'
  });
}

/**
 * 列表按钮 - 编辑表单
 * @param data
 */
const editTable = (data: QueryDictItemForm) => {
  formParams.value = Object.assign(formParams.value, {
    id: data.id, title: '编辑字典项', visible: true, formState: 'edit'
  });
}

/* 表单参数 */
const lockerParams = ref({
  visible: false,
  isModal: true,
  title: '编辑字典项',
  width: '78%',
  height: window.innerHeight * 0.74 - 64,
  parameter: {pid: '', dictId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  id: '',
  formCol: 2,
});
/**
 * 列表按钮 - 配置
 * @param data
 */
const configTable = (data: QueryDictItemForm) => {
  lockerParams.value = Object.assign(lockerParams.value, {
    visible: true, parameter: {
      pid: data.id, dictId: data.dictId, appId: data.appId, tenantCode: data.tenantCode
    },
  })
}
/**
 * 字典 - 配置
 * @param data
 */
const openLocker = (data: QueryDictForm) => {
  lockerParams.value = Object.assign(lockerParams.value, {
    visible: true, parameter: {
      pid: '', dictId: data.id, appId: data.appId, tenantCode: data.tenantCode
    },
  })
}
/**
 * 字典 - 新增
 * @param data
 */
const openModel = (data: QueryDictForm) => {
  formParams.value = Object.assign(formParams.value, {
    id: '', title: '新建字典项', visible: true, formState: 'add', parameter: {
      dictId: data.id, appId: data.appId, tenantCode: data.tenantCode
    },
  });
}
/**
 * 列表按钮 - 删除
 * 当前排序、过滤条件不变
 * @param data
 */
const deleteTable = (data: QueryDictItemForm) => {
  deleteData(data.id, (id: string) => {
    condition();
    emits('delete', data);
    emits('change')
  });
}

/**
 * 表单反馈方法，保存成功
 * 新增：重置列表
 * 编辑：当前页数、排序、过滤条件不变
 * @param data
 * @param _action
 */
const saveSuccess = (data: QueryDictItemForm, _action: string) => {
  if (_action === 'add') {
    reset();
    emits('add', data);
  } else if (_action === 'edit') {
    search();
    emits('edit', data);
  }
  emits('change');
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 修改列表高度
    scroll.value.y = props.height;
    // 修改列表查询条数
    basePagination.pageSize = props.pageSize;
    // 设置页面参数
    formParams.value.parameter = {
      dictId: props.parameter.dictId || '',
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
    lockerParams.value.parameter = {
      pid: props.parameter.pid || '', dictId: props.parameter.dictId || '',
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
    // 重置查询
    reset();
  }
}, {deep: true, immediate: true});

/* 提供外部调用方法 */
defineExpose({openLocker, openModel});
</script>

<template>
  <GlDictionaryEntryForm v-model:visible="formParams.visible"
                         :formCol="formParams.formCol"
                         :formState="formParams.formState"
                         :height="formParams.height"
                         :isModal="formParams.isModal"
                         :modelValue="formParams.id"
                         :parameter="formParams.parameter"
                         :title="formParams.title"
                         :width="formParams.width"
                         @saveSuccess="saveSuccess"/>

  <GlDictionaryEntryLocker v-model:visible="lockerParams.visible"
                           :formCol="lockerParams.formCol"
                           :formState="lockerParams.formState"
                           :height="lockerParams.height"
                           :isModal="lockerParams.isModal"
                           :modelValue="lockerParams.id"
                           :parameter="lockerParams.parameter"
                           :title="lockerParams.title"
                           :width="lockerParams.width"
                           @saveSuccess="saveSuccess"/>

  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: labelCol }" :model="filterData" :wrapper-col-props="{ span: wrapperCol }" label-align="left">
        <a-row :gutter="wrapperCol">
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item field="name" label="名称">
              <a-input v-model="filterData.itemName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item field="code" label="编码">
              <a-input v-model="filterData.itemCode" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item field="enableStatus" label="状态">
              <a-select v-model="filterData.enableStatus" :options="enableStatusOptions" placeholder="全部"
                        allow-clear @clear="condition" @change="conditionChange"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item field="createAt" label="创建时间">
              <a-range-picker v-model="filterData.createAt" style="width: 100%" @clear="condition($event)"/>
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
            <gl-iconfont type="gl-search"/>
          </template>
          搜索
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
  <a-row v-if="false" style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button :disabled="formState==='view'" type="primary" @click="addTable($event)">
          <template #icon>
            <gl-iconfont type="gl-plus-circle"/>
          </template>
          新建
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-table
      :bordered="{cell:true}"
      :columns="([] as TableColumnData[])"
      :data="renderData"
      :loading="loading"
      :pagination="false"
      :scroll="scroll"
      :scrollbar="scrollbar"
      :stripe="true"
      column-resizable
      row-key="id"
      @pageChange="onPageChange" @pageSizeChange="onPageSizeChange" @sorter-change="onSorterChange">
    <template #columns>
      <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="itemName" title="名称"/>
      <a-table-column :ellipsis="true" :sortable="sortable.itemCode" :tooltip="true" :width="150" data-index="itemCode"
                      title="编码"/>
      <a-table-column :width="70" data-index="enableStatus" title="状态">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.enableStatus, enableStatusOptions) }}
        </template>
      </a-table-column>
      <a-table-column :sortable="sortable.seqNo" :width="100" data-index="seqNo" title="排序"/>
      <a-table-column :sortable="sortable.createAt" :width="180" data-index="createAt" title="创建时间"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="itemRemark" title="备注"/>
      <a-table-column :width="210" align="center" data-index="operations" fixed="right" title="操作">
        <template #cell="{ record }">
          <a-tooltip content="批量配置子字典项">
            <a-button :disabled="formState==='view'" size="small" type="text" @click="configTable(record)">
              配置
            </a-button>
          </a-tooltip>
          <a-button :disabled="formState==='view'" size="small" type="text" @click="editTable(record)">
            编辑
          </a-button>
          <a-popconfirm content="是否删除该条数据？" position="tr" type="warning" @ok="deleteTable(record)">
            <a-button :disabled="formState==='view'" size="small" status="danger" type="text">
              删除
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