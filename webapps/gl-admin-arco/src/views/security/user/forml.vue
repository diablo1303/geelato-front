<template>
  <a-card v-model="cardForm" class="general-card general-card1">
    <a-modal
        v-model:visible="visibleModel"
        width="80%"
        :title="$t(`${cardForm.title}`)"
        :footer="cardForm.button"
        :cancel-text="$t(`${cardForm.cancelText}`)"
        :ok-text="$t('sercurity.user.index.model.ok.text')"
        @cancel="handleModelCancel"
        @before-ok="handleModelOk">
      <div class="container">
        <a-row>
          <a-col :span="24">
            <a-tabs :default-active-tab="1" type="rounded" :position="'left'">
              <a-tab-pane key="1" :title="$t('sercurity.user.forml.tab.title.one')">
                <a-form :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                  <a-row :gutter="16">
                    <a-col :span="24">
                      <a-form-item v-show="false">
                        <a-input v-show="false" v-model="formData.id"/>
                        <a-input v-show="false" v-model="formData.salt"/>
                        <a-input v-show="false" v-model="formData.avatar"/>
                        <a-input v-show="false" v-model="formData.password"/>
                        <a-input v-show="false" v-model="formData.plainPassword"/>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="name" :label="$t('sercurity.user.index.form.name')">
                        <a-input v-if="cardForm.button" v-model="formData.name" :max-length="32"/>
                        <a-span v-else>{{ formData.name }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="loginName" :label="$t('sercurity.user.index.form.loginName')">
                        <a-input v-if="cardForm.button" v-model="formData.loginName" :max-length="32"/>
                        <a-span v-else>{{ formData.loginName }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="orgId" :label="$t('sercurity.user.index.form.orgName')">
                        <a-cascader v-if="cardForm.button" v-model="formData.orgId" :options="orgSelectOptions" check-strictly/>
                        <a-span v-else>{{ formData.orgName }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="sex" :label="$t('sercurity.user.index.form.sex')">
                        <a-select v-if="cardForm.button" v-model="formData.sex">
                          <a-option v-for="item of sexOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
                        </a-select>
                        <a-span v-else>{{ $t(`sercurity.user.index.form.sex.${formData.sex}`) }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="mobilePhone" :label="$t('sercurity.user.index.form.mobilePhone')">
                        <a-input v-if="cardForm.button" v-model="formData.mobilePhone" :max-length="32"/>
                        <a-span v-else>{{ formData.mobilePhone }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="telephone" :label="$t('sercurity.user.index.form.telephone')">
                        <a-input v-if="cardForm.button" v-model="formData.telephone" :max-length="32"/>
                        <a-span v-else>{{ formData.telephone }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="email" :label="$t('sercurity.user.index.form.email')">
                        <a-input v-if="cardForm.button" v-model="formData.email" :max-length="32"/>
                        <a-span v-else>{{ formData.email }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="post" :label="$t('sercurity.user.index.form.post')">
                        <a-input v-if="cardForm.button" v-model="formData.post" :max-length="32"/>
                        <a-span v-else>{{ formData.post }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="provinceCode" :label="$t('sercurity.user.index.form.provinceCode')">
                        <a-input v-if="cardForm.button" v-model="formData.provinceCode" :max-length="32"/>
                        <a-span v-else>{{ formData.provinceCode }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="cityCode" :label="$t('sercurity.user.index.form.cityCode')">
                        <a-input v-if="cardForm.button" v-model="formData.cityCode" :max-length="32"/>
                        <a-span v-else>{{ formData.cityCode }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="type" :label="$t('sercurity.user.index.form.type')">
                        <a-select v-if="cardForm.button" v-model="formData.type">
                          <a-option v-for="item of typeOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
                        </a-select>
                        <a-span v-else>{{ $t(`sercurity.user.index.form.type.${formData.type}`) }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="source" :label="$t('sercurity.user.index.form.source')">
                        <a-select v-if="cardForm.button" v-model="formData.source">
                          <a-option v-for="item of sourceOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
                        </a-select>
                        <a-span v-else>{{ $t(`sercurity.user.index.form.source.${formData.source}`) }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="seqNo" :label="$t('sercurity.user.index.form.seqNo')">
                        <a-input-number v-if="cardForm.button" v-model="formData.seqNo" :precision="0" :max="999999" :min="1" placeholder="length[1,999999]"/>
                        <a-span v-else>{{ formData.seqNo }}</a-span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="24">
                      <a-form-item field="description" :label="$t('sercurity.user.index.form.description')"
                                   :label-col-props="{ span: 3 }" :wrapper-col-props="{ span: 21 }">
                        <a-textarea v-if="cardForm.button" v-model="formData.description" :max-length="512" :auto-size="{minRows:3,maxRows:6}"
                                    show-word-limit/>
                        <a-span v-else :title="formData.description" @click="openModal(`${formData.description}`)">{{ formData.description }}</a-span>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
              </a-tab-pane>
              <a-tab-pane key="2" :title="$t('sercurity.user.forml.tab.title.two')">
                <a-card class="general-card">
                  <a-row>
                    <a-col :flex="1">
                      <a-form :model="filterData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
                        <a-row :gutter="16">
                          <a-col v-show="false" :span="24">
                            <a-form-item v-show="false">
                              <a-input v-show="false" v-model="filterData.userId"/>
                            </a-form-item>
                          </a-col>
                          <a-col :span="12">
                            <a-form-item field="userName" :label="$t('sercurity.orgUser.index.form.userName')">
                              <a-input v-model="filterData.userName" :readonly="true"/>
                            </a-form-item>
                          </a-col>
                          <a-col :span="12">
                            <a-form-item field="orgName" :label="$t('sercurity.orgUser.index.form.orgName')">
                              <a-input v-model="filterData.orgName"/>
                            </a-form-item>
                          </a-col>
                          <a-col :span="12">
                            <a-form-item field="createAt" :label="$t('sercurity.orgUser.index.form.createAt')">
                              <a-range-picker v-model="filterData.createAt" style="width: 100%"/>
                            </a-form-item>
                          </a-col>
                          <a-col :span="12">
                            <a-form-item field="defaultOrg" :label="$t('sercurity.orgUser.index.form.defaultOrg')">
                              <a-select v-model="filterData.defaultOrg" :placeholder="$t('searchTable.form.selectDefault')">
                                <a-option v-for="item of defaultOrgOptions" :key="item.value" :value="item.value" :label="$t(`${item.label}`)"/>
                              </a-select>
                            </a-form-item>
                          </a-col>
                        </a-row>
                      </a-form>
                    </a-col>
                    <a-divider style="height: 84px" direction="vertical"/>
                    <a-col :flex="'86px'" style="text-align: right">
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
                        <a-button v-show="cardForm.button" type="primary" @click="addTable">
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
                      <a-table-column :title="$t('sercurity.orgUser.index.form.index')" data-index="index" width="80" align="center">
                        <template #cell="{  rowIndex }">{{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}</template>
                      </a-table-column>
                      <a-table-column :title="$t('sercurity.orgUser.index.form.orgName')" data-index="orgName" width="150" ellipsis="true" tooltip="true"/>
                      <a-table-column :title="$t('sercurity.orgUser.index.form.userName')" data-index="userName" width="150" ellipsis="true" tooltip="true"/>
                      <a-table-column :title="$t('sercurity.orgUser.index.form.defaultOrg')" data-index="defaultOrg" width="120">
                        <template #cell="{ record }">
                          {{ $t(`sercurity.orgUser.index.form.defaultOrg.${record.defaultOrg}`) }}
                        </template>
                      </a-table-column>
                      <a-table-column :title="$t('sercurity.orgUser.index.form.createAt')" data-index="createAt" width="180"/>
                      <a-table-column v-if="cardForm.button" :title="$t('sercurity.orgUser.index.form.operations')" data-index="operations" width="100"
                                      align="center" fixed="right">
                        <template #cell="{ record }">
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
                <OrgUserForm ref="orgUserFormRef"></OrgUserForm>
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </a-card>
</template>

<script lang="ts" setup>
import {nextTick, reactive, ref, watch} from 'vue';
import useLoading from '@/hooks/loading';
import {Modal} from "@arco-design/web-vue";
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {
  createOrUpdateUser,
  deleteOrgUser,
  getUser,
  PageQueryFilter,
  pageQueryOrgUser,
  PageQueryRequest,
  QueryOrgForm,
  queryOrgs,
  QueryUserForm,
  SelectOption
} from '@/api/sercurity_service'
import {sexOptions, sourceOptions, typeOptions} from "@/views/security/user/searchTable";
import {columns, defaultOrgOptions} from '@/views/security/user/org/searchTable'
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import OrgUserForm from './org/form.vue';

type Column = TableColumnData & { checked?: true };
/* 列表 */
const generateFilterData = () => {
  return {id: '', orgName: '', userId: '', userName: '', defaultOrg: '', createAt: []};
};
const {loading, setLoading} = useLoading(true);
const renderData = ref<PageQueryFilter[]>([]);
const filterData = ref(generateFilterData());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: 1, pageSize: 4};
const pagination = reactive({...basePagination,});
const orgUserFormRef = ref(null);

/* 表单 */
const generateFormData = (): QueryUserForm => {
  return {
    id: '',
    name: '',
    loginName: '',
    seqNo: 999,
    sex: 0,
    salt: '',
    avatar: '',
    password: '',
    plainPassword: '',
    mobilePhone: '',
    telephone: '',
    orgId: '',
    orgName: '',
    email: '',
    post: '',
    provinceCode: '',
    cityCode: '',
    type: 0,
    source: 0,
    description: ''
  };
}
const visibleModel = ref(false);
const formData = ref(generateFormData());
const orgSelectOptions = ref<SelectOption[]>([]);
const cardForm = ref({action: 'add', title: '', cancelText: '', button: true});
// 页面响应
let okSuccessBack: any;

const buildOrgOptions = (defaultData: SelectOption[], totalData: QueryOrgForm[]): SelectOption[] => {
  // eslint-disable-next-line no-restricted-syntax
  for (const data of defaultData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of totalData) {
      if (item.pid === data.value) {
        data.children.push({value: item.id, label: item.name, children: []});
      }
    }
    if (data.children.length > 0) {
      buildOrgOptions(data.children, totalData);
    } else {
      delete data.children;
    }
  }

  return defaultData;
}
const getOrgOptions = async () => {
  try {
    const {data} = await queryOrgs();
    orgSelectOptions.value = buildOrgOptions([{value: '0', label: '根目录', children: []}], data);
    orgSelectOptions.value = orgSelectOptions.value[0].children;
  } catch (err) {
    console.log(err);
  }
}

const createOrUpdateData = async (params: QueryUserForm, done: any) => {
  try {
    const {data} = await createOrUpdateUser(params);
    done();
    okSuccessBack();
  } catch (err) {
    console.log(err);
  }
};
const getData = async (id: string, successBack: any) => {
  try {
    const {data} = await getUser(id);
    successBack(data);
  } catch (err) {
    console.log(err);
  }
};

const openForm = (action: string, id: string, okBack?: any) => {
  getOrgOptions();
  if (action === "add") {
    formData.value = generateFormData();
    cardForm.value = {action: 'add', title: 'sercurity.user.index.model.title.add', cancelText: 'sercurity.user.index.model.cancel.text', button: true};
    visibleModel.value = true;
  } else {
    formData.value = generateFormData();
    if (action === "edit") {
      cardForm.value = {action: 'edit', title: 'sercurity.user.index.model.title.edit', cancelText: 'sercurity.user.index.model.cancel.text', button: true};
    } else {
      cardForm.value = {action: 'view', title: 'sercurity.user.index.model.title.view', cancelText: 'sercurity.user.index.model.close.text', button: false};
    }
    getData(id, function (data: QueryUserForm) {
      data.seqNo = Number(data.seqNo);
      formData.value = data;
      reset();
      visibleModel.value = true;
    });
  }

  okSuccessBack = okBack || null;
}

/* 表单 */
const handleModelOk = (done: any) => {
  createOrUpdateData(formData.value, done);
};
const handleModelCancel = () => {
  visibleModel.value = false;
}

const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}


/* 列表 */
const fetchData = async (params: PageQueryRequest = {current: 1, pageSize: 4}) => {
  setLoading(true);
  try {
    const {data} = await pageQueryOrgUser(params);
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
  fetchData({
    ...basePagination,
    ...filterData.value,
  } as unknown as PageQueryRequest);
};
const reset = () => {
  filterData.value = generateFilterData();
  filterData.value.userId = formData.value.id;
  filterData.value.userName = formData.value.name;
  search();
};
const onPageChange = (current: number) => {
  // fetchData({...basePagination, current});
  basePagination.current = current;
  search();
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
  if (orgUserFormRef.value) {
    orgUserFormRef.value?.openForm('add', null, reset, formData.value);
  }
};
const deleteTable = (id: string) => {
  deleteData(id, function () {
    reset();
  });
}
const deleteData = async (id: string, successBack: any) => {
  try {
    const {data} = await deleteOrgUser(id);
    successBack();
  } catch (err) {
    console.log(err);
  }
};

// 将方法暴露出去
defineExpose({openForm});
</script>

<script lang="ts">
export default {
  name: 'SearchTable',
};
</script>

<style scoped lang="less">


</style>
