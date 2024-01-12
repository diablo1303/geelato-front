<template v-model="pageData">
  <a-row style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button type="primary" @click="addTableRole($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('model.table.permission.index.model.role.add') }}
        </a-button>
        <a-button type="primary" @click="addTablePermission($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('model.table.permission.index.model.permission.add') }}
        </a-button>
        <a-button type="primary" @click="resetTableDefaultPermission($event)">
          <template #icon>
            <icon-undo/>
          </template>
          {{ $t('model.table.permission.index.model.permission.reset') }}
        </a-button>
      </a-space>
    </a-col>
    <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
      <a-space>
        <a-button type="primary" @click="tableRefresh($event)">
          <template #icon>
            <icon-refresh/>
          </template>
          {{ $t('model.table.permission.index.model.refresh') }}
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
      <a-table-column :ellipsis="true" :title="$t('model.table.permission.index.list.role')" :tooltip="false" :width="150" data-index="name" fixed="left">
        <template #cell="{record}">
          <a-popover :title="record.name" position="right" style="max-width: 300px">
            <span style="cursor: pointer;">{{ record.name }} <icon-info-circle/></span>
            <template #content>
                    <span>
                      <strong>{{ $t('security.role.index.form.code') }}：</strong>
                      {{ record.code }}
                      <CopyToClipboard v-model="record.code" :title="$t('copy.to.clipboard.button.code.title')"/>
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
      <a-table-column v-for="(nape,index) of cowColumns" :key="index" :title="$t(`security.permission.index.form.classify.${nape.type}`)">
        <a-table-column v-for="item of nape.data" :key="item.id" :data-index="item.id" :ellipsis="true" :tooltip="true" :width="120" align="center">
          <template #title>
            <a-popover :title="item.name" position="br" style="max-width: 300px">
              <span style="cursor: pointer;">{{ item.name }} <icon-info-circle/></span>
              <template #content>
                    <span>
                      <strong>{{ $t('security.permission.index.form.code') }}：</strong>
                      {{ item.code }}
                      <CopyToClipboard v-model="item.code" :title="$t('copy.to.clipboard.button.code.title')"/>
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
            <a-switch v-model="record[item.id]" :checked-color="nape.type==='custom'?'rgb(0,180,42)':nape.type==='view'?'rgb(20,201,201)':''"
                      :before-change="newValue => switchBeforeChange(item.id,record.id)">
              <template #checked>
                YES
              </template>
              <template #unchecked>
                NO
              </template>
            </a-switch>
          </template>
        </a-table-column>
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
  insertTableRoleViewPermission,
  QueryPermissionClassifyForm,
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
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";
// 引用其他页面

/* 列表 */
const route = useRoute();
const routeParams = ref({
  appId: (route && route.params && route.params.appId as string) || '',
  tenantCode: (route && route.params && route.params.tenantCode as string) || ''
});
type Column = TableColumnData & { checked?: true };
const scrollbar = ref(true);
const scroll = {y: "100%"};
const pageData = ref({
  current: 1, pageSize: 10000, formState: 'edit', isModal: false,
  params: {connectId: '', object: '', type: ''},
  modalAddBack: (data: QueryForm) => {
    console.log(data);
  }, modalEditBack: (data: QueryForm) => {
    console.log(data);
  }, modalDeleteBack: (id: string) => {
    console.log(id);
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
const cowColumns = ref<QueryPermissionClassifyForm[]>([]);
const basePagination: Pagination = {current: pageData.value.current, pageSize: pageData.value.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<Record<string, boolean | string>[]>([]);
const viewTypes = ["&all", "&myBusiness", "&myDept", "&myself"];
const viewPers = ref<QueryPermissionForm[]>([]);
const viewPerIds = ref<string[]>([]);

const setViewPermissions = () => {
  viewPers.value = [];
  viewPerIds.value = [];
  if (cowColumns.value && cowColumns.value.length > 0) {
    for (let i = 0; i < cowColumns.value.length; i += 1) {
      if (cowColumns.value[i].type === "view" && cowColumns.value[i].data && cowColumns.value[i].data.length > 0) {
        for (let v = 0; v < viewTypes.length; v += 1) {
          for (let p = 0; p < cowColumns.value[i].data.length; p += 1) {
            if (`${pageData.value.params.object}${viewTypes[v]}` === cowColumns.value[i].data[p].code) {
              viewPers.value.push(cowColumns.value[i].data[p]);
              viewPerIds.value.push(cowColumns.value[i].data[p].id);
              break;
            }
          }
        }
        break;
      }
    }
  }
}

const permissionFilter = (qpcf: QueryPermissionClassifyForm[]) => {
  const data: QueryPermissionClassifyForm[] = [];
  if (qpcf && qpcf.length > 0) {
    for (let i = 0; i < qpcf.length; i += 1) {
      if (qpcf[i].type && qpcf[i].data && qpcf[i].data.length > 0) {
        data.push(qpcf[i]);
      }
    }
  }
  return data;
}

const setRolePermissions = (item: Record<string, boolean | string>, currentPer: string) => {
  let isCurrent = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const id of viewPerIds.value) {
    if (!isCurrent && id === currentPer) {
      isCurrent = true;
      // eslint-disable-next-line no-continue
      continue;
    }
    (item[id] as unknown as boolean) = isCurrent;
  }
}

const validateTableData = async (tableData: Record<string, boolean | string>[]) => {
  if (tableData && tableData.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of tableData) {
      let isTrue = 0;// 几个选中
      let currentPer = "";// 最大的权限id
      // eslint-disable-next-line no-restricted-syntax
      for (const id of viewPerIds.value) {
        if ((item[id] as unknown as boolean) === true) {
          if (isTrue === 0) currentPer = id;
          isTrue += 1;
        }
      }
      // 检查
      if (isTrue > 1) {
        // eslint-disable-next-line no-await-in-loop
        await insertTableRoleViewPermission({
          permissionId: currentPer, roleId: item.id, tenantCode: routeParams.value.tenantCode,
          permissionIds: viewPerIds.value.join(",")
        } as QueryRolePermissionForm);
        setRolePermissions(item, currentPer);
      } else if (isTrue === 1) {
        setRolePermissions(item, currentPer);
      }
    }
  }
}

const resetTableData = (permissionId: string, roleId: string) => {
  if (renderData.value && renderData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of renderData.value) {
      // @ts-ignore
      if (item.id === roleId && viewPerIds.value.includes(permissionId)) {
        let getTrue = false;
        // eslint-disable-next-line no-restricted-syntax
        for (const id of viewPerIds.value) {
          if (!getTrue && id === permissionId) {
            getTrue = true;
            // eslint-disable-next-line no-continue
            continue;
          }
          if (item[permissionId] === false) {
            (item[id] as unknown as boolean) = getTrue;
          } else if (!getTrue) {
            (item[id] as unknown as boolean) = false;
          }
        }
        break;
      }
    }
  }
}

const needAddPermissionId = (permissionId: string, roleId: string): string => {
  if (renderData.value && renderData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of renderData.value) {
      // @ts-ignore
      if (item.id === roleId && viewPerIds.value.includes(permissionId)) {
        if (item[permissionId] === false) {
          return permissionId;
        }
        let getTrue = false;
        // eslint-disable-next-line no-restricted-syntax
        for (const id of viewPerIds.value) {
          if (!getTrue && id === permissionId) {
            getTrue = true;
            // eslint-disable-next-line no-continue
            continue;
          }
          if (getTrue && item[id] === true) {
            return id;
          }
        }
        break;
      }
    }
  }

  return "";
}

/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest = {current: pageData.value.current, pageSize: pageData.value.pageSize}) => {
  setLoading(true);
  try {
    const {data} = await queryTableRolePermissions(pageData.value.params.type, pageData.value.params.object, {...params, ...routeParams.value});
    cowColumns.value = permissionFilter(data.permission);
    setViewPermissions();
    rowColumns.value = data.role;
    await validateTableData(data.table);
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

const addTableRole = (ev: MouseEvent) => {
  if (roleDrawerRef.value) {
    // @ts-ignore
    roleDrawerRef.value?.openForm({action: 'add', params: {type: 'app', appId: routeParams.value.appId}, closeBack: tableRefresh});
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
      params: {type: 'app', appId: routeParams.value.appId},
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
    if (viewPerIds.value.includes(permission)) {
      await insertTableRoleViewPermission({
        permissionId: needAddPermissionId(permission, role) || "",
        roleId: role, tenantCode: routeParams.value.tenantCode,
        permissionIds: viewPerIds.value.join(",")
      } as QueryRolePermissionForm);
      isSuccess = true;
      resetTableData(permission, role);
    } else {
      await insertTableRolePermission({
        permissionId: permission, roleId: role, tenantCode: routeParams.value.tenantCode
      } as QueryRolePermissionForm);
      isSuccess = true;
    }
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