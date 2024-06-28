<script lang="ts">
export default {
  name: 'ModelTableColumnList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import {FormInstance, Message, TableColumnData, TableSortable} from '@arco-design/web-vue';
import {PageSizeOptions, PageQueryFilter, PageQueryRequest, FormParams, getOptionLabel} from '@/api/base';
// 页面所需 对象、方法
import {
  ColumnSelectType,
  deleteTableColumn as deleteList,
  FilterTableColumnForm as FilterForm, getCommonFieldsOptions, getDefaultColumnNames, getTypeSelectOptions,
  insertCommonColumns,
  pageQueryTableColumns as pageQueryList, QueryTableColumnForm,
  QueryTableColumnForm as QueryForm,
  queryTableColumns,
  QueryTableForm,
  queryTables
} from '@/api/model';
import {columns, enableStatusOptions, markerOptions, nullableOptions, uniquedOptions} from './searchTable';

// 引入组件
import ModelTableColumnForm from './form.vue';

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
const scroll = ref({x: 2700, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  name: {sortDirections: ['descend', 'ascend'], sorter: true, sortOrder: ''},
  ordinalPosition: {sortDirections: ['descend', 'ascend'], sorter: true, sortOrder: ''},
  createAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''}
});
const lastSort = ref<string>('ordinalPosition|asc');
// 列表 - 查询条件布局
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
// 是否隐藏基础字段
const checked = ref<boolean>(true);
const visible = ref<boolean>(false);
// 列表 - 查询条件
const generateFilterData = () => {
  return {
    id: '',
    tableId: props.parameter.tableId || '', // 表id
    tableName: props.parameter.tableName || '', // 表名
    title: '', // 实体属性中文,中文名
    name: '', // 列名
    dataType: '', // 数据类型
    selectType: '',
    key: '', // 列键
    nullable: '', // 是否可空 YES_OR_NO
    uniqued: '',//  // 唯一约束
    enableStatus: '', // 状态
    createAt: [],
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
};
const filterData = ref(generateFilterData());
const columnSelectType = ref<ColumnSelectType[]>([]);
const defaultColumnMetas = ref<string[]>([]);

/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest) => {
  setLoading(true);
  try {
    const {data} = await pageQueryList(params);
    renderData.value = [];
    if (checked.value) {
      renderData.value = data.items.filter(item => !defaultColumnMetas.value.includes((item as unknown as QueryTableColumnForm).name));
    } else {
      renderData.value = data.items;
    }
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

const beforeChange = () => {
  checked.value = !checked.value;
  reset();
}

/* 表单参数 */
const formParams = ref<FormParams>({
  visible: false,
  isModal: true,
  title: '',
  width: '1150px',
  height: '',
  parameter: {
    connectId: '', tableId: '', tableName: '',
    isSync: false, isSystem: false,
    appId: '', tenantCode: ''
  },
  formState: 'add',
  id: '',
  formCol: 2,
});
/**
 * 列表按钮 - 新增表单
 * @param ev
 */
const addTable = (ev: MouseEvent) => {
  Object.assign(formParams.value, {
    id: '', visible: true, formState: 'add'
  });
};
/**
 * 列表按钮 - 查看表单
 * @param data
 */
const viewTable = (data: QueryForm) => {
  Object.assign(formParams.value, {
    id: data.id, visible: true, formState: 'view'
  });
}
/**
 * 列表按钮 - 编辑表单
 * @param data
 */
const editTable = (data: QueryForm) => {
  Object.assign(formParams.value, {
    id: data.id, visible: true, formState: 'edit'
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


/* 模型、字段选择 */
const entityPopover = ref(false);
const validateEntityForm = ref<FormInstance>();
const entityData = ref({tableId: '', columnIds: []});
const selectEntityOptions = ref<QueryTableForm[]>([]);
const selectEntityColumnOptions = ref<QueryTableColumnForm[]>([]);
const entityColumnSelectAll = ref<boolean>(false);
/**
 * 获取模型，启用的，当前租户
 * @param params
 */
const getSelectEntityOptions = async (params?: Record<string, any>) => {
  try {
    const {data} = await queryTables({
      ...params,
      enableStatus: 1, tableType: 'table', appId: '', tenantCode: props.parameter.tenantCode || ''
    } as unknown as PageQueryRequest);
    selectEntityOptions.value = data || [];
  } catch (err) {
    selectEntityOptions.value = [];
  }
}
/**
 * 获取模型字段，启用的，当前租户的，选中的模型
 * @param params
 */
const getSelectEntityColumnOptions = async (params?: Record<string, any>) => {
  try {
    if (entityData.value.tableId) {
      const {data} = await queryTableColumns({
        ...params,
        enableStatus: 1, tableId: entityData.value.tableId, appId: '', tenantCode: props.parameter.tenantCode || ''
      } as unknown as PageQueryRequest);
      selectEntityColumnOptions.value = [];
      data.forEach((item, index) => {
        if (!defaultColumnMetas.value.includes((item as unknown as QueryTableColumnForm).name)) {
          selectEntityColumnOptions.value.push(item);
        }
      });
    } else {
      selectEntityColumnOptions.value = [];
    }
  } catch (err) {
    selectEntityColumnOptions.value = [];
  }
}
/**
 * 模型选择变更
 * @param value
 */
const entityChange = () => {
  // 清理模型字段，
  entityData.value.columnIds = [];
  // 取消全选
  entityColumnSelectAll.value = false;
  // 重置模型字段集合
  getSelectEntityColumnOptions();
}
/**
 * 打开表单
 * @param ev
 */
const entityPopoverClick = async (ev?: MouseEvent) => {
  // 取消全选
  entityColumnSelectAll.value = false;
  // 清理选择，
  entityData.value = {tableId: "", columnIds: []};
  selectEntityColumnOptions.value = [];
  // 清理验证，
  await validateEntityForm.value?.resetFields();
  // 获取模型，
  await getSelectEntityOptions();
  // 打开表单
  entityPopover.value = true;
}
/**
 * 模型字段变更与全选的联动
 */
const entityColumnChange = () => {
  let isSelectedAll = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of selectEntityColumnOptions.value) {
    // @ts-ignore
    if (!entityData.value.columnIds.includes(item.id)) {
      isSelectedAll = false;
    }
  }
  entityColumnSelectAll.value = isSelectedAll;
}
/**
 * 全选变更与模型字段选择联动
 */
const entityColumnSelectAllChange = () => {
  if (entityColumnSelectAll.value === true) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of selectEntityColumnOptions.value) {
      // @ts-ignore
      if (!entityData.value.columnIds.includes(item.id)) {
        // @ts-ignore
        entityData.value.columnIds.push(item.id);
      }
    }
  } else {
    entityData.value.columnIds = [];
  }
}
/**
 * 点击添加按钮
 * @param ev
 */
const entitySubmitClick = async (ev?: MouseEvent) => {
  const res = await validateEntityForm.value?.validate();
  if (!res) {
    try {
      await insertCommonColumns({
        tableId: props.parameter.tableId || '',
        tableName: props.parameter.tableName || '',
        columnIds: entityData.value.columnIds.join(",") || ''
      });
      entityPopover.value = false;
      reset();
    } catch (err) {
      console.log(err);
    }
  }
}


/* 常用字段选择 */
const selectVisible = ref(false);
const commonSelectData = ref<string[]>([]);
const selectCommonOptions = ref<QueryTableColumnForm[]>([]);
const commonSelectAll = ref<boolean>(false);
/**
 * 打开常用字段选项卡
 * @param ev
 */
const openCommonColumn = (ev?: MouseEvent) => {
  commonSelectAll.value = false;
  commonSelectData.value = [];
  selectVisible.value = true;
}
/**
 * 选择内容与全选联动
 */
const commonSelectDataChange = () => {
  let isSelectedAll = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of selectCommonOptions.value) {
    if (!commonSelectData.value.includes(item.id)) {
      isSelectedAll = false;
    }
  }
  commonSelectAll.value = isSelectedAll;
}
/**
 * 全选与选择项联动
 */
const commonSelectAllChange = () => {
  if (commonSelectAll.value === true) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of selectCommonOptions.value) {
      if (!commonSelectData.value.includes(item.id)) {
        commonSelectData.value.push(item.id);
      }
    }
  } else {
    commonSelectData.value = [];
  }
}
/**
 * 添加选择的字段
 * @param ev
 */
const addCommonColumn = async (ev?: MouseEvent) => {
  if (commonSelectData.value.length > 0) {
    try {
      await insertCommonColumns({
        tableId: props.parameter.tableId || '',
        tableName: props.parameter.tableName || '',
        columnIds: commonSelectData.value.join(",") || ''
      });
      selectVisible.value = false;
      reset();
    } catch (err) {
      console.log(err);
    }
  } else {
    Message.warning(t('searchTable.columns.operations.add.warning'));
  }
}


/**
 * 显示时加载常用字段列表
 */
watch(() => selectVisible, (val) => {
  if (selectVisible.value) {
    getCommonFieldsOptions((data: QueryTableColumnForm[]) => {
      selectCommonOptions.value = data || [];
    }, () => {
      selectCommonOptions.value = [];
    });
  }
}, {deep: true, immediate: true});

watch(() => props, async (val) => {
  if (props.visible === true) {
    // 模型字段类型
    getTypeSelectOptions((data: ColumnSelectType[]) => {
      columnSelectType.value = data || [];
    }, () => {
      columnSelectType.value = [];
    });
    // 模型默认字段
    await getDefaultColumnNames((data: string[]) => {
      defaultColumnMetas.value = data || [];
    }, () => {
      defaultColumnMetas.value = [];
    });
    // 页面设置
    checked.value = true;
    scroll.value.y = props.height;
    basePagination.pageSize = props.pageSize;
    // 表单参数
    formParams.value.parameter = {
      connectId: props.parameter.connectId,
      tableId: props.parameter.tableId,
      tableName: props.parameter.tableName,
      isSync: props.parameter?.isSync === true,
      isSystem: props.parameter?.isSystem === true,
      appId: props.parameter?.appId || '',
      tenantCode: props.parameter?.tenantCode || '',
    }
    // 加载数据
    reset();
  }
}, {deep: true, immediate: true});
</script>

<template>
  <ModelTableColumnForm v-model:visible="formParams.visible"
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
            <a-form-item :label="$t('model.column.index.form.name')" field="name">
              <a-input v-model="filterData.name" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.column.index.form.title')" field="title">
              <a-input v-model="filterData.title" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.column.index.form.dataType')" field="selectType">
              <a-select v-model="filterData.selectType" :options="columnSelectType" :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @clear="condition($event)" @change="condition">
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('model.column.index.form.enableStatus')" field="enableStatus">
              <a-select v-model="filterData.enableStatus" :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @clear="condition($event)" @change="condition">
                <a-option
                    v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
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
          {{ $t('searchTable.operation.create') }}
        </a-button>
        <a-popover v-model:popup-visible="entityPopover" position="bottom" style="max-width: 400px" trigger="click">
          <a-button :disabled="formState==='view'" size="medium" type="primary" @click="entityPopoverClick($event)">
            <icon-plus/>
            {{ $t('searchTable.columns.operations.addModel') }}
          </a-button>
          <template #content>
            <a-form ref="validateEntityForm" :label-col-props="{ span: 6 }" :model="entityData" :wrapper-col-props="{ span: 18 }" class="form2">
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item :label="$t('model.view.index.form.entity.tableId')"
                               :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                               field="tableId">
                    <a-select v-model="entityData.tableId" allow-search @change="entityChange">
                      <a-option v-for="item of selectEntityOptions" :key="item.id" :label="`${item.title}[${item.entityName}]`" :value="item.id"/>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item :label="$t('model.view.index.form.entity.columnIds')"
                               :rules="[{required: true,message: $t('model.form.rules.match.required')}]"
                               field="columnIds">
                    <a-select v-model="entityData.columnIds" allow-search multiple @change="entityColumnChange">
                      <a-option v-for="item of selectEntityColumnOptions" :key="item.id" :label="`${item.title}[${item.fieldName}]`" :value="item.id"/>
                      <template #header>
                        <div class="check-all">
                          <a-checkbox v-model="entityColumnSelectAll" class="check-all-radio" @change="entityColumnSelectAllChange">
                            <span class="check-all-span">
                              {{ $t('searchTable.columns.operations.all') }}
                            </span>
                          </a-checkbox>
                        </div>
                      </template>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <a-divider style="margin: 5px 0px"/>
            <a-space style="display: flex;align-items: center;justify-content: end;">
              <a-button size="medium" type="primary" @click="entitySubmitClick($event)">
                {{ $t('searchTable.columns.operations.add') }}
              </a-button>
            </a-space>
          </template>
        </a-popover>
        <a-select v-model="commonSelectData" v-model:popup-visible="selectVisible"
                  :placeholder="$t('searchTable.form.selectDefault')" allow-search multiple scrollbar
                  @change="commonSelectDataChange">
          <a-option v-for="item of selectCommonOptions"
                    :key="item.id" :label="`${item.title}[${item.fieldName}]`"
                    :title="`${item.title}[${item.fieldName}]`"
                    :value="item.id"/>
          <template #header>
            <div class="check-all">
              <a-checkbox v-model="commonSelectAll" class="check-all-radio" @change="commonSelectAllChange">
                <span class="check-all-span">
                  {{ $t('searchTable.columns.operations.all') }}
                </span>
              </a-checkbox>
            </div>
          </template>
          <template #footer>
            <div style="padding: 6px 6px; text-align: right;">
              <a-button size="mini" type="primary" @click="addCommonColumn($event)">
                {{ $t('searchTable.columns.operations.add') }}
              </a-button>
            </div>
          </template>
          <template #trigger>
            <div :style="{width:`${formState==='view'?'10px':'320px'}`}">
              <a-button :disabled="formState==='view'" type="primary" @click="openCommonColumn($event)">
                <template #icon>
                  <icon-plus/>
                </template>
                {{ $t('searchTable.columns.operations.addCom') }}
              </a-button>
            </div>
          </template>
        </a-select>
      </a-space>
    </a-col>
    <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
      <a-tooltip :content="$t('searchTable.columns.operations.switch.tip')" :popup-visible="visible" position="tr"
                 @mouseenter="()=>{visible=true}" @mouseleave="()=>{visible=false}">
        <a-switch v-model="checked" :before-change="beforeChange"/>
      </a-tooltip>
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
      <a-table-column :title="$t('model.column.index.form.index')" :width="70" align="center" data-index="index" fixed="left">
        <template #cell="{  rowIndex }">{{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}</template>
      </a-table-column>
      <a-table-column :ellipsis="true" :sortable="sortable.name" :title="$t('model.column.index.form.name')" :tooltip="true" :width="180" data-index="name"
                      fixed="left">
        <template #cell="{record}">
          <a-space>
            <a-tooltip v-if="!record.synced" :content="$t('model.column.index.form.name.synced')" position="left">
              <a-space>
                <icon-exclamation-circle style="color: rgb(var(--warning-6));"/>
                {{ record.name }}
              </a-space>
            </a-tooltip>
            <span v-else>{{ record.name }}</span>
            <a-button v-if="record.key===true" class="list-action-button-default" type="outline">
              {{ $t('model.column.index.form.name.key') }}
            </a-button>
            <a-button v-if="record.key===false&&record.marker&&record.marker.indexOf('id')==-1" class="list-action-button-default" type="outline">
              {{ $t(`model.column.index.form.marker.${record.marker}`) }}
            </a-button>
          </a-space>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.title')" :tooltip="true" :width="150" data-index="title"/>
      <a-table-column :title="$t('model.column.index.form.enableStatus')" :width="90" data-index="enableStatus">
        <template #cell="{ record }">
          {{ $t(`model.column.index.form.enableStatus.${record.enableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.fieldName')" :tooltip="true" :width="150" data-index="fieldName"/>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.dataType')" :tooltip="true" :width="150" data-index="selectType">
        <template #cell="{record}">
          {{ getOptionLabel(record.selectType, columnSelectType) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.charMaxLength')" :tooltip="true" :width="90" data-index="charMaxLength"/>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.numericPrecision')" :tooltip="true" :width="90" data-index="numericPrecision"/>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.numericScale')" :tooltip="true" :width="90" data-index="numericScale"/>
      <a-table-column :title="$t('model.column.index.form.encrypted')" :width="90" data-index="encrypted">
        <template #cell="{ record }">
          {{ $t(`model.column.index.form.encrypted.${record.encrypted}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.column.index.form.nullable')" :width="90" data-index="nullable">
        <template #cell="{ record }">
          {{ $t(`model.column.index.form.nullable.${record.nullable}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.column.index.form.key')" :width="90" data-index="key">
        <template #cell="{ record }">
          {{ $t(`model.column.index.form.key.${record.key}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.column.index.form.uniqued')" :width="90" data-index="uniqued">
        <template #cell="{ record }">
          {{ $t(`model.column.index.form.uniqued.${record.uniqued}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.column.index.form.numericSigned')" :width="110" data-index="numericSigned">
        <template #cell="{ record }">
          {{ $t(`model.column.index.form.numericSigned.${record.numericSigned}`) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.type')" :tooltip="true" :width="150" data-index="type"/>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.defaultValue')" :tooltip="true" :width="120" data-index="defaultValue"/>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.defaultRange2')" :tooltip="true" :width="210" data-index="extraValue"/>
      <a-table-column :sortable="sortable.ordinalPosition" :title="$t('model.column.index.form.ordinalPosition')" :width="120" data-index="ordinalPosition"/>
      <a-table-column :sortable="sortable.createAt" :title="$t('model.column.index.form.createAt')" :width="180" data-index="createAt"/>
      <a-table-column :ellipsis="true" :title="$t('model.column.index.form.comment')" :tooltip="true" :width="210" data-index="comment"/>
      <a-table-column v-if="formState==='edit'" :title="$t('model.column.index.form.operations')" :width="180" align="center" data-index="operations"
                      fixed="right">
        <template #cell="{ record,isDefault = defaultColumnMetas.includes(record.name)}">
          <!--    编辑      -->
          <a-tooltip v-if="isDefault" :content="$t('model.column.index.form.operations.disabled')">
            <a-button class="button-disabled" size="small" type="text">
              {{ $t('searchTable.columns.operations.edit') }}
            </a-button>
          </a-tooltip>
          <a-button v-else size="small" type="text" @click="editTable(record)">
            {{ $t('searchTable.columns.operations.edit') }}
          </a-button>
          <!--    删除      -->
          <a-tooltip v-if="isDefault" :content="$t('model.column.index.form.operations.disabled')">
            <a-button class="button-disabled" size="small" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-tooltip>
          <a-popconfirm
              v-else :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning"
              @ok="deleteTable(record)">
            <a-button size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
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

.button-disabled {
  cursor: not-allowed;
  color: var(--color-text-3) !important;
  background-color: transparent !important;
  border: 1px solid transparent !important;
}

.list-action-button-default {
  cursor: auto;
  height: 20px;
  font-size: 12px;
  border-radius: 5px;
  line-height: 20px;
  padding: 0 5px;
}

.check-all {
  padding: 0px 12px;
  line-height: 33px;
  display: flex;
  align-items: center;

  &-radio {
    width: 100%
  }

  &-span {
    font-weight: 600;
    color: rgb(var(--primary-6));
  }
}
</style>