<template v-model="pageData">
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: 6 }" :model="filterData" :wrapper-col-props="{ span: 18 }" label-align="left">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item v-show="false">
              <a-input v-show="false" v-model="filterData.connectId"/>
              <a-input v-show="false" v-model="filterData.entityName"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.view.index.form.title')" field="title">
              <a-input v-model="filterData.title" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.view.index.form.viewName')" field="viewName">
              <a-input v-model="filterData.viewName" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.view.index.form.viewType')" field="viewType">
              <a-select v-model="filterData.viewType" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of viewTypeOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('model.view.index.form.enableStatus')" field="enableStatus">
              <a-select v-model="filterData.enableStatus" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="pageData.isModal?12:8">
                      <a-form-item :label="$t('model.view.index.form.linked')" field="linked">
                        <a-select v-model="filterData.linked" :placeholder="$t('searchTable.form.selectDefault')">
                          <a-option v-for="item of linkedOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
                        </a-select>
                      </a-form-item>
                    </a-col>-->
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 84px"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :size="18" direction="vertical">
        <a-button type="primary" @click="search($event)">
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
        <a-button v-show="pageData.formState==='edit'" type="primary" @click="addTable($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.operation.create') }} {{ $t('model.view.index.form.viewType.custom') }}
        </a-button>
        <a-button v-show="pageData.formState==='edit'" type="primary" @click="resetTable($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('searchTable.form.reset') }} {{ $t('model.view.index.form.viewType.default') }}
        </a-button>
      </a-space>
    </a-col>
    <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
      <a-tooltip :content="$t('searchTable.actions.refresh')">
        <div class="action-icon" @click="search($event)">
          <icon-refresh size="18"/>
        </div>
      </a-tooltip>
      <a-tooltip :content="$t('searchTable.actions.columnSetting')">
        <a-popover position="bl" trigger="click" @popup-visible-change="popupVisibleChange">
          <div class="action-icon">
            <icon-settings size="18"/>
          </div>
          <template #content>
            <div id="tableSetting">
              <div v-for="(item, index) in showColumns" :key="item.dataIndex" class="setting">
                <div style="margin-right: 4px; cursor: move">
                  <icon-drag-arrow/>
                </div>
                <div>
                  <a-checkbox v-model="item.checked" @change="handleChange($event, item as TableColumnData, index)"></a-checkbox>
                </div>
                <div class="title">
                  {{ item.title === '#' ? $t('model.view.index.form.index') : $t(`${item.title}`) }}
                </div>
              </div>
            </div>
          </template>
        </a-popover>
      </a-tooltip>
    </a-col>
  </a-row>
  <a-table
      :bordered="{cell:true}"
      :columns="(cloneColumns as TableColumnData[])"
      :data="renderData"
      :loading="loading"
      :pagination="basePagination.pageSize>1000?false:pagination"
      :stripe="true"
      column-resizable
      row-key="id"
      @page-change="onPageChange">
    <template #columns>
      <a-table-column :title="$t('model.view.index.form.index')" align="center" data-index="index" :width="80">
        <template #cell="{  rowIndex }">{{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}</template>
      </a-table-column>
      <a-table-column :title="$t('model.view.index.form.title')" data-index="title" :ellipsis="true" :tooltip="true" :width="200"/>
      <!-- <a-table-column :title="$t('model.view.index.form.entityName')" data-index="entityName" :ellipsis="true" :tooltip="true" :width="200"/>-->
      <a-table-column :title="$t('model.view.index.form.viewName')" data-index="viewName" :ellipsis="true" :tooltip="true" :width="200"/>
      <a-table-column :title="$t('model.view.index.form.viewType')" data-index="viewType" :width="120">
        <template #cell="{ record }">
          {{ $t(`model.view.index.form.viewType.${record.viewType}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.view.index.form.linked')" data-index="linked" :width="100">
        <template #cell="{ record }">
          {{ $t(`model.view.index.form.linked.${record.linked}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.view.index.form.enableStatus')" data-index="enableStatus" :width="100">
        <template #cell="{ record }">
          {{ $t(`model.view.index.form.enableStatus.${record.enableStatus}`) }}
        </template>
      </a-table-column>
      <a-table-column :title="$t('model.view.index.form.seqNo')" data-index="seqNo" :width="100"/>
      <a-table-column :title="$t('model.view.index.form.createAt')" data-index="createAt" :width="180"/>
      <a-table-column :title="$t('model.view.index.form.description')" data-index="description" :ellipsis="true" :tooltip="true" :width="200"/>
      <a-table-column v-show="pageData.formState==='edit'" :title="$t('model.view.index.form.operations')" :width="255" align="center"
                      data-index="operations" fixed="right">
        <template #cell="{ record,isDefault=record.viewType==='default'}">
          <a-button v-if="isDefault" v-permission="['admin']" size="small" type="text" @click="viewTable(record.id)">
            {{ $t('searchTable.columns.operations.view') }}
          </a-button>
          <a-button v-else v-permission="['admin']" size="small" type="text" @click="editTable(record.id)">
            {{ $t('searchTable.columns.operations.edit') }}
          </a-button>
          <!--    发布      -->
          <a-tooltip v-if="!pageData.tableSync" :content="$t('model.view.index.form.operations.noRel')">
            <a-button v-permission="['admin']" class="button-disabled" size="small" type="text">
              {{ $t('searchTable.columns.operations.release') }}
            </a-button>
          </a-tooltip>
          <a-popconfirm v-else :content="$t('searchTable.columns.operations.releaseMsg')" position="tr" type="info" @ok="releaseTable(record)">
            <a-button v-permission="['admin']" size="small" type="text">
              {{ $t('searchTable.columns.operations.release') }}
            </a-button>
          </a-popconfirm>
          <!--    删除      -->
          <a-tooltip v-if="isDefault" :content="$t('model.column.index.form.operations.disabled')">
            <a-button v-permission="['admin']" class="button-disabled" size="small" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-tooltip>
          <a-popconfirm v-else :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning"
                        @ok="deleteTable(record.id)">
            <a-button v-permission="['admin']" size="small" status="danger" type="text">
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
  <ViewForm ref="viewFormRef"></ViewForm>
  <ViewDrawer ref="viewDrawerRef"></ViewDrawer>
</template>

<script lang="ts" setup>
/* 导入 */
import {nextTick, reactive, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import useLoading from '@/hooks/loading';
// 分页列表
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
// 引用其他对象、方法
import {ListUrlParams, PageQueryFilter, PageQueryRequest} from '@/api/service/base_service';
import {
  deleteView as deleteList,
  FilterViewForm as FilterForm,
  pageQueryViews as pageQueryList,
  QueryTableForm,
  QueryViewForm as QueryForm,
  releaseMetaView,
  resetDefaultView
} from '@/api/service/model_service';
import {columns, enableStatusOptions, viewTypeOptions} from '@/views/model/view/searchTable';
// 引用其他页面
import ViewForm from '@/views/model/view/form.vue';
import ViewDrawer from '@/views/model/view/drawer.vue';
import {Notification} from "@arco-design/web-vue";

/* 列表 */
type Column = TableColumnData & { checked?: true };
const pageData = ref({
  current: 1, pageSize: 10, formState: 'edit', isModal: false,
  params: {connectId: '', entityName: ''}, tableSync: false,
  modalAddBack: (data: QueryForm) => {
  }, modalEditBack: (data: QueryForm) => {
  }, modalDeleteBack: (id: string) => {
  }
});
const viewFormRef = ref(null);
const viewDrawerRef = ref(null);
const isDefault = ref(false);
// 国际化
const {t} = useI18n();
// 加载
const {loading, setLoading} = useLoading(true);
// 分页列表参数
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: pageData.value.current, pageSize: pageData.value.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<PageQueryFilter[]>([]);

/* 列表 */
const generateFilterData = (): FilterForm => {
  return {
    id: '',
    connectId: '',
    entityName: '',
    title: '',
    viewName: '',
    viewType: '',
    enableStatus: '',
    linked: '',
    createAt: []
  };
};
const filterData = ref(generateFilterData());
/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest = {current: pageData.value.current, pageSize: pageData.value.pageSize}) => {
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
/* 获取列表数据 */
fetchData();
const deleteData = async (id: string, successBack: any) => {
  try {
    await deleteList(id);
    successBack();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};
const resetDefault = async (params: QueryTableForm, successBack: any) => {
  try {
    await resetDefaultView(params);
    successBack();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
const releaseTableView = async (params: QueryForm, successBack: any) => {
  try {
    await releaseMetaView(params.viewName, params.viewConstruct);
    successBack();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
/**
 * 条件查询 - 搜索
 */
const search = (ev?: Event) => {
  fetchData({...basePagination, ...filterData.value,} as unknown as PageQueryRequest);
};
/**
 * 条件查询 - 重置
 */
const reset = (ev?: Event) => {
  basePagination.current = pageData.value.current;
  filterData.value = generateFilterData();
  filterData.value.connectId = pageData.value.params.connectId || '';
  filterData.value.entityName = pageData.value.params.entityName || '';
  search();
};
/**
 * 分页 - 页面跳转
 * @param current
 */
const onPageChange = (current: number) => {
  basePagination.current = current;
  search();
};

/* 列表，按钮、操作列 */
const addTable = (ev: MouseEvent) => {
  if (pageData.value.isModal && !pageData.value.params.connectId && !pageData.value.params.entityName) {
    Notification.warning(t('security.dict.index.notice.warning2'));
    return;
  }
  if (viewDrawerRef.value) {
    // @ts-ignore
    viewDrawerRef.value?.openForm({
      action: 'add', params: pageData.value.params, closeBack: (data: QueryForm) => {
        reset();
        pageData.value.modalAddBack(data);
      }
    });
  }
};
const resetTable = (ev: MouseEvent) => {
  resetDefault(pageData.value.params as unknown as QueryTableForm, function () {
    Notification.success(t('model.view.index.model.info.reset'));
    reset();
  });
}
const viewTable = (id: string) => {
  if (viewDrawerRef.value) {
    // @ts-ignore
    viewDrawerRef.value?.openForm({action: 'view', 'id': id, params: pageData.value.params});
  }
}
const editTable = (id: string) => {
  if (viewDrawerRef.value) {
    // @ts-ignore
    viewDrawerRef.value?.openForm({
      action: 'edit', 'id': id, params: pageData.value.params, closeBack: (data: QueryForm) => {
        reset();
        pageData.value.modalEditBack(data);
      }
    });
  }
}

const deleteTable = (id: string) => {
  deleteData(id, () => {
    reset();
    pageData.value.modalDeleteBack(id);
  });
}

const releaseTable = (record: QueryForm) => {
  releaseTableView(record, () => {
    Notification.success(t('model.view.index.model.info.release'));
    reset();
  })
}

/* 分页功能区 - 固定方法 */
const handleChange = (checked: boolean | (string | boolean | number)[], column: Column, index: number) => {
  if (!checked) {
    cloneColumns.value = showColumns.value.filter((item) => item.dataIndex !== column.dataIndex);
  } else {
    cloneColumns.value.splice(index, 0, column);
  }
};
const exchangeArray = <T extends Array<any>>(array: T, beforeIdx: number, newIdx: number, isDeep = false): T => {
  const newArray = isDeep ? cloneDeep(array) : array;
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(beforeIdx, 1, newArray.splice(newIdx, 1, newArray[beforeIdx]).pop());
  }
  return newArray;
};
const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById('tableSetting') as HTMLElement;
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const {oldIndex, newIndex} = e;
          exchangeArray(cloneColumns.value, oldIndex, newIndex);
          exchangeArray(showColumns.value, oldIndex, newIndex);
        }
      });
    });
  }
};
watch(() => columns.value, (val) => {
    cloneColumns.value = cloneDeep(val);
    cloneColumns.value.forEach((item, index) => {
      item.checked = true;
    });
    showColumns.value = cloneDeep(cloneColumns.value);
  },
  {deep: true, immediate: true}
);

/* 对外调用方法 */
const loadList = (urlParams: ListUrlParams) => {
  // 参数设置
  pageData.value.formState = urlParams.action || 'edit';
  pageData.value.isModal = urlParams.isModal || false;
  pageData.value.params.connectId = urlParams.params?.pId || '';
  pageData.value.params.entityName = urlParams.params?.pName || '';
  pageData.value.tableSync = urlParams.params?.isSync || false;
  basePagination.pageSize = urlParams.pageSize || pageData.value.pageSize;
  // 方法反馈 新增、编辑、删除
  pageData.value.modalAddBack = urlParams.modalAddBack ? urlParams.modalAddBack : pageData.value.modalAddBack;
  pageData.value.modalEditBack = urlParams.modalEditBack ? urlParams.modalEditBack : pageData.value.modalEditBack;
  pageData.value.modalDeleteBack = urlParams.modalDeleteBack ? urlParams.modalDeleteBack : pageData.value.modalDeleteBack;
  // 初始化
  reset();
}

// 将方法暴露出去
defineExpose({loadList});
</script>

<script lang="ts">
export default {
  name: 'SearchTable'
};
</script>

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
