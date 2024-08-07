<script lang="ts">
export default {
  name: 'GlModelTableColumnPermissionForm'
};
</script>

<script lang="ts" setup>
import {reactive, ref, watch, computed} from 'vue';
import type {SelectOptionGroup, TableColumnData, TableSortable} from '@arco-design/web-vue';
import {applicationApi, modelApi, securityApi, useGlobal, utils} from "@geelato/gl-ui";
import type {Pagination, QueryRoleForm, QueryAppForm, QueryTableColumnForm} from "@geelato/gl-ui";
import {selectOptions} from "@geelato/gl-ui-arco";
import {columnPermissionOptions} from "../searchTable";
import {typeOptions as roleTypeOptions} from "../../../security/role/searchTable";
import GlModelTableColumnForm from "../form.vue";
import GlSecurityRoleForm from "../../../security/role/form.vue";

type PageParams = {
  connectId: string; // 数据库链接id
  tableId: string; // 模型主键
  object: string; // 模型 entity
  type: string; // 权限类型
  isSync: boolean; // 是否同步
  isSystem: boolean; // 是否系统表
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
});

const global = useGlobal();
// 分页列表参数
type Column = TableColumnData & { checked?: true };
const columns = computed<TableColumnData[]>(() => []);
const cloneColumns = ref<Column[]>([]);
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const pagination = reactive({...basePagination,});
const rowColumns = ref<QueryRoleForm[]>([]);
const cowColumns = ref<QueryTableColumnForm[]>([]);
const renderData = ref<Record<string, boolean | string>[]>([]);
const sourceData = ref<Record<string, boolean | string>[]>([]);
const loading = ref<boolean>(false);
const scrollbar = ref(true);
const scroll = ref({y: props.height});
const plusTooltip = ref<boolean>(false);
const weightSortable = ref<TableSortable>({sortDirections: ['ascend', 'descend']});
const selectTypeOptions = ref<SelectOptionGroup[]>([]);
const defaultColumnMetas = ref<string[]>([]);

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
    const {data} = await securityApi.queryColumnRolePermissions(props.parameter.type, props.parameter.object, {
      ...params, appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || '',
    });
    cowColumns.value = [];
    for (const item of data.column) {
      if (!isDefaultColumn(item.name)) {
        cowColumns.value.push(item);
      }
    }
    rowColumns.value = data.role;
    renderData.value = data.table;
    sourceData.value = {...data.table};

    if (cowColumns.value.length === 0) {
      plusTooltip.value = true;
      setTimeout(() => {
        plusTooltip.value = false;
      }, 1000 * 3);
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const tableRefresh = (ev?: Event) => {
  fetchData();
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
const addColumnRole = (ev?: MouseEvent) => {
  rolePage.value.formState = 'add';
  rolePage.value.title = '新增应用角色';
  rolePage.value.id = '';
  rolePage.value.visible = true;
};
const editColumnRole = (id: string) => {
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
/* 表单参数 */
const columnPage = ref({
  id: '',// 主键
  visible: false,//
  parameter: {
    connectId: '', tableId: '', tableName: '',
    isSync: false, isSystem: false,
    appId: '', tenantCode: ''
  },
  formState: 'add',//
  formCol: 2,//
  title: '模型字段',
  width: '1020px',
});
const addColumn = (ev?: MouseEvent) => {
  Object.assign(columnPage.value, {
    id: '', visible: true, formState: 'add', title: '新增模型字段'
  })
}
const editColumn = (id: string) => {
  Object.assign(columnPage.value, {
    "id": id, visible: true, formState: 'edit', title: '编辑模型字段'
  })
}
const deleteTablePermission = async (id: string) => {
  try {
    await modelApi.deleteTableColumn(id);
    tableRefresh();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

const resetColumnDefaultPermission = async (ev?: MouseEvent) => {
  try {
    await securityApi.resetDefaultPermission(props.parameter.type, props.parameter.object, props.parameter.appId);
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
    await securityApi.insertColumnRolePermission({"roleId": roleId, "columnId": columnId, "rule": rule});
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

const isDefaultColumn = (value: string) => {
  return defaultColumnMetas.value.includes(value);
}

watch(() => props.parameter, () => {
  // 模型字段类型
  selectOptions.getTypeSelectOptionGroup((data: SelectOptionGroup[]) => {
    selectTypeOptions.value = data || [];
  }, () => {
    selectTypeOptions.value = [];
  });
  // 模型默认字段
  modelApi.getDefaultColumnNames((data: string[]) => {
    defaultColumnMetas.value = data || [];
  }, () => {
    defaultColumnMetas.value = [];
  });

  fetchData();
  columnPage.value.parameter = {
    connectId: props.parameter.connectId,
    tableId: props.parameter.tableId,
    tableName: props.parameter.object,
    isSync: props.parameter?.isSync === true,
    isSystem: props.parameter?.isSystem === true,
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
  rolePage.value.parameter = {
    type: 'app', appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
  }
}, {deep: true, immediate: true});

watch(() => props.height, (val) => {
  scroll.value.y = props.height;
}, {deep: true, immediate: true});
</script>

<template>
  <GlModelTableColumnForm v-model:visible="columnPage.visible"
                          :formCol="columnPage.formCol"
                          :formState="columnPage.formState"
                          :modelValue="columnPage.id"
                          :parameter="columnPage.parameter"
                          :title="columnPage.title"
                          :width="columnPage.width"
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
        <a-button :disabled="formState==='view'" type="primary" @click="addColumnRole">
          <template #icon>
            <gl-iconfont type="gl-plus-circle"/>
          </template>
          新增角色
        </a-button>
        <a-tooltip :popup-visible="plusTooltip" position="bottom" content="默认字段不参与字段权限控制，请新增其他字段。">
          <a-button :disabled="formState==='view'||parameter.isSystem===true" type="primary" @click="addColumn">
            <template #icon>
              <gl-iconfont type="gl-plus-circle"/>
            </template>
            新增模型字段
          </a-button>
        </a-tooltip>
        <a-button :disabled="formState==='view'" type="primary" @click="resetColumnDefaultPermission">
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
      <a-table-column :ellipsis="true" :tooltip="false" :width="210" data-index="name" fixed="left" title="角色">
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
                <a-button size="mini" type="primary" @click="editColumnRole(record.id)">
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
      <a-table-column v-for="item of cowColumns" :key="item.id" :data-index="item.id" :ellipsis="true" :tooltip="true" :width="150" align="center">
        <template #title>
          <a-popover :title="item.title" position="br" style="max-width: 400px">
            <span style="cursor: pointer;">{{ item.title }} <gl-iconfont type="gl-warning-circle"/></span>
            <template #content="{isDefault = isDefaultColumn(item.name)}">
              <span>
                <a-space>
                  <a-tag v-if="item.key" color="#165dff">主键</a-tag>
                  <a-tag v-if="item.uniqued" color="#165dff">唯一约束</a-tag>
                  <a-tag v-if="!item.numericSigned" color="#165dff">无符号</a-tag>
                  <a-tag v-if="item.nullable" color="#165dff">可为空</a-tag>
                  <a-tag v-else color="#eb0aa4">不可为空</a-tag>
                </a-space>
              </span>
              <br/>
              <span>
                <strong>标识：</strong>
                {{ `${item.name} | ${item.fieldName}` }}
                <GlCopyToClipboard :modelValue="`${item.name} | ${item.fieldName}`"/>
              </span>
              <br/>
              <span>
                <strong>类型：</strong>{{ utils.getOptionLabel(item.selectType, selectTypeOptions) }}
              </span>
              <br/>
              <span>
                <strong>约束：</strong>{{ item.type }}
              </span>
              <br/>
              <span :title="item.comment" class="span-textarea">
                <strong>注释：</strong>{{ item.comment || item.description }}
              </span>
              <a-divider v-if="!isDefault&&formState==='edit'&&parameter.isSystem===false" style="margin: 5px 0px"/>
              <a-space v-if="!isDefault&&formState==='edit'&&parameter.isSystem===false" style="display: flex;align-items: center;justify-content: end;">
                <a-button size="mini" type="primary" @click="editColumn(item.id)">
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
          <a-select v-model="record[item.id]"
                    :bordered="false" :disabled="formState==='view'" :options="columnPermissionOptions"
                    :style="{color:`${record[item.id]==='1'?'#00b42a':(record[item.id]==='2'?'#165dff':'#86909c')}`}"
                    @change="columnRolePermissionChange(record.id,item.id,record[item.id])"/>
        </template>
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