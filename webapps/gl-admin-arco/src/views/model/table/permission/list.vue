<script lang="ts">
export default {
  name: 'ModelTablePermissionList'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";
import {TableColumnData, TableSortable} from "@arco-design/web-vue";
import useLoading from "@/hooks/loading";
import {
  deletePermission,
  deleteRole, insertTableRolePermission,
  insertTableRoleViewPermission,
  QueryPermissionClassifyForm,
  QueryPermissionForm,
  QueryRoleForm,
  QueryRolePermissionForm,
  queryTableRolePermissions, resetDefaultPermission
} from "@/api/security";
import {Pagination} from "@/types/global";
import {PageQueryRequest} from "@/api/base";
import RoleForm from "@/views/security/role/form.vue";
import PermissionForm from "@/views/security/permission/form.vue";

type PageParams = {
  connectId: string; // 数据库链接id
  object: string; // 模型 entity
  type: string; // 权限类型
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  visible: {type: Boolean, default: false},// 显示
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'edit'},// 表单状态
  isModal: {type: Boolean, default: false},// 是否表单
  pageSize: {type: Number, default: 10000},
  height: {type: Number, default: 0},
});

// 国际化
const {t} = useI18n();
// 加载功能
const {loading, setLoading} = useLoading(false);
const scrollbar = ref(true);
const scroll = ref({y: props.height});
const weightSortable = ref<TableSortable>({sortDirections: ['ascend', 'descend']});
const rowColumns = ref<QueryRoleForm[]>([]);
const cowColumns = ref<QueryPermissionClassifyForm[]>([]);
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
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
            if (`${props.parameter.object}${viewTypes[v]}` === cowColumns.value[i].data[p].code) {
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
          permissionId: currentPer, roleId: item.id,
          appId: props.parameter?.appId || '',
          tenantCode: props.parameter?.tenantCode || '',
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
const fetchData = async (params: PageQueryRequest = {current: 1, pageSize: props.pageSize}) => {
  setLoading(true);
  try {
    const {data} = await queryTableRolePermissions(props.parameter.type, props.parameter.object, {
      ...params, appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || '',
    } as unknown as PageQueryRequest);
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
const roleFormParams = ref({
  visible: false,
  isModal: true,
  title: '',
  width: '1020px',
  height: '',
  parameter: {type: '', appId: '', tenantCode: ''},
  formState: 'add',
  id: '',
  formCol: 2,
});
const addTableRole = (ev: MouseEvent) => {
  roleFormParams.value.parameter.type = props.parameter.appId ? 'app' : '';
  Object.assign(roleFormParams.value, {
    id: '', visible: true, formState: 'add'
  });
};

const editTableRole = (id: string) => {
  roleFormParams.value.parameter.type = props.parameter.appId ? 'app' : '';
  Object.assign(roleFormParams.value, {
    'id': id, visible: true, formState: 'edit'
  });
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
const permissionFormParams = ref({
  visible: false,
  isModal: true,
  title: '',
  width: '',
  height: '',
  parameter: {object: '', type: 'mp', appId: '', tenantCode: ''},
  formState: 'add',
  id: '',
  formCol: 1,
  autoCode: true,
});
const addTablePermission = (ev: MouseEvent) => {
  Object.assign(permissionFormParams.value, {
    id: '', visible: true, formState: 'add'
  });
}
const editTablePermission = (id: string) => {
  Object.assign(permissionFormParams.value, {
    'id': id, visible: true, formState: 'edit'
  });
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
    await resetDefaultPermission(props.parameter.type, props.parameter.object, props.parameter.appId);
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
        roleId: role,
        appId: props.parameter?.appId || '',
        tenantCode: props.parameter?.tenantCode || '',
        permissionIds: viewPerIds.value.join(",")
      } as QueryRolePermissionForm);
      isSuccess = true;
      resetTableData(permission, role);
    } else {
      await insertTableRolePermission({
        permissionId: permission, roleId: role,
        appId: props.parameter?.appId || '',
        tenantCode: props.parameter?.tenantCode || '',
      } as QueryRolePermissionForm);
      isSuccess = true;
    }
  } catch (err) {
    console.log(err);
  }

  return isSuccess;
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    scroll.value.y = props.height;
    roleFormParams.value.parameter = {
      type: '',
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
    permissionFormParams.value.parameter = {
      object: props.parameter.object, type: 'mp',
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
    // 加载数据
    fetchData();
  }
}, {deep: true, immediate: true});
</script>

<template>
  <RoleForm v-model:visible="roleFormParams.visible"
            :formCol="roleFormParams.formCol"
            :formState="roleFormParams.formState"
            :height="roleFormParams.height"
            :isModal="roleFormParams.isModal"
            :modelValue="roleFormParams.id"
            :parameter="roleFormParams.parameter"
            :title="roleFormParams.title"
            :width="roleFormParams.width"
            @saveSuccess="tableRefresh"/>

  <PermissionForm v-model:visible="permissionFormParams.visible"
                  :autoCode="permissionFormParams.autoCode"
                  :formCol="permissionFormParams.formCol"
                  :formState="permissionFormParams.formState"
                  :height="permissionFormParams.height"
                  :isModal="permissionFormParams.isModal"
                  :modelValue="permissionFormParams.id"
                  :parameter="permissionFormParams.parameter"
                  :title="permissionFormParams.title"
                  :width="permissionFormParams.width"
                  @saveSuccess="tableRefresh"/>
  <a-row style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button :disabled="formState==='view'" type="primary" @click="addTableRole($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('model.table.permission.index.model.role.add') }}
        </a-button>
        <a-button :disabled="formState==='view'" type="primary" @click="addTablePermission($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('model.table.permission.index.model.permission.add') }}
        </a-button>
        <a-button :disabled="formState==='view'" type="primary" @click="resetTableDefaultPermission($event)">
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
      :pagination="pageSize>200?false:pagination"
      :scroll="scroll"
      :scrollbar="scrollbar"
      :stripe="true"
      column-resizable
      row-key="id">
    <template #columns>
      <a-table-column :ellipsis="true" :tooltip="false" align="center">
        <template #title>
          <a-popover position="tl">
            {{ $t('model.table.permission.index.list.role') }}&nbsp;<icon-info-circle style="color: #ff696d"/>
            <template #content>
              <p>角色A ，权重 5，自定义</p>
              <p>角色B ，权重 10 ，看自己</p>
              <p>这里取的是角色B的看自己</p>
            </template>
          </a-popover>
        </template>
        <a-table-column :ellipsis="true" :title="$t('security.role.index.form.name')" :tooltip="false" :width="210" data-index="name" fixed="left">
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
                <a-divider v-if="formState==='edit'&&(!parameter.appId || (!!parameter.appId&&record.appId===parameter.appId))"
                           style="margin: 5px 0px"/>
                <a-space v-if="formState==='edit'&&(!parameter.appId || (!!parameter.appId&&record.appId===parameter.appId))"
                         style="display: flex;align-items: center;justify-content: end;">
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
        <a-table-column :ellipsis="true" :sortable="weightSortable" :title="$t('security.role.index.form.weight')" :tooltip="false" :width="90" align="center"
                        data-index="weight"/>
      </a-table-column>
      <a-table-column v-for="(nape,index) of cowColumns" :key="index" :ellipsis="true" :title="$t(`security.permission.index.form.classify.${nape.type}`)"
                      :tooltip="false">
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
                <br/>
                <span :title="item.description" class="span-textarea">
                      <strong>{{ $t('security.permission.index.form.description') }}：</strong>
                      {{ item.description }}
                    </span>
                <a-divider v-if="!item.default&&formState==='edit'" style="margin: 5px 0px"/>
                <a-space v-if="!item.default&&formState==='edit'" style="display: flex;align-items: center;justify-content: end;">
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
            <a-switch v-model="record[item.id]" :before-change="newValue => switchBeforeChange(item.id,record.id)"
                      :checked-color="nape.type==='custom'?'rgb(0,180,42)':nape.type==='view'?'rgb(20,201,201)':''"
                      :disabled="formState==='view'">
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
</template>

<style lang="less" scoped>

</style>