<script lang="ts">
export default {
  name: 'GlModelTableColumnList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch, computed} from 'vue';
import type {FormInstance, TableSortable, TableColumnData} from '@arco-design/web-vue';
import {modelApi, useGlobal, utils} from "@geelato/gl-ui";
import type {ColumnSelectType, QueryTableColumnForm, QueryTableForm, Pagination} from "@geelato/gl-ui";
import {
  enableStatusOptions,
  encryptedOptions,
  keyOptions, markerOptions,
  nullableOptions,
  numericSignedOptions,
  uniquedOptions
} from './searchTable';
import GlModelTableColumnForm from "./form.vue";

type PageParams = {
  connectId: string; // 数据库连接主键
  tableId: string; // 模型主键
  tableName: string; // 模型名称
  isSync: boolean; // 是否同步
  isSystem: boolean; // 是否系统表
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

const global = useGlobal();
// 分页列表参数
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);
const scrollbar = ref(true);
const scroll = ref({x: 2200, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  name: {sortDirections: ['descend', 'ascend'], sorter: true, sortOrder: ''},
  ordinalPosition: {sortDirections: ['descend', 'ascend'], sorter: true, sortOrder: ''},
  createAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''}
});
const lastSort = ref<string>('ordinalPosition|asc');
// 是否隐藏基础字段
const checked = ref<boolean>(true);
const visible = ref<boolean>(false);

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
    appId: '',
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
const fetchData = async (params: Record<string, any>) => {
  loading.value = true;
  try {
    const {data} = await modelApi.pageQueryTableColumns(params);
    if (checked.value) {
      // @ts-ignore
      renderData.value = data.items.filter((item) => !defaultColumnMetas.value.includes(item.name));
    } else {
      renderData.value = data.items;
    }
    pagination.current = params.current;
    pagination.pageSize = basePagination.pageSize;
    pagination.total = data.total;
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
    await modelApi.deleteTableColumn(id);
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
  if (filterData.value.tableId || filterData.value.tableName) {
    search();
  } else {
    renderData.value = [];
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

const beforeChange = () => {
  checked.value = !checked.value;
  search();
}

/* 表单参数 */
const formPage = ref({
  id: '',// 主键
  visible: false,//
  parameter: {
    connectId: '', tableId: '', tableName: '',
    isSync: false, isSystem: false,
    appId: '', tenantCode: ''
  },
  formState: 'add',//
  formCol: 2,//
  title: '模型字段',
  width: '1020px',
});

const addTable = (ev?: MouseEvent) => {
  Object.assign(formPage.value, {
    id: '', visible: true, formState: 'add', title: '新增模型字段'
  })
};
const editTable = (data: QueryTableColumnForm) => {
  Object.assign(formPage.value, {
    id: data.id, visible: true, formState: 'edit', title: '编辑模型字段'
  })
}

const saveSuccess = (data: QueryTableColumnForm, type: string) => {
  if (type === 'add') {
    reset();
    emits('add', data);
  } else if (type === 'edit') {
    search();
    emits('edit', data);
  }
}

const deleteTable = (data: QueryTableColumnForm) => {
  deleteData(data.id, (id: string) => {
    condition();
    emits('delete', data);
  });
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
    const {data} = await modelApi.queryTables({
      ...params,
      enableStatus: 1, tableType: 'table', appId: '', tenantCode: props.parameter.tenantCode || ''
    });
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
      const {data} = await modelApi.queryTableColumns({
        ...params,
        enableStatus: 1, tableId: entityData.value.tableId, appId: '', tenantCode: props.parameter.tenantCode || ''
      });
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
      await modelApi.insertCommonColumns({
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
      await modelApi.insertCommonColumns({
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
    global.$message.warning({content: '请至少选择一项！'});
  }
}

const isDefaultColumn = (value: string) => {
  return defaultColumnMetas.value.includes(value);
}

/**
 * 显示时加载常用字段列表
 */
watch(() => selectVisible, (val) => {
  if (selectVisible.value) {
    modelApi.getCommonFieldsOptions((data: QueryTableColumnForm[]) => {
      selectCommonOptions.value = data || [];
    }, () => {
      selectCommonOptions.value = [];
    });
  }
}, {deep: true, immediate: true});


watch(() => props.parameter, (val) => {
  // 模型字段类型
  modelApi.getTypeSelectOptions((data: ColumnSelectType[]) => {
    columnSelectType.value = data || [];
  }, () => {
    columnSelectType.value = [];
  });
  // 模型默认字段
  modelApi.getDefaultColumnNames((data: string[]) => {
    defaultColumnMetas.value = data || [];
  }, () => {
    defaultColumnMetas.value = [];
  });
  reset();
  formPage.value.parameter = {
    connectId: props.parameter.connectId,
    tableId: props.parameter.tableId,
    tableName: props.parameter.tableName,
    isSync: props.parameter?.isSync === true,
    isSystem: props.parameter?.isSystem === true,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
}, {deep: true, immediate: true});

watch(() => props.height, (val) => {
  scroll.value.y = props.height;
}, {deep: true, immediate: true});

watch(() => props, (val) => {
  checked.value = true;
}, {deep: true, immediate: true});
</script>

<template>
  <GlModelTableColumnForm v-model:visible="formPage.visible"
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
            <a-form-item field="name" label="字段标识">
              <a-input v-model="filterData.name" allow-clear @clear="condition" @press-enter="condition"/>
            </a-form-item>
          </a-col>
          <a-col :span="isModal?12:8">
            <a-form-item field="title" label="名称（中文）">
              <a-input v-model="filterData.title" allow-clear @clear="condition" @press-enter="condition"/>
            </a-form-item>
          </a-col>
          <!--          <a-col :span="isModal?12:8">
                      <a-form-item label="数据类型" field="selectType">
                        <a-select v-model="filterData.selectType" :options="selectTypeOptions" placeholder="全部" allow-clear @clear="condition"/>
                      </a-form-item>
                    </a-col>-->
          <a-col :span="isModal?12:8">
            <a-form-item field="nullable" label="是否可空">
              <a-select v-model="filterData.nullable" placeholder="全部" allow-clear @clear="condition" @change="conditionChange">
                <a-option v-for="item of nullableOptions" :key="item.value as string" :label="item.label as string" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="isModal?12:8">
            <a-form-item field="uniqued" label="唯一约束">
              <a-select v-model="filterData.uniqued" placeholder="全部" allow-clear @clear="condition" @change="conditionChange">
                <a-option v-for="item of uniquedOptions" :key="item.value as string" :label="item.label as string" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <!--          <a-col :span="isModal?12:8">
                      <a-form-item label="状态" field="enableStatus">
                        <a-select v-model="filterData.enableStatus" placeholder="全部" :options="enableStatusOptions"/>
                      </a-form-item>
                    </a-col>-->
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
  <a-row style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button :disabled="formState==='view'" type="primary" @click="addTable">
          <template #icon>
            <gl-iconfont type="gl-plus-circle"/>
          </template>
          新建
        </a-button>
        <a-popover v-model:popup-visible="entityPopover" position="right" style="max-width: 400px" trigger="click">
          <a-button :disabled="formState==='view'" size="medium" type="primary" @click="entityPopoverClick">
            <template #icon>
              <gl-iconfont type="gl-plus-circle"/>
            </template>
            添加模型字段
          </a-button>
          <template #content>
            <a-form ref="validateEntityForm" :label-col-props="{ span: 6 }" :model="entityData" :wrapper-col-props="{ span: 18 }" class="form2">
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="tableId" label="模型">
                    <a-select v-model="entityData.tableId" allow-search @change="entityChange">
                      <a-option v-for="item of selectEntityOptions" :key="item.id" :label="`${item.title}[${item.entityName}]`" :value="item.id"/>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item :rules="[{required: true,message: '这是必填项'}]" field="columnIds" label="字段">
                    <a-select v-model="entityData.columnIds" allow-search multiple @change="entityColumnChange">
                      <a-option v-for="item of selectEntityColumnOptions" :key="item.id" :label="`${item.title}[${item.fieldName}]`" :value="item.id"/>
                      <template #header>
                        <div class="check-all">
                          <a-checkbox v-model="entityColumnSelectAll" class="check-all-radio" @change="entityColumnSelectAllChange">
                            <span class="check-all-span">
                              全选
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
              <a-button size="medium" type="primary" @click="entitySubmitClick">
                添加
              </a-button>
            </a-space>
          </template>
        </a-popover>
        <a-select v-model="commonSelectData"
                  v-model:popup-visible="selectVisible" allow-search multiple placeholder="全部" scrollbar
                  @change="commonSelectDataChange">
          <a-option v-for="item of selectCommonOptions"
                    :key="item.id" :label="`${item.title}[${item.fieldName}]`"
                    :title="`${item.title}[${item.fieldName}]`"
                    :value="item.id"/>
          <template #header>
            <div class="check-all">
              <a-checkbox v-model="commonSelectAll" class="check-all-radio" @change="commonSelectAllChange">
                <span class="check-all-span">
                  全选
                </span>
              </a-checkbox>
            </div>
          </template>
          <template #footer>
            <div style="padding: 6px 6px; text-align: right;">
              <a-button size="medium" type="primary" @click="addCommonColumn">
                添加
              </a-button>
            </div>
          </template>
          <template #trigger>
            <div :style="{width:`${formState==='view'?'10px':'320px'}`}">
              <a-button :disabled="formState==='view'" type="primary" @click="openCommonColumn">
                <template #icon>
                  <gl-iconfont type="gl-plus-circle"/>
                </template>
                添加常用字段
              </a-button>
            </div>
          </template>
        </a-select>
      </a-space>
    </a-col>
    <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
      <a-tooltip :popup-visible="visible" content="隐藏基础字段如’id‘、’creator‘..." @mouseenter="()=>{visible=true}" @mouseleave="()=>{visible=false}">
        <a-switch v-model="checked" :before-change="beforeChange"/>
      </a-tooltip>
    </a-col>
  </a-row>
  <a-table
      :key="height"
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
      @page-change="onPageChange" @sorter-change="onSorterChange">
    <template #columns>
      <a-table-column :width="80" align="center" data-index="index" fixed="left" title="序号">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :sortable="sortable.name"
                      :ellipsis="true" :tooltip="true" :width="180" data-index="name" fixed="left" title="字段标识">
        <template #cell="{record}">
          <a-space>
            <a-tooltip v-if="!record.synced" content="还未同步至数据库" position="left">
              <a-space>
                <gl-iconfont style="color: rgb(var(--warning-6));" type="gl-info-circle"/>
                {{ record.name }}
              </a-space>
            </a-tooltip>
            <span v-else>{{ record.name }}</span>
            <a-button v-if="record.key===true" class="list-action-button-default" type="outline">
              {{ $t('model.column.index.form.name.key') }}
            </a-button>
            <a-button v-if="record.key===false&&record.marker&&record.marker.indexOf('id')==-1" class="list-action-button-default" type="outline">
              {{ utils.getOptionLabel(record.marker, markerOptions) }}
            </a-button>
          </a-space>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="title" title="名称（中文）"/>
      <a-table-column :width="100" data-index="enableStatus" title="状态">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.enableStatus, enableStatusOptions) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="fieldName" title="名称（英文）"/>
      <a-table-column v-if="!props.parameter.tableName" :ellipsis="true" :tooltip="true" :width="250" data-index="tableName" title="模型名称"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="selectType" title="数据类型">
        <template #cell="{record}">
          {{ utils.getOptionLabel(record.selectType, columnSelectType) }}
        </template>
      </a-table-column>
      <a-table-column :width="130" data-index="charMaxLength" title="长度"/>
      <a-table-column :width="130" data-index="numericPrecision" title="整数位"/>
      <a-table-column :width="130" data-index="numericScale" title="小数位"/>
      <a-table-column :width="110" data-index="encrypted" title="是否加密">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.encrypted === true ? 1 : 0, encryptedOptions) }}
        </template>
      </a-table-column>
      <a-table-column :width="110" data-index="nullable" title="是否可空">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.nullable === true ? 1 : 0, nullableOptions) }}
        </template>
      </a-table-column>
      <a-table-column :width="110" data-index="key" title="是否主键">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.key === true ? 1 : 0, keyOptions) }}
        </template>
      </a-table-column>
      <a-table-column :width="110" data-index="uniqued" title="唯一约束">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.uniqued === true ? 1 : 0, uniquedOptions) }}
        </template>
      </a-table-column>
      <a-table-column :width="110" data-index="numericSigned" title="是否有符号">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.numericSigned === true ? 1 : 0, numericSignedOptions) }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="150" data-index="type" title="数据约束"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="130" data-index="defaultValue" title="默认值"/>
      <a-table-column :ellipsis="true" title="默认字段" :tooltip="true" :width="210" data-index="extraValue"/>
      <a-table-column :sortable="sortable.ordinalPosition" :width="100" data-index="ordinalPosition" title="次序"/>
      <a-table-column :sortable="sortable.createAt" :width="180" data-index="createAt" title="创建时间"/>
      <a-table-column :ellipsis="true" :tooltip="true" :width="200" data-index="comment" title="注释（中文）"/>
      <a-table-column v-if="formState==='edit'" :width="32+66*2" align="center" data-index="operations" fixed="right" title="操作">
        <template #cell="{ record,isDefault = isDefaultColumn(record.name)}">
          <!--    编辑      -->
          <a-tooltip v-if="isDefault" content="系统字段不可编辑">
            <a-button class="button-disabled" size="small" type="text">
              编辑
            </a-button>
          </a-tooltip>
          <a-button v-else size="small" type="text" @click="editTable(record)">
            编辑
          </a-button>
          <!--    删除      -->
          <a-tooltip v-if="isDefault" content="系统字段不可编辑">
            <a-button class="button-disabled" size="small" type="text">
              删除
            </a-button>
          </a-tooltip>
          <a-popconfirm v-else content="是否删除该条数据？" position="tr" type="warning" @ok="deleteTable(record)">
            <a-button size="small" status="danger" type="text">
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </template>
    <template #empty>
      <a-empty style="width: 33%;"/>
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