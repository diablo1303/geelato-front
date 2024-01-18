<template v-model="pageData">
  <a-row style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button type="primary" @click="addColumnRole($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('model.column.permission.index.model.role.add') }}
        </a-button>
        <a-button type="primary" @click="addColumn($event)">
          <template #icon>
            <icon-plus/>
          </template>
          {{ $t('model.column.permission.index.model.column.add') }}
        </a-button>
        <a-button type="primary" @click="resetColumnDefaultPermission($event)">
          <template #icon>
            <icon-undo/>
          </template>
          {{ $t('model.column.permission.index.model.permission.reset') }}
        </a-button>
      </a-space>
    </a-col>
    <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
      <a-space>
        <a-button type="primary" @click="tableRefresh($event)">
          <template #icon>
            <icon-refresh/>
          </template>
          {{ $t('model.column.permission.index.model.refresh') }}
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
      <a-table-column :ellipsis="true" :title="$t('model.column.permission.index.list.role')" :tooltip="false" :width="150" data-index="name" fixed="left">
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
                <a-button size="mini" type="primary" @click="editColumnRole(record.id)">
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
      <a-table-column v-for="item of cowColumns" :key="item.id" :data-index="item.id" :ellipsis="true" :tooltip="true" :width="150" align="center">
        <template #title>
          <a-popover :title="item.title" position="br" style="max-width: 400px">
            <span style="cursor: pointer;">{{ item.title }} <icon-info-circle/></span>
            <template #content="{isDefault = defaultColumnMetas.includes(item.name)}">
              <span>
                <a-space>
                  <a-tag v-if="item.key" color="#165dff">{{ $t('model.column.permission.index.form.key') }}</a-tag>
                  <a-tag v-if="item.uniqued" color="#165dff">{{ $t('model.column.permission.index.form.uniqued') }}</a-tag>
                  <a-tag v-if="!item.numericSigned" color="#165dff">{{ $t('model.column.permission.index.form.numericSigned') }}</a-tag>
                  <a-tag v-if="item.nullable" color="#165dff">{{ $t('model.column.permission.index.form.nullable.true') }}</a-tag>
                  <a-tag v-else color="#eb0aa4">{{ $t('model.column.permission.index.form.nullable.false') }}</a-tag>
                </a-space>
              </span>
              <br/>
              <span>
                      <strong>{{ $t('model.column.permission.index.form.name') }}：</strong>
                      {{ `${item.name} | ${item.fieldName}` }}
                <CopyToClipboard :model-value="`${item.name} | ${item.fieldName}`"/>
                    </span>
              <br/>
              <span>
                      <strong>{{ $t('model.column.permission.index.form.dataType') }}：</strong>
                      {{ formatSelectType(item.selectType) }}
                    </span>
              <br/>
              <span>
                      <strong>{{ $t('model.column.permission.index.form.type') }}：</strong>
                      {{ item.type }}
                    </span>
              <br/>
              <span :title="item.comment" class="span-textarea">
                      <strong>{{ $t('model.column.permission.index.form.comment') }}：</strong>
                      {{ item.comment || item.description }}
                    </span>
              <a-divider v-if="!isDefault&&pageData.formState==='edit'&&!pageData.params.isSystem"
                         style="margin: 5px 0px"/>
              <a-space v-if="!isDefault&&pageData.formState==='edit'&&!pageData.params.isSystem"
                       style="display: flex;align-items: center;justify-content: end;">
                <a-button size="mini" type="primary" @click="editColumn(item.id)">
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
          <a-select v-model="record[item.id]"
                    :bordered="false"
                    :style="{color:`${record[item.id]==='1'?'#00b42a':(record[item.id]==='2'?'#165dff':'#86909c')}`}"
                    @change="columnRolePermissionChange(record.id,item.id,record[item.id])">
            <a-option value="0">{{ $t('model.column.permission.columnPermission.0') }}</a-option>
            <a-option value="1">{{ $t('model.column.permission.columnPermission.1') }}</a-option>
            <a-option value="2">{{ $t('model.column.permission.columnPermission.2') }}</a-option>
          </a-select>
        </template>
      </a-table-column>
    </template>
  </a-table>
  <RoleDrawer ref="roleDrawerRef"></RoleDrawer>
  <RoleTabForm ref="roleTabFormRef"></RoleTabForm>
  <ColumnDrawer ref="columnDrawerRef"></ColumnDrawer>
</template>

<script lang="ts" setup>
/* 导入 */
import {computed, reactive, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRoute} from "vue-router";
import useLoading from '@/hooks/loading';
// 分页列表
import {Pagination} from '@/types/global';
import type {TableColumnData} from '@arco-design/web-vue';
import {SelectOptionData} from "@arco-design/web-vue";
// 引用其他对象、方法
import {ListUrlParams, PageQueryRequest} from '@/api/base';
import {deleteRole, insertColumnRolePermission, queryColumnRolePermissions, QueryRoleForm, resetDefaultPermission} from "@/api/security";
import {deleteTableColumn, QueryTableColumnForm, QueryViewForm as QueryForm} from "@/api/model";
import RoleDrawer from "@/views/security/role/drawer.vue";
import RoleTabForm from "@/views/security/role/tabForm.vue";
import {columnSelectType, defaultColumnMetas} from "@/views/model/column/searchTable";
import ColumnDrawer from "@/views/model/column/drawer.vue";
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
  params: {pId: '', pName: '', type: '', isSystem: false},
  modalAddBack: (data: QueryForm) => {
  }, modalEditBack: (data: QueryForm) => {
  }, modalDeleteBack: (id: string) => {
  }
});
const roleDrawerRef = ref(null);
const roleTabFormRef = ref(null);
const columnDrawerRef = ref(null);
// 国际化
const {t} = useI18n();
// 加载
const {loading, setLoading} = useLoading(true);
// 分页列表参数
const cloneColumns = ref<Column[]>([]);
const rowColumns = ref<QueryRoleForm[]>([]);
const cowColumns = ref<QueryTableColumnForm[]>([]);
const basePagination: Pagination = {current: pageData.value.current, pageSize: pageData.value.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<Record<string, boolean | string>[]>([]);
const sourceData = ref<Record<string, boolean | string>[]>([]);
const columnPermissionOptions = computed<SelectOptionData[]>(() => [
  {label: "model.column.permission.columnPermission.0", value: "0",},
  {label: 'model.column.permission.columnPermission.1', value: "1",},
  {label: 'model.column.permission.columnPermission.2', value: "2",},
]);
/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest = {current: pageData.value.current, pageSize: pageData.value.pageSize}) => {
  setLoading(true);
  try {
    const {data} = await queryColumnRolePermissions(pageData.value.params.type, pageData.value.params.pName, {...params, ...routeParams.value});
    cowColumns.value = data.column;
    rowColumns.value = data.role;
    renderData.value = data.table;
    sourceData.value = {...data.table};
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
const formatSelectType = (value: string): string => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of columnSelectType) {
    if (item.value === value) {
      return item.label;
    }
  }
  return '';
}
const tableRefresh = (ev?: Event) => {
  fetchData();
};

const addColumnRole = (ev: MouseEvent) => {
  if (roleDrawerRef.value) {
    // @ts-ignore
    roleDrawerRef.value?.openForm({action: 'add', params: {type: 'app', appId: routeParams.value.appId}, closeBack: tableRefresh});
  }
};
const editColumnRole = (id: string) => {
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

const addColumn = (ev: MouseEvent) => {
  if (columnDrawerRef.value) {
    const formParams: Record<string, any> = pageData.value.params || {};
    formParams.editName = true;
    // @ts-ignore
    columnDrawerRef.value?.openForm({action: 'add', params: formParams, closeBack: tableRefresh});
  }
}
const editColumn = (id: string) => {
  if (columnDrawerRef.value) {
    const formParams: Record<string, any> = pageData.value.params || {};
    formParams.editName = false;
    // @ts-ignore
    columnDrawerRef.value?.openForm({action: 'edit', 'id': id, params: pageData.value.params, closeBack: tableRefresh});
  }
}
const deleteTablePermission = async (id: string) => {
  try {
    await deleteTableColumn(id);
    tableRefresh();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const resetColumnDefaultPermission = async (ev: MouseEvent) => {
  try {
    await resetDefaultPermission(pageData.value.params.type, pageData.value.params.pName);
    tableRefresh();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const getSourceRule = (roleId: string, columnId: string, rule?: string) => {
  if (sourceData.value && sourceData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of sourceData.value) {
      if (item.id === roleId) {
        if (rule && ['0', '1', '2'].includes(rule)) item[columnId] = rule;
        return item[columnId];
      }
    }
  }
  return "0";
}
const resetRenderData = (roleId: string, columnId: string, rule: string) => {
  if (renderData.value && renderData.value.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of renderData.value) {
      if (item.id === roleId) {
        if (rule && ['0', '1', '2'].includes(rule)) item[columnId] = rule;
      }
    }
  }
}

const columnRolePermissionChange = async (roleId: string, columnId: string, rule: string) => {
  let isSuccess = false;
  try {
    await insertColumnRolePermission({"roleId": roleId, "columnId": columnId, "rule": rule});
    isSuccess = true;
  } catch (err) {
    console.log(err);
  } finally {
    if (isSuccess) {
      getSourceRule(roleId, columnId, rule);
    } else {
      resetRenderData(roleId, columnId, getSourceRule(roleId, columnId) as string);
    }
  }
}

/* 对外调用方法 */
const loadList = (urlParams: ListUrlParams) => {
  // 参数设置
  pageData.value.formState = urlParams.action || 'edit';
  pageData.value.isModal = urlParams.isModal || false;
  pageData.value.params.pId = urlParams.params?.pId || '';
  pageData.value.params.pName = urlParams.params?.pName || '';
  pageData.value.params.type = urlParams.params?.pType || '';
  pageData.value.params.isSystem = urlParams.params?.isSystem || '';
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