<script lang="ts">
export default {
  name: 'ModelTableColumnPermissionList'
};
</script>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";
import {SelectOptionData, TableColumnData} from "@arco-design/web-vue";
import useLoading from "@/hooks/loading";
import {deleteTableColumn, QueryTableColumnForm} from "@/api/model";
import {Pagination} from "@/types/global";
import {deleteRole, insertColumnRolePermission, queryColumnRolePermissions, QueryRoleForm, resetDefaultPermission} from "@/api/security";
import {PageQueryRequest} from "@/api/base";

type PageParams = {
  connectId: string; // 数据库链接id
  tableId: string; // 模型主键
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
type Column = TableColumnData & { checked?: true };
const scrollbar = ref(true);
const scroll = ref({y: props.height});
const cloneColumns = ref<Column[]>([]);
const rowColumns = ref<QueryRoleForm[]>([]);
const cowColumns = ref<QueryTableColumnForm[]>([]);
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const pagination = reactive({...basePagination,});
const renderData = ref<Record<string, boolean | string>[]>([]);
const sourceData = ref<Record<string, boolean | string>[]>([]);
const defaultColumnMetas = ref<string[]>([]);

/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest = {current: 1, pageSize: props.pageSize}) => {
  setLoading(true);
  try {
    const {data} = await queryColumnRolePermissions(props.parameter.type, props.parameter.object, {
      ...params, appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || '',
    } as unknown as PageQueryRequest);
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

const tableRefresh = (ev?: Event) => {
  fetchData();
};


const addColumnRole = (ev: MouseEvent) => {

};
const editColumnRole = (id: string) => {

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
/* 表单参数 */
const formPage = ref({
  visible: false,//
  formState: 'add',//
  formCol: 1,//
  id: '',// 主键
  editName: true,// 是否可编辑模型名称
  parameter: {connectId: '', tableId: '', tableName: '', appId: ''}
});
const addColumn = (ev: MouseEvent) => {
  formPage.value = {
    visible: true, formState: 'add', formCol: 1, id: '', editName: true,
    parameter: {
      connectId: props.parameter.connectId, tableId: props.parameter.id, tableName: props.parameter.object, appId: props.parameter.appId
    }
  };
}
const editColumn = (id: string) => {
  formPage.value = {
    visible: true, formState: 'edit', formCol: 1, "id": id, editName: false,
    parameter: {
      connectId: props.parameter.connectId, tableId: props.parameter.tableId, tableName: props.parameter.object, appId: props.parameter.appId
    }
  };
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
    await resetDefaultPermission(props.parameter.type, props.parameter.object, props.parameter.appId);
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
watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    scroll.value.y = props.height;
    // 加载数据
    fetchData();
  }
}, {deep: true, immediate: true});
</script>

<template>
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
      :pagination="pageSize>200?false:pagination"
      :scroll="scroll"
      :scrollbar="scrollbar"
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
              <a-divider v-if="formState==='edit'" style="margin: 5px 0px"/>
              <a-space v-if="formState==='edit'" style="display: flex;align-items: center;justify-content: end;">
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
                      {{ item.selectType }}
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
              <a-divider v-if="!isDefault&&formState==='edit'&&!isSystem"
                         style="margin: 5px 0px"/>
              <a-space v-if="!isDefault&&formState==='edit'&&!isSystem"
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
</template>

<style lang="less" scoped>

</style>