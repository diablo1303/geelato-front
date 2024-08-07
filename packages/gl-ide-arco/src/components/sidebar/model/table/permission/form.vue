<script lang="ts">
export default {
  name: 'GlModelTablePermissionForm'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch, computed} from 'vue';
import type {TableColumnData, TableSortable} from '@arco-design/web-vue';
import {modelApi, securityApi, useGlobal, utils} from "@geelato/gl-ui";
import type {Pagination, QueryAppTableForm, QueryRoleForm, QueryPermissionClassifyForm, QueryPermissionForm, QueryRolePermissionForm} from "@geelato/gl-ui";
import {typeOptions as roleTypeOptions} from "../../../security/role/searchTable";
import {classifyOptions, typeOptions as permissionTypeOptions} from "../../../security/permission/searchTable";
import GlSecurityPermissionForm from "../../../security/permission/form.vue";
import GlSecurityRoleForm from "../../../security/role/form.vue";

type PageParams = {
  connectId: string; // 数据库链接id
  tableId: string; // 数据库表id
  object: string; // 模型 entity
  type: string; // 权限类型
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  formState: {type: String, default: 'add'},// 表单状态
  isModal: {type: Boolean, default: false},// 是否表单
  pageSize: {type: Number, default: 10000},
  height: {type: Number, default: 0},
  refApp: {type: Boolean, default: false},
  refType: {type: String, default: 'table'},
});

const global = useGlobal();
// 分页列表参数
type Column = TableColumnData & { checked?: true };
const columns = computed<TableColumnData[]>(() => []);
const cloneColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const pagination = reactive({...basePagination,});
const rowColumns = ref<QueryRoleForm[]>([]);
const cowColumns = ref<QueryPermissionClassifyForm[]>([]);
const renderData = ref<Record<string, boolean | string>[]>([]);
const loading = ref<boolean>(false);
const scrollbar = ref(true);
const scroll = ref({x: 1000, y: props.height});
const weightSortable = ref<TableSortable>({sortDirections: ['ascend', 'descend']});
const appTablePermissionIds = ref<string[]>([]);
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

const getAppTablePermissionIds = (data: QueryAppTableForm[]) => {
  let permissionIds: string[] = [];
  if (data && data.length > 0) {
    for (const item of data) {
      if (item.permissionId) {
        permissionIds = permissionIds.concat(item.permissionId.split(","));
      }
    }
  }
  return permissionIds;
};

const permissionFilter = (qpcf: QueryPermissionClassifyForm[]) => {
  const data: QueryPermissionClassifyForm[] = [];
  if (qpcf && qpcf.length > 0) {
    for (let i = 0; i < qpcf.length; i += 1) {
      if (qpcf[i].type && qpcf[i].data && qpcf[i].data.length > 0) {
        if (props.refApp) {
          qpcf[i].data = qpcf[i].data.filter((item: QueryPermissionForm) => {
            return appTablePermissionIds.value.includes(item.id);
          });
        }
        data.push(qpcf[i]);
      }
    }
  }
  console.log(data);
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
        await securityApi.insertTableRoleViewPermission({
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
const fetchData = async (params?: Record<string, any>) => {
  if (!props.parameter.type || !props.parameter.object) {
    return;
  }
  loading.value = true;
  try {
    const {data} = await securityApi.queryTableRolePermissions(props.parameter.type, props.parameter.object, {
      ...params, appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || '',
    });
    cowColumns.value = permissionFilter(data.permission);
    setViewPermissions();
    rowColumns.value = data.role;
    await validateTableData(data.table);
    renderData.value = data.table;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const queryAppTablePermissions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await modelApi.queryAppTables(params);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

const queryAppViewPermissions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await modelApi.queryAppViews(params);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

const tableRefresh = (ev?: Event) => {
  if (props.refApp) {
    if (props.refType === 'view') {
      queryAppViewPermissions({
        enableStatus: 1, approvalStatus: 'agree',
        viewId: props.parameter?.tableId || '',
        appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
      }, (data: QueryAppTableForm[]) => {
        appTablePermissionIds.value = getAppTablePermissionIds(data);
        console.log(appTablePermissionIds.value);
        fetchData();
      }, () => {
        appTablePermissionIds.value = [];
      });
    } else {
      queryAppTablePermissions({
        enableStatus: 1, approvalStatus: 'agree',
        tableId: props.parameter?.tableId || '',
        appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
      }, (data: QueryAppTableForm[]) => {
        appTablePermissionIds.value = getAppTablePermissionIds(data);
        console.log(appTablePermissionIds.value);
        fetchData();
      }, () => {
        appTablePermissionIds.value = [];
      });
    }
  } else {
    fetchData();
  }
};

const rolePage = ref({
  id: '',
  visible: false,
  parameter: {type: '', appId: '', tenantCode: ''},
  formState: 'add',
  formCol: 1,
  title: '',
  width: ''
});
const addTableRole = (ev?: MouseEvent) => {
  rolePage.value.formState = 'add';
  rolePage.value.title = '新增应用角色';
  rolePage.value.id = '';
  rolePage.value.visible = true;
};
const editTableRole = (id: string) => {
  rolePage.value.formState = 'edit';
  rolePage.value.title = '编辑应用角色';
  rolePage.value.id = id;
  rolePage.value.visible = true;
}
const deleteTableRole = async (id: string) => {
  try {
    await securityApi.deleteRole(id);
    tableRefresh();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const permissionPage = ref({
  id: '',
  visible: false,
  parameter: {object: '', type: '', appId: '', tenantCode: ''},
  formState: 'add',
  formCol: 2,
  title: '',
  width: '880px',
  autoCode: true
});
const addTablePermission = (ev?: MouseEvent) => {
  permissionPage.value.formState = 'add';
  permissionPage.value.parameter.type = 'dp';
  permissionPage.value.title = '新增查看权限（自定义）';
  permissionPage.value.id = '';
  permissionPage.value.visible = true;
}
const editTablePermission = (id: string) => {
  permissionPage.value.formState = 'edit';
  permissionPage.value.parameter.type = '';
  permissionPage.value.title = '编辑模型权限';
  permissionPage.value.id = id;
  permissionPage.value.visible = true;
}
const deleteTablePermission = async (id: string) => {
  try {
    await securityApi.deletePermission(id);
    tableRefresh();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const saveSuccess = () => {
  tableRefresh();
}

const resetTableDefaultPermission = async (ev?: MouseEvent) => {
  try {
    await securityApi.resetDefaultPermission(props.parameter.type, props.parameter.object, props.parameter.appId);
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
      await securityApi.insertTableRoleViewPermission({
        permissionId: needAddPermissionId(permission, role) || "",
        roleId: role,
        appId: props.parameter?.appId || '',
        tenantCode: props.parameter?.tenantCode || '',
        permissionIds: viewPerIds.value.join(",")
      } as QueryRolePermissionForm);
      isSuccess = true;
      resetTableData(permission, role);
    } else {
      await securityApi.insertTableRolePermission({
        permissionId: permission, roleId: role,
        appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || '',
      } as QueryRolePermissionForm);
      isSuccess = true;
    }
  } catch (err) {
    console.log(err);
  }

  return isSuccess;
}

watch(() => props.parameter, () => {
  tableRefresh();
  permissionPage.value.parameter = {
    object: props.parameter.object, type: props.parameter.type,
    appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }
  rolePage.value.parameter = {
    type: 'app', appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }
}, {deep: true, immediate: true});

watch(() => props.height, (val) => {
  scroll.value.y = props.height;
}, {deep: true, immediate: true});
</script>

<template>
  <GlSecurityPermissionForm v-model:visible="permissionPage.visible"
                            :formCol="permissionPage.formCol"
                            :formState="permissionPage.formState"
                            :modelValue="permissionPage.id"
                            :parameter="permissionPage.parameter"
                            :title="permissionPage.title"
                            :width="permissionPage.width"
                            :autoCode="permissionPage.autoCode"
                            @saveSuccess="tableRefresh"/>

  <GlSecurityRoleForm v-model:visible="rolePage.visible"
                      :formCol="rolePage.formCol"
                      :formState="rolePage.formState"
                      :modelValue="rolePage.id"
                      :parameter="rolePage.parameter"
                      :title="rolePage.title"
                      :width="rolePage.width"
                      @saveSuccess="tableRefresh"/>
  <a-row style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button :disabled="formState==='view'" type="primary" @click="addTableRole">
          <template #icon>
            <gl-iconfont type="gl-plus-circle"/>
          </template>
          新增角色
        </a-button>
        <a-button v-if="!refApp" :disabled="formState==='view'" type="primary" @click="addTablePermission">
          <template #icon>
            <gl-iconfont type="gl-plus-circle"/>
          </template>
          新增自定义查看权限
        </a-button>
        <a-button v-if="!refApp" :disabled="formState==='view'" type="primary" @click="resetTableDefaultPermission">
          <template #icon>
            <gl-iconfont type="gl-reset"/>
          </template>
          重置默认权限
        </a-button>
      </a-space>
    </a-col>
    <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
      <a-space>
        <a-button type="primary" @click="tableRefresh">
          <template #icon>
            <gl-iconfont type="gl-refresh"/>
          </template>
          刷新
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-divider style="margin-top: 0"/>
  <a-table
      :key="height"
      :bordered="{cell:true}"
      :data="renderData"
      :loading="loading"
      :pagination="false"
      :scroll="scroll"
      :scrollbar="scrollbar"
      :stripe="true"
      column-resizable
      row-key="id">
    <template #columns>
      <a-table-column align="center">
        <template #title>
          <a-popover position="right">
            角色&nbsp;<gl-iconfont type="gl-warning-circle" style="color: #ff696d"/>
            <template #content>
              <p style="margin: 0px 0px;">若用户的多个角色都对模型M有读取权限：</p>
              <p style="margin: 0px 0px;font-weight: bold;">优先采用权重大的角色；若权重一样时，取第一个角色。</p>
              <p style="margin: 0px 0px;">在角色的读取权限中，按如下优先级选择一条规则查询过滤数据：</p>
              <p style="margin: 0px 0px;font-weight: bold;">自定义 > 看全部 > 看公司/事业部 > 看部门 > 看自己。</p>
              <p style="margin: 0px 0px;">例如：用户“张三”有以下角色及其读取权限：</p>
              <p style="margin: 0px 0px;">角色A（权重 5，自定义查看权限、看全部），</p>
              <p style="margin: 0px 0px;">角色B（权重 10，看部门、看自己），</p>
              <p style="margin: 0px 0px;">则最终取【角色B > 看部门】的权限。</p>
            </template>
          </a-popover>
        </template>
        <a-table-column :ellipsis="true" :tooltip="false" :width="210" data-index="name" fixed="left" title="名称">
          <template #cell="{record}">
            <a-popover :title="record.name" position="right" style="max-width: 300px">
              <span style="cursor: pointer;">{{ record.name }} <gl-iconfont type="gl-warning-circle"/></span>
              <template #content>
              <span>
                <strong>编码：</strong>{{ record.code }}
                <GlCopyToClipboard v-model="record.code" title="点击复制编码"/>
              </span>
                <br/>
                <span>
                <strong>权重：</strong>{{ record.weight }}
              </span>
                <br/>
                <span>
                <strong>类型：</strong>{{ utils.getOptionLabel(record.type, roleTypeOptions) }}
              </span>
                <br/>
                <strong v-if="['app'].includes(record.type)">应用：</strong>
                <span v-if="record.appName&&['app'].includes(record.type)">{{ record.appName }}</span>
                <br v-if="['app'].includes(record.type)"/>
                <span :title="record.description" class="span-textarea">
                <strong>描述：</strong>{{ record.description }}
              </span>
                <a-divider v-if="formState==='edit'&&parameter.appId===record.appId" style="margin: 5px 0px"/>
                <a-space v-if="formState==='edit'&&parameter.appId===record.appId" style="display: flex;align-items: center;justify-content: end;">
                  <a-button size="mini" type="primary" @click="editTableRole(record.id)">
                    编辑
                  </a-button>
                  <a-popconfirm content="是否删除该条数据？" position="tr" type="warning" @ok="deleteTableRole(record.id)">
                    <a-button size="mini" status="danger" type="primary">
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-popover>
          </template>
        </a-table-column>
        <a-table-column :width="90" data-index="weight" align="center" title="权重" :sortable="weightSortable"/>
      </a-table-column>
      <a-table-column v-for="(nape,index) of cowColumns" :key="index" :ellipsis="true" :tooltip="true"
                      :title="`${utils.getOptionLabel(nape.type,classifyOptions)}`">
        <a-table-column v-for="item of nape.data" :key="item.id" :data-index="item.id" :ellipsis="true" :tooltip="true" :width="120" align="center">
          <template #title>
            <a-popover :title="item.name" position="br" style="max-width: 300px">
              <span style="cursor: pointer;">{{ item.name }} <gl-iconfont type="gl-warning-circle"/></span>
              <template #content>
                <span>
                  <strong>编码：</strong>{{ item.code }}
                  <GlCopyToClipboard v-model="item.code" title="点击复制编码"/>
                </span>
                <br/>
                <span>
                  <strong>类型：</strong>{{ utils.getOptionLabel(item.type, permissionTypeOptions) }}
                </span>
                <br/>
                <span>
                  <strong>对象：</strong>{{ item.object }}
                </span>
                <br/>
                <span :title="item.rule" class="span-textarea">
                  <strong>规则：</strong>{{ item.rule }}
                </span>
                <span :title="item.description" class="span-textarea">
                  <strong>描述：</strong>{{ item.description }}
                </span>
                <a-divider v-if="!item.default&&formState==='edit'" style="margin: 5px 0px"/>
                <a-space v-if="!item.default&&formState==='edit'" style="display: flex;align-items: center;justify-content: end;">
                  <a-button size="mini" type="primary" @click="editTablePermission(item.id)">
                    编辑
                  </a-button>
                  <a-popconfirm content="是否删除该条数据？" position="tr" type="warning" @ok="deleteTablePermission(item.id)">
                    <a-button size="mini" status="danger" type="primary">
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-popover>
          </template>
          <template #cell="{record}">
            <a-switch v-model="record[item.id]" :disabled="formState==='view'"
                      :before-change="() => switchBeforeChange(item.id,record.id)"
                      :checked-color="nape.type==='custom'?'rgb(0,180,42)':nape.type==='view'?'rgb(20,201,201)':''">
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