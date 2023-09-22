<template v-model="pageData">
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: 6 }" :model="filterData" :wrapper-col-props="{ span: 18 }" label-align="left">
        <a-row :gutter="16">
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('application.app.list.name')" field="name">
              <a-input v-model="filterData.name" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('application.app.list.code')" field="code">
              <a-input v-model="filterData.code" allow-clear @clear="search($event)" @press-enter="search($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('application.app.list.watermark')" field="watermark">
              <a-select v-model="filterData.watermark" :placeholder="$t('searchTable.form.selectDefault')">
                <a-option
                    v-for="item of watermarkOptions" :key="item.value as string" :label="$t(`${item.label}`)"
                    :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="pageData.isModal?12:8">
                      <a-form-item :label="$t('application.app.list.versionInfo')" field="versionInfo">
                        <a-input v-model="filterData.versionInfo" allow-clear @clear="search($event)"
                                 @press-enter="search($event)"/>
                      </a-form-item>
                    </a-col>-->
          <a-col :span="pageData.isModal?12:8">
            <a-form-item :label="$t('security.dictItem.index.form.createAt')" field="createAt">
              <a-range-picker v-model="filterData.createAt" style="width: 100%"/>
            </a-form-item>
          </a-col>
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
          {{ $t('searchTable.operation.create') }}
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
                  <a-checkbox
                      v-model="item.checked"
                      @change="handleChange($event, item as TableColumnData, index)"></a-checkbox>
                </div>
                <div class="title">
                  {{ item.title === '#' ? $t('security.dict.index.form.index') : $t(`${item.title}`) }}
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
      :pagination="pagination"
      :stripe="true"
      column-resizable
      row-key="id"
      @page-change="onPageChange">
    <template #columns>
      <a-table-column :title="$t('application.app.list.index')" :width="80" align="center" data-index="index" fixed="left">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.logo')" :tooltip="true" :width="80"
                      align="center" data-index="logo" fixed="left">
        <template #cell="{record}">
          <img :src="record.logo?record.logo:favicon" alt="logo" style="width: 25px;height: 25px"/>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.name')" :tooltip="true" :width="150"
                      data-index="name" fixed="left"/>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.code')" :tooltip="true" :width="120"
                      data-index="code"/>
      <!--      <a-table-column :ellipsis="true" :title="$t('application.app.list.versionInfo')" :tooltip="true" :width="120"
                            data-index="versionInfo"/>-->
      <a-table-column :ellipsis="true" :title="$t('application.app.list.applyStatus')" :tooltip="true" :width="120"
                      data-index="applyStatus">
        <template #cell="{ record }">
          {{ [0, 1].includes(record.applyStatus) ? $t(`application.app.list.status.${record.applyStatus}`) : "" }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.designStatus')" :tooltip="true" :width="120"
                      data-index="designStatus">
        <template #cell="{ record }">
          {{ [0, 1].includes(record.designStatus) ? $t(`application.app.list.status.${record.designStatus}`) : "" }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.icon')" :tooltip="true" :width="150"
                      data-index="icon">
        <template #cell="{record}">
          <GlIconfont :type="record.icon"/>
          {{ record.icon }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.watermark')" :tooltip="true" :width="100"
                      data-index="watermark">
        <template #cell="{ record }">
          {{ [0, 1].includes(record.watermark) ? $t(`application.app.list.watermark.${record.watermark}`) : "" }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.seqNo')" :tooltip="true" :width="80"
                      data-index="seqNo"/>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.createAt')" :tooltip="true" :width="180"
                      data-index="createAt"/>
      <a-table-column :ellipsis="true" :title="$t('application.app.list.description')" :tooltip="true" :width="200"
                      data-index="description"/>
      <a-table-column :title="$t('application.app.list.operations')" :width="230" align="center" data-index="operations"
                      fixed="right">
        <template #cell="{ record }">
          <a-dropdown position="br" trigger="hover">
            <a-button size="small" type="text">
              {{ $t('application.app.list.operations.enter') }}
            </a-button>
            <template #content>
              <a-doption>
                <a-button :disabled="![1].includes(record.applyStatus)" size="small" type="text" @click="enterTable(record,'index')">
                  {{ $t('application.app.list.operations.enter.index') }}
                  {{ [1].includes(record.applyStatus) ? "" : '(' + $t('application.app.list.status.0') + ')' }}
                </a-button>
              </a-doption>
              <!--              <a-doption>
                              <a-button size="small" type="text" @click="enterTable(record,'manage')">
                                {{ $t('application.app.list.operations.enter.manage') }}
                              </a-button>
                            </a-doption>-->
              <a-doption>
                <a-button :disabled="![1].includes(record.designStatus)" size="small" type="text" @click="enterTable(record,'design')">
                  {{ $t('application.app.list.operations.enter.design') }}
                  {{ [1].includes(record.designStatus) ? "" : '(' + $t('application.app.list.status.0') + ')' }}
                </a-button>
              </a-doption>
            </template>
          </a-dropdown>
          <!-- <a-button  size="small" type="text" @click="viewTable(record.id)">
                      {{ $t('application.app.list.operations.view') }}
                    </a-button>-->
          <a-button size="small" type="text" @click="editTable(record.id)">
            {{ $t('application.app.list.operations.edit') }}
          </a-button>
          <a-popconfirm :content="$t('application.app.list.operations.delete.popContent')" position="tr" type="warning"
                        @ok="deleteTable(record.id)">
            <a-button size="small" status="danger" type="text">
              {{ $t('application.app.list.operations.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </template>
  </a-table>
  <AppForm ref="appFormRef"></AppForm>
  <AppDrawer ref="appDrawerRef"></AppDrawer>
</template>

<script lang="ts" setup>
/* 导入 */
import {nextTick, reactive, ref, shallowRef, watch} from 'vue';
import useLoading from '@/hooks/loading';
// 分页列表
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
// 引用其他对象、方法
import {ListUrlParams, PageQueryFilter, PageQueryRequest} from '@/api/base';
import {deleteApp as deleteList, FilterAppForm as FilterForm, pageQueryApps as pageQueryList, QueryAppForm as QueryForm} from '@/api/application'
import {columns, watermarkOptions} from "@/views/application/searchTable";
import {Notification} from "@arco-design/web-vue";
// 引用其他页面
import AppForm from '@/views/application/form.vue';
import AppDrawer from '@/views/application/drawer.vue';
import {useRoute, useRouter} from "vue-router";
import favicon from '@/assets/favicon.ico';

/* 列表 */
const route = useRoute();
type Column = TableColumnData & { checked?: true };
const pageData = ref({
  current: 1, pageSize: 10, formState: 'edit', isModal: false, modalAddBack: (data: QueryForm) => {
  }, modalEditBack: (data: QueryForm) => {
  }, modalDeleteBack: (id: string) => {
  }
});
const appFormRef = shallowRef(AppForm);
const appDrawerRef = shallowRef(AppDrawer);
// 加载
const {loading, setLoading} = useLoading(true);
// 分页列表参数
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: pageData.value.current, pageSize: pageData.value.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<PageQueryFilter[]>([]);
// 搜索条件
const generateFilterData = (): FilterForm => {
  return {
    id: '',
    name: '',
    code: '',
    watermark: '',
    versionInfo: '',
    createAt: [],
    tenantCode: (route.params && route.params.tenantCode as string) || '',
    applyStatus: '',
    designStatus: ''
  };
};
const filterData = ref(generateFilterData());
const router = useRouter();
/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest = {
  current: pageData.value.current,
  pageSize: pageData.value.pageSize
}) => {
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
  if (appDrawerRef.value) {
    appDrawerRef.value.openForm({
      action: 'add', closeBack: (data: QueryForm) => {
        reset();
        pageData.value.modalAddBack(data);
      }
    });
  }
};
const enterTable = (data: QueryForm, type: string) => {
  if (data && router) {
    if (!data.id || !data.tenantCode) {
      Notification.error("参数缺少，请补全数据{tenantCode、appId}");
      return
    }
    switch (type) {
      case 'index':
        window.open(router.resolve({
          // path: `/${data.tenantCode}/${data.id}${DEFAULT_ROUTE.fullPath.replace("/:tenantCode", "").replace("/:appId", "")}`,
          name: 'pageWrapper',
          params: {tenantCode: data.tenantCode, appId: data.id}
        }).href, "_blank");
        break;
      case 'design':
        console.log('window.location.host:', window.location.host)
        window.open(`${window.location.protocol}//${window.location.host}/ide.html?tenantCode=${data.tenantCode}&appId=${data.id}&appName=${data.name}`, "_blank")
        break;
      case 'manage':
        break;
      default:
        break;
    }
  } else {
    Notification.error("导航出错，请刷新页面");
  }
}

const viewTable = (id: string) => {
  if (appDrawerRef.value) {
    appDrawerRef.value.openForm({action: 'view', 'id': id});
  }
}
const editTable = (id: string) => {
  if (appDrawerRef.value) {
    appDrawerRef.value.openForm({
      action: 'edit', 'id': id, closeBack: (data: QueryForm) => {
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
const deleteData = async (id: string, successBack: any) => {
  try {
    await deleteList(id);
    successBack();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

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