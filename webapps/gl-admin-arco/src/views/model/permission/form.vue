<template v-model="pageData">
  <a-row style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button type="primary" @click="addTableRole($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('model.permission.index.model.role.add') }}
        </a-button>
        <a-button type="primary" @click="addTablePermission($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('model.permission.index.model.permission.add') }}
        </a-button>
        <a-button type="primary" @click="resetTableDefaultPermission($event)">
          <template #icon>
            <icon-undo/>
          </template>
          {{ $t('model.permission.index.model.permission.reset') }}
        </a-button>
      </a-space>
    </a-col>
    <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
      <a-space>
        <a-button type="primary" @click="tableRefresh($event)">
          <template #icon>
            <icon-refresh/>
          </template>
          {{ $t('model.permission.index.model.refresh') }}
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-divider style="margin-top: 0"/>
  <a-table
      :bordered="{cell:true}"
      :data="renderData"
      :loading="loading"
      :pagination="false"

      :stripe="true"
      column-resizable
      row-key="id">
    <template #columns>
      <a-table-column :ellipsis="true" :title="$t('model.permission.index.list.role')" :tooltip="false" :width="150" data-index="name" fixed="left">
        <template #cell="{record}">
          <a-popover :title="record.name" position="right" style="max-width: 300px">
            <span style="cursor: pointer;">{{ record.name }}</span>
            <template #content>
                    <span>
                      <strong>{{ $t('security.role.index.form.code') }}：</strong>
                      {{ record.code }}
                      <a-button :title="$t('copy.to.clipboard.button.title')" type="text" @click="tableRolePermissionCopy(record.code)">
                        <template #icon>
                          <icon-copy/>
                        </template>
                      </a-button>
                    </span>
              <br/>
              <span>
                      <strong>{{ $t('security.role.index.form.type') }}：</strong>
                      {{ $t(`security.role.index.form.type.${record.type}`) }}
                    </span>
              <br/>
              <strong v-if="['app'].includes(record.type)">{{ $t('security.roleApp.index.form.appName') }}：</strong>
              <span v-if="record.appName&&['app'].includes(record.type)">{{ record.appName }}</span>
              <br v-if="['app'].includes(record.type)"/>
              <span :title="record.description" class="span-textarea">
                      <strong>{{ $t('security.role.index.form.description') }}：</strong>
                      {{ record.description }}
                    </span>
              <a-divider v-if="pageData.formState==='edit'" style="margin: 5px 0px"/>
              <a-space v-if="pageData.formState==='edit'" style="display: flex;align-items: center;justify-content: end;">
                <a-button size="mini" type="primary" @click="editTableRole(record.id)">
                  {{ $t('searchTable.columns.operations.edit') }}
                </a-button>
                <a-popconfirm :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning" @ok="deleteTableRole(record.id)">
                  <a-button size="mini" status="danger" type="primary">
                    {{ $t('searchTable.columns.operations.delete') }}
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-popover>
        </template>
      </a-table-column>
      <a-table-column v-for="item of cowColumns" :key="item.id" :data-index="item.id" :ellipsis="true" :tooltip="true" :width="120" align="center">
        <template #title>
          <a-popover :title="item.name" position="br" style="max-width: 300px">
            <span style="cursor: pointer;">{{ item.name }}</span>
            <template #content>
                    <span>
                      <strong>{{ $t('security.permission.index.form.code') }}：</strong>
                      {{ item.code }}
                      <a-button :title="$t('copy.to.clipboard.button.title')" type="text" @click="tableRolePermissionCopy(item.code)">
                        <template #icon>
                          <icon-copy/>
                        </template>
                      </a-button>
                    </span>
              <br/>
              <span>
                      <strong>{{ $t('security.permission.index.form.type') }}：</strong>
                      {{ $t(`security.permission.index.form.type.${item.type}`) }}
                    </span>
              <br/>
              <span>
                      <strong>{{ $t('security.permission.index.form.object') }}：</strong>
                      {{ item.object }}
                    </span>
              <br/>
              <span :title="item.rule" class="span-textarea">
                      <strong>{{ $t('security.permission.index.form.rule') }}：</strong>
                      {{ item.rule }}
                    </span>
              <span :title="item.description" class="span-textarea">
                      <strong>{{ $t('security.permission.index.form.description') }}：</strong>
                      {{ item.description }}
                    </span>
              <a-divider v-if="!item.default&&pageData.formState==='edit'" style="margin: 5px 0px"/>
              <a-space v-if="!item.default&&pageData.formState==='edit'" style="display: flex;align-items: center;justify-content: end;">
                <a-button size="mini" type="primary" @click="editTablePermission(item.id)">
                  {{ $t('searchTable.columns.operations.edit') }}
                </a-button>
                <a-popconfirm :content="$t('searchTable.columns.operations.deleteMsg')" position="tr" type="warning" @ok="deleteTablePermission(item.id)">
                  <a-button size="mini" status="danger" type="primary">
                    {{ $t('searchTable.columns.operations.delete') }}
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-popover>
        </template>
        <template #cell="{record}">
          <a-switch v-model="record[item.id]" :before-change="newValue => switchBeforeChange(item.id,record.id)">
            <template #checked>
              YES
            </template>
            <template #unchecked>
              NO
            </template>
          </a-switch>
        </template>
      </a-table-column>
    </template>
  </a-table>
  <RoleDrawer ref="roleDrawerRef"></RoleDrawer>
  <RoleTabForm ref="roleTabFormRef"></RoleTabForm>
  <PermissionForm ref="permissionFormRef"></PermissionForm>
</template>

<script lang="ts" setup>
/* 导入 */
import {reactive, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import useLoading from '@/hooks/loading';
// 分页列表
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue';
// 引用其他对象、方法
import {ListUrlParams, PageQueryRequest} from '@/api/base';
import {
  deletePermission,
  deleteRole,
  insertTableRolePermission,
  QueryPermissionForm,
  QueryRoleForm,
  QueryRolePermissionForm,
  queryTableRolePermissions,
  resetDefaultPermission
} from "@/api/security";
import {QueryViewForm as QueryForm} from "@/api/model";
import RoleDrawer from "@/views/security/role/drawer.vue";
import PermissionForm from "@/views/security/permission/form.vue";
import RoleTabForm from "@/views/security/role/tabForm.vue";
import {copyToClipboard} from "@/utils/strings";
// 引用其他页面

/* 列表 */
const route = useRoute();
type Column = TableColumnData & { checked?: true };
const scrollbar = ref(true);
const scroll = {y: "100%"};
const pageData = ref({
  current: 1, pageSize: 10000, formState: 'edit', isModal: false,
  params: {connectId: '', object: '', type: ''},
  appId: (route.params && route.params.appId as string) || '',
  tenantCode: (route.params && route.params.tenantCode as string) || '',
  modalAddBack: (data: QueryForm) => {
  }, modalEditBack: (data: QueryForm) => {
  }, modalDeleteBack: (id: string) => {
  }
});
const roleDrawerRef = ref(null);
const roleTabFormRef = ref(null);
const permissionFormRef = ref(null);
// 国际化
const {t} = useI18n();
// 加载
const {loading, setLoading} = useLoading(true);
// 分页列表参数
const cloneColumns = ref<Column[]>([]);
const rowColumns = ref<QueryRoleForm[]>([]);
const cowColumns = ref<QueryPermissionForm[]>([]);
const basePagination: Pagination = {current: pageData.value.current, pageSize: pageData.value.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<Record<string, boolean | string>[]>([]);

/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest = {current: pageData.value.current, pageSize: pageData.value.pageSize}) => {
  setLoading(true);
  try {
    // @ts-ignore
    params.appId = pageData.value.appId;
    // @ts-ignore
    params.tenantCode = pageData.value.tenantCode;
    const {data} = await queryTableRolePermissions(pageData.value.params.type, pageData.value.params.object, params);
    cowColumns.value = data.permission;
    rowColumns.value = data.role;
    renderData.value = data.table;
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

const tableRefresh = (ev?: Event) => {
  fetchData();
};
const tableRolePermissionCopy = (text: string) => {
  copyToClipboard(text, t('copy.to.clipboard.success'), t('copy.to.clipboard.fail'));
}
const addTableRole = (ev: MouseEvent) => {
  if (roleDrawerRef.value) {
    // @ts-ignore
    roleDrawerRef.value?.openForm({action: 'add', params: {type: 'app', appId: pageData.value.appId}, closeBack: tableRefresh});
  }
};
const editTableRole = (id: string) => {
  if (roleTabFormRef.value) {
    // @ts-ignore
    roleTabFormRef.value?.openForm({
      action: 'edit',
      'id': id,
      pageSize: 5,
      isModal: true,
      params: {type: 'app', appId: pageData.value.appId},
      closeBack: tableRefresh
    });
  }
}
const deleteTableRole = async (id: string) => {
  try {
    await deleteRole(id);
    tableRefresh();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const addTablePermission = (ev: MouseEvent) => {
  if (permissionFormRef.value) {
    // @ts-ignore
    permissionFormRef.value?.openForm({
      action: 'add',
      params: {type: pageData.value.params.type, object: pageData.value.params.object},
      closeBack: tableRefresh
    });
  }
}
const editTablePermission = (id: string) => {
  if (permissionFormRef.value) {
    // @ts-ignore
    permissionFormRef.value?.openForm({
      action: 'edit',
      'id': id,
      params: {type: pageData.value.params.type, object: pageData.value.params.object},
      closeBack: tableRefresh
    });
  }
}
const deleteTablePermission = async (id: string) => {
  try {
    await deletePermission(id);
    tableRefresh();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const resetTableDefaultPermission = async (ev: MouseEvent) => {
  try {
    await resetDefaultPermission(pageData.value.params.type, pageData.value.params.object);
    tableRefresh();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const switchBeforeChange = async (permission: string, role: string) => {
  let isSuccess = false;
  try {
    await insertTableRolePermission({
      permissionId: permission,
      roleId: role,
      tenantCode: pageData.value.tenantCode
    } as QueryRolePermissionForm);
    isSuccess = true;
  } catch (err) {
    console.log(err);
  }

  return isSuccess;
}

/* 对外调用方法 */
const loadList = (urlParams: ListUrlParams) => {
  // 参数设置
  pageData.value.formState = urlParams.action || 'edit';
  pageData.value.isModal = urlParams.isModal || false;
  pageData.value.params.connectId = urlParams.params?.pId || '';
  pageData.value.params.object = urlParams.params?.pName || '';
  pageData.value.params.type = urlParams.params?.pType || '';
  basePagination.pageSize = urlParams.pageSize || pageData.value.pageSize;
  // 方法反馈 新增、编辑、删除
  pageData.value.modalAddBack = urlParams.modalAddBack ? urlParams.modalAddBack : pageData.value.modalAddBack;
  pageData.value.modalEditBack = urlParams.modalEditBack ? urlParams.modalEditBack : pageData.value.modalEditBack;
  pageData.value.modalDeleteBack = urlParams.modalDeleteBack ? urlParams.modalDeleteBack : pageData.value.modalDeleteBack;

  fetchData();
}

// 将方法暴露出去
defineExpose({loadList});
</script>
<style lang="less" scoped>
.span-textarea {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.general-card > .arco-card-body {
  padding: 0px 10px 10px 10px;
}
</style>