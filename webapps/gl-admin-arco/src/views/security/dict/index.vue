<template>
  <div class="container">
    <Breadcrumb :items="['sercurity.dict.index.menu.list', 'sercurity.dict.index.menu.list.searchTable']"/>
    <a-card v-model="cardData" class="general-card general-card1">
      <a-row>
        <a-col :span="4">
          <a-spin>{{ $t('sercurity.dict.index.menu.list.searchTable') }}</a-spin>
        </a-col>
        <a-col :span="20">
          <a-spin>{{ cardData.currentDictName ? cardData.currentDictName : $t('sercurity.dictItem.index.menu.list.searchTable') }}</a-spin>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">
          <a-space style="padding-bottom: 10px;">
            <a-button type="outline" @click="addDict">
              <template #icon>
                <icon-plus/>
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-button type="outline" @click="refreshDict">
              <template #icon>
                <icon-refresh/>
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
          <a-list :max-height="480" :scrollbar="scrollbar" :loading="loading">
            <a-list-item v-for="item of listData" :id="item.id" :key="item.id" class="list-item1" @click="selectedList(`${item.id}`)">
              {{ item.dicName }}
            </a-list-item>
          </a-list>
        </a-col>
        <a-col :span="20">
          <a-tabs v-model:active-key="cardData.tabKey" :default-active-tab="1" type="rounded" :position="'top'" @tab-click="tabsChange">
            <a-tab-pane key="1" :title="$t('sercurity.dict.index.menu.list.searchTable1')">
              <a-form :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                <a-form-item v-show="false">
                  <a-input v-show="false" v-model="formData.id"/>
                </a-form-item>
                <a-form-item field="dicName" :label="$t('sercurity.dict.index.form.dicName')">
                  <a-input v-model="formData.dicName" :max-length="32"/>
                </a-form-item>
                <a-form-item field="dicCode" :label="$t('sercurity.dict.index.form.dicCode')">
                  <a-input v-model="formData.dicCode" :max-length="32"/>
                </a-form-item>
                <a-form-item field="tenantCode" :label="$t('sercurity.dict.index.form.tenantCode')">
                  <a-input v-model="formData.tenantCode" :max-length="32"/>
                </a-form-item>
                <a-form-item field="enableStatus" :label="$t('sercurity.dict.index.form.enableStatus')">
                  <a-select v-model="formData.enableStatus">
                    <a-option v-for="item of enableStatusOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
                  </a-select>
                </a-form-item>
                <a-form-item field="seqNo" :label="$t('sercurity.dict.index.form.seqNo')">
                  <a-input-number v-model="formData.seqNo" :precision="0" :max="999999" :min="1" placeholder="length[1,999999]"/>
                </a-form-item>
                <a-form-item field="dicRemark" :label="$t('sercurity.dict.index.form.dicRemark')">
                  <a-textarea v-model="formData.dicRemark" :max-length="512"
                              :auto-size="{minRows:3,maxRows:6}" show-word-limit/>
                </a-form-item>
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="saveForm">{{ $t('sercurity.dict.index.model.save.text') }}</a-button>
                    <a-button type="primary" @click="deleteForm">{{ $t('sercurity.dict.index.model.delete.text') }}</a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key="2" :title="$t('sercurity.dictItem.index.menu.list.searchTable')">
              <a-card class="general-card">
                <a-row>
                  <a-col :flex="13">
                    <a-form :model="filterData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="right">
                      <a-row :gutter="16">
                        <a-form-item v-show="false">
                          <a-input v-show="false" v-model="filterData.dictId"/>
                        </a-form-item>
                        <a-col :span="12">
                          <a-form-item field="dictName" :label="$t('sercurity.dict.index.form.dicName1')">
                            <a-input v-model="cardData.dicName" :readonly="true"/>
                          </a-form-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-item field="name" :label="$t('sercurity.dictItem.index.form.itemText')">
                            <a-input v-model="filterData.itemText"/>
                          </a-form-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-item field="code" :label="$t('sercurity.dictItem.index.form.itemCode')">
                            <a-input v-model="filterData.itemCode"/>
                          </a-form-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-item field="createAt" :label="$t('sercurity.dictItem.index.form.createAt')">
                            <a-range-picker v-model="filterData.createAt" style="width: 100%"/>
                          </a-form-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-item field="enableStatus" :label="$t('sercurity.dictItem.index.form.enableStatus')">
                            <a-select v-model="filterData.enableStatus" :placeholder="$t('searchTable.form.selectDefault')">
                              <a-option v-for="item of enableStatusOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
                            </a-select>
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </a-form>
                  </a-col>
                  <a-divider style="height: 84px" direction="vertical"/>
                  <a-col :flex="1" style="text-align: right">
                    <a-space direction="vertical" :size="18">
                      <a-button type="primary" @click="search">
                        <template #icon>
                          <icon-search/>
                        </template>
                        {{ $t('searchTable.form.search') }}
                      </a-button>
                      <a-button @click="reset">
                        <template #icon>
                          <icon-refresh/>
                        </template>
                        {{ $t('searchTable.form.reset') }}
                      </a-button>
                      <a-button type="primary" @click="addTable">
                        <template #icon>
                          <icon-plus/>
                        </template>
                        {{ $t('searchTable.operation.create') }}
                      </a-button>
                    </a-space>
                  </a-col>
                </a-row>
                <a-divider style="margin-top: 0"/>
                <a-table
                    row-key="id" column-resizable
                    :loading="loading"
                    :pagination="pagination"
                    :columns="(cloneColumns as TableColumnData[])"
                    :data="renderData"
                    :bordered="{cell:true}"
                    :stripe="true"
                    @page-change="onPageChange">
                  <template #columns>
                    <a-table-column :title="$t('sercurity.dictItem.index.form.index')" data-index="index" width="80" align="center">
                      <template #cell="{  rowIndex }">
                        {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
                      </template>
                    </a-table-column>
                    <a-table-column :title="$t('sercurity.dictItem.index.form.itemText')" data-index="itemText" width="130" ellipsis="true"
                                    tooltip="true"/>
                    <a-table-column :title="$t('sercurity.dictItem.index.form.itemCode')" data-index="itemCode" width="130" ellipsis="true" tooltip="true"/>
                    <a-table-column :title="$t('sercurity.dictItem.index.form.seqNo')" data-index="seqNo" width="90"/>
                    <a-table-column :title="$t('sercurity.dictItem.index.form.enableStatus')" data-index="enableStatus" width="90">
                      <template #cell="{ record }">
                        {{ $t(`sercurity.dictItem.index.form.enableStatus.${record.enableStatus}`) }}
                      </template>
                    </a-table-column>
                    <a-table-column :title="$t('sercurity.dictItem.index.form.createAt')" data-index="createAt" width="170"/>
                    <a-table-column :title="$t('sercurity.dictItem.index.form.operations')" data-index="operations" :width="220" align="center" fixed="right">
                      <template #cell="{ record }">
                        <a-button v-permission="['admin']" type="text" size="small" @click="viewTable(record.id)">
                          {{ $t('searchTable.columns.operations.view') }}
                        </a-button>
                        <a-button v-permission="['admin']" type="text" size="small" @click="editTable(record.id)">
                          {{ $t('searchTable.columns.operations.edit') }}
                        </a-button>
                        <a-popconfirm :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning" @ok="deleteTable(record.id)">
                          <a-button v-permission="['admin']" type="text" size="small">
                            {{ $t('searchTable.columns.operations.delete') }}
                          </a-button>
                        </a-popconfirm>
                      </template>
                    </a-table-column>
                  </template>
                </a-table>
              </a-card>
              <DictItemForm ref="dictItemFormRef"></DictItemForm>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, reactive, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {Modal, Notification} from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {
  createOrUpdateDict,
  deleteDict,
  deleteDictItem,
  getDict,
  pageQueryDictItem,
  PageQueryFilter,
  PageQueryRequest,
  QueryDictForm,
  queryDicts
} from '@/api/sercurity_service'
import {columns, enableStatusOptions} from "@/views/security/dict/item/searchTable";
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import DictItemForm from './item/form.vue'

type Column = TableColumnData & { checked?: true };
const {loading, setLoading} = useLoading(true);
const {t} = useI18n();
/* 字典列表 */
const listData = ref<QueryDictForm[]>([]);
const scrollbar = ref(true);
const generateCardData = () => {
  return {dicName: '', currentDictName: t('sercurity.dictItem.index.menu.list.searchTable'), tabKey: '1'}
}
const cardData = ref(generateCardData());
/* 字典表单 */
const generateFormData = (): QueryDictForm => {
  return {id: '', tenantCode: '', dicName: '', dicCode: '', dicRemark: '', enableStatus: 1, seqNo: 999};
}
const formData = ref(generateFormData());
/* 字典项列表 */
const generateFilterData = () => {
  return {id: '', dictId: '', itemText: '', itemCode: '', enableStatus: '', createAt: []};
};
const renderData = ref<PageQueryFilter[]>([]);
const filterData = ref(generateFilterData());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: 1, pageSize: 5};
const pagination = reactive({...basePagination,});
const dictItemFormRef = ref(null);

/* 字典列表 */
const queryDictList = async (dicName: string, successBack?: any) => {
  setLoading(true);
  try {
    const {data} = await queryDicts(dicName);
    listData.value = data;
    successBack();
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
queryDictList('');

const selectedActive = (id?: string) => {
  const list = document.getElementsByClassName("list-item1");
  for (let i = 0; i < list.length; i += 1) {
    let classVal = list[i].className;
    if (list[i].id === id) {
      classVal = classVal.concat(" active");
    } else {
      classVal = classVal.replace("active", "");
    }
    list[i].setAttribute("class", classVal);
  }
}
/**
 * 新增字典
 */
const addDict = () => {
  // 基础信息清空、页面信息复原、重置字典项、跳至基本信息
  formData.value = generateFormData();
  cardData.value = generateCardData();
  cardData.value.tabKey = '1';
  selectedActive();
  reset();
}
const refreshDict = () => {
  // 基础信息清空、页面信息复原、重置字典项、重置字典
  formData.value = generateFormData();
  cardData.value = generateCardData();
  selectedActive();
  queryDictList('');
  reset();
}
const selectedList = (id: string) => {
  getData(id, function (data: QueryDictForm) {
    // 基本信息
    data.seqNo = Number(data.seqNo);
    formData.value = data;
    selectedActive(data.id);
    // 页面信息
    cardData.value.dicName = data.dicName;
    cardData.value.currentDictName = data.dicName;
    // 重置字典项
    reset();
  });
}

const tabsChange = (key: string) => {
  cardData.value.tabKey = key;
}
/* 字典表单 */
const createOrUpdateData = async (params: QueryDictForm, successBack: any) => {
  try {
    const {data} = await createOrUpdateDict(params);
    successBack(data);
  } catch (err) {
    console.log(err);
  }
};
const getData = async (id: string, successBack: any) => {
  try {
    const {data} = await getDict(id);
    successBack(data);
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async (id: string, successBack: any) => {
  try {
    const {data} = await deleteDict(id);
    successBack();
  } catch (err) {
    console.log(err);
  }
};

const saveForm = () => {
  createOrUpdateData(formData.value, (data: QueryDictForm) => {
    // 成功提示、复写数据、重置字典、设置页面信息、重置字典项
    Notification.info(t('sercurity.dict.index.notice.success'));
    data.seqNo = Number(data.seqNo);
    formData.value = data;
    queryDictList('', () => {
      const saveSuccess = setTimeout(() => {
        selectedActive(data.id);
        // 页面信息
        cardData.value.dicName = data.dicName;
        cardData.value.currentDictName = data.dicName;
        reset();
      }, 250);
    });
  });
}
const deleteForm = () => {
  const formId = formData.value.id;
  if (formId && formId.trim().length > 0) {
    Modal.open({
      title: t('sercurity.dict.index.modal.title'),
      titleAlign: 'start',
      content: t('sercurity.dict.index.modal.content'),
      cancelText: t('sercurity.dict.index.modal.cancel.text'),
      okText: t('sercurity.dict.index.modal.ok.text'), onOk() {
        deleteData(formId, function () {
          refreshDict();
        });
      }
    });
  } else {
    Notification.warning(t('sercurity.dict.index.notice.warning1'));
  }
}
/* 字典项列表 */
const fetchData = async (params: PageQueryRequest = {current: 1, pageSize: 5}) => {
  setLoading(true);
  try {
    const {data} = await pageQueryDictItem(params);
    renderData.value = data.items;
    pagination.current = params.current;
    pagination.total = data.total;
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
const search = () => {
  // 关联 字典
  filterData.value.dictId = formData.value.id;
  // 分页查询
  fetchData({
    ...basePagination,
    ...filterData.value,
  } as unknown as PageQueryRequest);
};
const reset = () => {
  filterData.value = generateFilterData();
  search();
};
/* 获取列表数据 */
fetchData();
const onPageChange = (current: number) => {
  fetchData({...basePagination, current});
};
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


/* 列表，按钮、操作列 */
const addTable = () => {
  if (dictItemFormRef.value) {
    const formId = formData.value.id;
    if (formId && formId.trim().length > 0) {
      dictItemFormRef.value?.openForm('add', null, () => {
        Notification.info(t('sercurity.dict.index.notice.success'));
        reset();
      }, formId);
    } else {
      Notification.warning(t('sercurity.dict.index.notice.warning2'));
    }
  }
};
const viewTable = (id: string) => {
  if (dictItemFormRef.value) {
    dictItemFormRef.value?.openForm('view', id);
  }
}
const editTable = (id: string) => {
  if (dictItemFormRef.value) {
    dictItemFormRef.value?.openForm('edit', id, () => {
      Notification.info(t('sercurity.dict.index.notice.success'));
      reset();
    });
  }
}
const deleteTable = (id: string) => {
  deleteItemData(id, function () {
    Notification.info(t('sercurity.dict.index.notice.success'));
    reset();
  });
}
const deleteItemData = async (id: string, successBack: any) => {
  try {
    const {data} = await deleteDictItem(id);
    successBack();
  } catch (err) {
    console.log(err);
  }
};
</script>

<script lang="ts">
export default {
  name: 'SearchTable',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.general-card1 .list-item1 {
  cursor: pointer;
  padding: 10px 10px !important;
}

.general-card1 .list-item1.active {
  background-color: var(--color-fill-3);
  color: rgb(var(--primary-6));
}

.arco-btn {
  border-radius: 6px;
}

.arco-btn-size-medium {
  /* padding: 0 8px; */
}

.general-card > .arco-tabs-content {
  padding: 10px 0px 0px 10px;
}

.general-card1 > .arco-card-body > .arco-row:first-child {
  height: auto;
  padding: 20px;
  border: none;
}

.general-card1 > .arco-card-body > .arco-row > .arco-col > .arco-spin {
  flex: 1;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5715;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}


.form {
  width: 500px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);
}
</style>
