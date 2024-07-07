<script lang="ts">
export default {
  name: 'RoleAppList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import {Message, TableColumnData, TableSortable} from '@arco-design/web-vue';
import {PageSizeOptions} from '@/api/base';
// 页面所需 对象、方法
import {PageQueryFilter, PageQueryRequest} from '@/api/base';
import {getAppSelectOptions, QueryAppForm} from "@/api/application";
import {deleteRoleApp as deleteList, QueryRoleAppForm, insertRoleApp, pageQueryRoleAppOf as pageQueryList} from '@/api/security';
import {statusOptions, watermarkOptions} from "@/views/application/searchTable";
import favicon from "@/assets/favicon.ico";

// 页面所需 参数
type PageParams = {
  roleId: string; // 角色主键
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'add', 'delete']);
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
const scroll = ref({x: 1600, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  seqNo: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  updateAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: 'descend'}
});
const lastSort = ref<string>('updateAt|desc');
// 列表 - 查询条件布局
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
// 列表 - 查询条件
const generateFilterData = () => {
  return {
    roleId: props.parameter.roleId || '',
    roleName: '',
    roleCode: '',
    roleType: '',
    roleWeight: '',
    appLogo: '',
    appName: '',
    appCode: '',
    appIcon: '',
    appWaterMark: '',
    appApplyStatus: '',
    appDesignStatus: '',
    appSeqNo: '',
    appDescription: '',
    updateAt: [],
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
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
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

/**
 * 列表按钮 - 删除
 * @param id
 */
const deleteTable = (id: string) => {
  deleteData(id, (id: string) => {
    condition();
    emits('delete', id);
  });
}


/* 常用字段选择 */
const appSelectOptions = ref<QueryAppForm[]>([]);
const selectVisible = ref(false);
const selectAll = ref<boolean>(false);
const selectData = ref<string[]>([]);
/**
 * 选择内容与全选联动
 */
const selectChange = () => {
  let isAll = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of appSelectOptions.value) {
    if (!selectData.value.includes(item.id)) {
      isAll = false;
    }
  }
  selectAll.value = isAll;
}
/**
 * 全选与选择项联动
 */
const selectAllChange = () => {
  if (selectAll.value === true) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of appSelectOptions.value) {
      if (!selectData.value.includes(item.id)) {
        selectData.value.push(item.id);
      }
    }
  } else {
    selectData.value = [];
  }
}
/**
 * 添加选择的字段
 * @param ev
 */
const closeTrigger = async (ev?: MouseEvent) => {
  if (selectData.value.length > 0) {
    try {
      await insertRoleApp({
        roleId: props.parameter.roleId || '',
        appId: selectData.value.join(",") || ''
      } as unknown as QueryRoleAppForm);
      selectVisible.value = false;
      reset();
      emits('add');
    } catch (err) {
      console.log(err);
    }
  } else {
    Message.warning('请至少选择一项！');
  }
}
watch(() => selectVisible, (val) => {
  if (selectVisible.value === true) {
    selectData.value = [];
    selectAll.value = false;
  }
}, {deep: true, immediate: true});

watch(() => props, (val) => {
  if (props.visible === true) {
    // 应用信息
    getAppSelectOptions({
      id: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }, (data: QueryAppForm[]) => {
      appSelectOptions.value = data || [];
    }, () => {
      appSelectOptions.value = [];
    });
    // 页面设置
    scroll.value.y = props.height;
    basePagination.pageSize = props.pageSize;
    // 加载数据
    reset();
  }
}, {deep: true, immediate: true});
</script>

<template>
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: labelCol }" :model="filterData" :wrapper-col-props="{ span: wrapperCol }" label-align="left">
        <a-row :gutter="wrapperCol">
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('application.app.list.name')" field="appName">
              <a-input v-model="filterData.appName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('application.app.list.code')" field="appCode">
              <a-input v-model="filterData.appCode" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('application.app.list.applyStatus')" field="appApplyStatus">
              <a-select v-model="filterData.appApplyStatus" :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @clear="condition($event)" @change="condition">
                <a-option v-for="item of statusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('application.app.list.designStatus')" field="appDesignStatus">
              <a-select v-model="filterData.appDesignStatus" :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @clear="condition($event)" @change="condition">
                <a-option v-for="item of statusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('application.app.list.watermark')" field="appWaterMark">
              <a-select v-model="filterData.appWaterMark" :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @clear="condition($event)" @change="condition">
                <a-option v-for="item of watermarkOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-if="!selectVisible" :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.dictItem.index.form.createAt')" field="createAt">
              <a-range-picker v-model="filterData.createAt" style="width: 100%" @clear="condition($event)" @change="condition"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 136px"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :size="18" direction="vertical" style="align-items: flex-end;">
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
        <a-trigger v-model:popup-visible="selectVisible" :popup-translate="[0, -32]" position="br" trigger="click">
          <a-button :disabled="formState==='view'" status="success" :type="selectVisible?'text':'primary'">
            <template #icon>
              <icon-plus/>
            </template>
            {{ $t('searchTable.operation.create') }}
          </a-button>
          <template #content>
            <a-space style="align-items: flex-start;">
              <a-select v-model="selectData" :field-names="{value: 'id', label: 'name'}" :options="appSelectOptions"
                        :style="{width:'320px'}" allow-clear allow-search multiple placeholder="选择应用，关联当前角色"
                        scrollbar @change="selectChange">
                <template #header>
                  <div class="check-all">
                    <a-checkbox v-model="selectAll" class="check-all-radio" @change="selectAllChange">
                      <span class="check-all-span">{{ $t('searchTable.app.operations.all') }}</span>
                    </a-checkbox>
                  </div>
                </template>
              </a-select>
              <a-button type="primary" @click="closeTrigger">
                <template #icon>
                  <icon-save/>
                </template>
                {{ $t('security.dictItem.index.popover.ok') }}
              </a-button>
            </a-space>
          </template>
        </a-trigger>
      </a-space>
    </a-col>
  </a-row>
  <a-divider style="margin-top: 0"/>
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
      <a-table-column :ellipsis="true" :title="$t('application.app.list.logo')" :tooltip="true" :width="70" align="center" data-index="appLogo">
        <template #cell="{record}">
          <img :src="record.appLogo?record.appLogo:favicon" alt="logo" style="width: 25px;height: 25px"/>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.name')" :tooltip="true" :width="180" data-index="appName"/>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.code')" :tooltip="true" :width="150" data-index="appCode"/>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.applyStatus')" :tooltip="true" :width="120" data-index="appApplyStatus">
        <template #cell="{ record }">
          {{ [0, 1].includes(record.appApplyStatus) ? $t(`application.app.list.status.${record.appApplyStatus}`) : "" }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.designStatus')" :tooltip="true" :width="120" data-index="appDesignStatus">
        <template #cell="{ record }">
          {{ [0, 1].includes(record.appDesignStatus) ? $t(`application.app.list.status.${record.appDesignStatus}`) : "" }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.icon')" :tooltip="true" :width="120" data-index="appIcon">
        <template #cell="{record}">
          <GlIconfont :type="record.appIcon"/>
          {{ record.appIcon }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.watermark')" :tooltip="true" :width="120" data-index="appWaterMark">
        <template #cell="{ record }">
          {{ [0, 1].includes(record.appWaterMark) ? $t(`application.app.list.watermark.${record.appWaterMark}`) : "" }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :sortable="sortable.seqNo" :title="$t('application.app.list.seqNo')" :tooltip="true" :width="120" align="right"
                      data-index="appSeqNo"/>
      <a-table-column :ellipsis="true" :sortable="sortable.updateAt" :title="$t('application.app.list.updateAt')" :tooltip="true" :width="180"
                      data-index="updateAt"/>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.description')" :tooltip="true" :width="240" data-index="appDescription"/>
      <a-table-column :title="$t('application.app.list.operations')" :width="100" align="center" data-index="operations" fixed="right">
        <template #cell="{ record }">
          <a-popconfirm :content="$t('searchTable.columns.operations.relevance.deleteMsg')" position="tr" type="warning" @ok="deleteTable(record.id)">
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

.check-all {
  padding: 6px 12px;

  &-radio {
    width: 100%
  }

  &-span {
    font-weight: 600;
    color: rgb(var(--primary-6));
  }
}
</style>