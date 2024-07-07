<script lang="ts">
export default {
  name: 'UserPermissionList'
};
</script>

<script lang="ts" setup>
import {compile, h, reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import useLoading from '@/hooks/loading';
import {Pagination} from '@/types/global';
import {copyToClipboard} from "@/utils/strings";
import {Message, Modal, TableColumnData, TableSortable} from '@arco-design/web-vue';
import {PageSizeOptions, PageQueryFilter, PageQueryRequest, FormParams, getOptionLabel} from '@/api/base';
// 页面所需 对象、方法
import {insertRoleUser, pageQueryUserOf as pageQueryList, QueryRoleForm, QueryRoleUserForm, QueryUserForm as QueryForm, switchRoleUser} from '@/api/security';
import CopyToClipboard from "@/components/copy-to-clipboard/index.vue";
import UserRoleList from "@/views/security/user/role/list.vue";
import RoleTabsForm from "@/views/security/role/tabsForm.vue";
import {enableStatusOptions} from '../searchTable';

// 页面所需参数
type PageParams = {
  orgId: string; // 组织主键
  orgName: string; // 组织名称
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'fetch', 'add', 'edit', 'delete']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  visible: {type: Boolean, default: false},// 页面是否显示
  parameter: {type: Object, default: () => ({} as PageParams)}, // 页面需要的参数
  formState: {type: String, default: 'edit'}, // 页面状态
  filterCol: {type: Number, default: 3}, // 列表 - 搜索条件 - 一行显示个数
  pageSize: {type: Number, default: 10}, // 列表 - 条数
  height: {type: Number, default: 245}, // 列表 - 数据列表高度，滑动条高度
});

// 国际化
const {t} = useI18n();
// 加载功能
const {loading, setLoading} = useLoading(false);
// 列表
const renderData = ref<PageQueryFilter[]>([]);
const roleData = ref<Record<string, any>[]>([]);
// 列表 - 分页
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const pagination = reactive({
  ...basePagination, showTotal: true, showPageSize: true, pageSizeOptions: PageSizeOptions
});
// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 770, y: props.height});
// 列表 - 排序
const sortable = ref<Record<string, TableSortable>>({
  seqNo: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''},
  createAt: {sortDirections: ['ascend', 'descend'], sorter: true, sortOrder: ''}
});
const lastSort = ref<string>('');
// 列表 - 查询条件布局
const labelCol = ref<number>(6);
const wrapperCol = ref<number>(18);
// 列表 - 查询条件
const generateFilterData = () => {
  return {
    id: '',
    name: '',
    enName: '',
    loginName: '',
    jobNumber: '',
    orgId: props.parameter.orgId || '',
    orgName: '',
    treeOrgName: props.parameter.orgName || '',
    sex: '',
    source: '',
    type: '',
    enableStatus: '',
    cooperatingOrgId: '',
    createAt: [],
    appId: props.parameter?.appId || '',
    tenantCode: props.parameter?.tenantCode || '',
  };
};
const filterData = ref(generateFilterData());

const roleFormat = (data: QueryRoleForm[]) => {
  const result: Record<string, any>[] = [];
  if (data && data.length > 0) {
    // 存在的平台
    const apps = {appIds: [] as string[], appNames: [] as string[]};
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      if (item.type === 'app' && item.appId && !apps.appIds.includes(item.appId)) {
        apps.appIds.push(item.appId);
        apps.appNames.push(item.appName || '');
      }
    }
    // 平台级、应用级
    const types: string[] = apps.appIds.length > 1 ? ['platform'] : ['platform', 'app'];
    for (let i = 0; i < types.length; i += 1) {
      const params = {type: t(`security.role.index.form.type.${types[i]}`), data: [] as QueryRoleForm[]};
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data) {
        if (types[i] === item.type) {
          params.data.push(item);
        }
      }
      result.push(params);
    }
    // 具体应用级
    if (apps.appIds.length > 1) {
      for (let i = 0; i < apps.appIds.length; i += 1) {
        const params = {type: apps.appNames[i], data: [] as QueryRoleForm[]};
        // eslint-disable-next-line no-restricted-syntax
        for (const item of data) {
          if (item.type === 'app' && item.appId === apps.appIds[i]) {
            params.data.push(item);
          }
        }
        result.push(params);
      }
    }
  }
  // 清理空数据
  const indexs: number[] = [];
  for (let i = 0; i < result.length; i += 1) {
    if (!result[i].data || result[i].data.length === 0) {
      indexs.push(i);
    }
  }
  indexs.sort((a, b) => b - a);
  for (let i = 0; i < indexs.length; i += 1) {
    result.splice(indexs[i], 1);
  }

  return result;
}

/**
 * 分页查询方法
 * @param params
 */
const fetchData = async (params: PageQueryRequest) => {
  setLoading(true);
  try {
    const {data} = await pageQueryList(params);
    renderData.value = data.items.table as PageQueryFilter[];
    roleData.value = roleFormat(data.items.role as QueryRoleForm[]);
    pagination.current = params.current;
    pagination.pageSize = basePagination.pageSize;
    pagination.total = data.total;
    emits('fetch', 'success', renderData.value);
  } catch (err) {
    emits('fetch', 'fail');
  } finally {
    setLoading(false);
  }
};

const switchRU = async (params?: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    await switchRoleUser({...params} as QueryRoleUserForm);
    if (successBack && typeof successBack === 'function') successBack();
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack();
  }
}

const insertRU = async (params?: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    await insertRoleUser({...params} as QueryRoleUserForm);
    if (successBack && typeof successBack === 'function') successBack();
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack();
  }
}

/**
 * 查询 - 基础
 * 排序，页数，条数，过滤
 * @param ev
 */
const search = (ev?: Event) => {
  fetchData({
    ...basePagination, ...filterData.value, order: lastSort.value
  } as unknown as PageQueryRequest);
};
/**
 * 条件查询 - 搜索
 * 排序，页数（1），条数，过滤（√）
 * @param ev
 */
const condition = (ev?: Event) => {
  basePagination.current = 1;
  search();
}
/**
 * 条件查询 - 重置
 * 排序，页数（1），条数，过滤（×）
 */
const reset = (ev?: Event) => {
  basePagination.current = 1;
  filterData.value = generateFilterData();
  search();
};
/**
 * 分页 - 页面跳转
 * 排序，页数（current），条数，过滤
 * @param current
 */
const onPageChange = (current: number) => {
  basePagination.current = current;
  search();
};
/**
 * 分页 - 数据条变更
 * 排序，页数（current），条数（pageSize），过滤
 * @param pageSize
 */
const onPageSizeChange = (pageSize: number) => {
  basePagination.current = 1;
  basePagination.pageSize = pageSize;
  search();
}
/**
 * 分页 - 排序变更
 * 排序（dataIndex|direction），页数（1），条数，过滤
 * @param dataIndex 排序字段
 * @param direction 排序方向
 */
const onSorterChange = (dataIndex: string, direction: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(sortable.value)) {
    // @ts-ignore
    sortable.value[key].sortOrder = dataIndex === key ? direction : '';
  }
  lastSort.value = direction ? `${dataIndex}|${direction}`.replace(/end/g, '') : '';
  basePagination.current = 1;
  search();
}

/**
 * 文本域查看
 * @param content
 */
const openModal = (content: string) => {
  Modal.open({'content': content, 'footer': false, 'simple': true});
}

const listParams = ref({
  visible: false,
  parameter: {userId: '', appId: '', tenantCode: ''},
  formState: 'edit',
  filterCol: 2,
  height: window.innerHeight * 0.8 - 260,
  pageSize: 50,
  modalHeight: window.innerHeight * 0.8,
  modalWidth: '80%',
  modalTitle: '',
});

/**
 * 列表按钮 - 查看表单
 * @param id
 */
const userRoles = (data: Record<string, any>) => {
  Object.assign(listParams.value, {
    modalTitle: `${data.name} 关联角色`,
    visible: true, formState: props.formState, parameter: {
      userId: data.id,
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
  });
}

const tabsformParams = ref({
  visible: false,
  isModal: true,
  title: '',
  width: '80%',
  height: window.innerHeight * 0.8,
  parameter: {type: '', appId: '', tenantCode: ''},
  formState: 'add',
  id: '',
  formCol: 2,
});
const editRole = (data: QueryRoleForm) => {
  Object.assign(tabsformParams.value, {
    id: data.id, visible: true, formState: 'edit', parameter: {
      type: props.parameter?.appId ? 'app' : '',
      appId: props.parameter?.appId || '',
      tenantCode: props.parameter?.tenantCode || ''
    }
  });
}

const switchBeforeChange = async (roleId: string, userId: string, successBack?: any,) => {
  let isSuccess = false;
  await switchRU({'roleId': roleId, 'userId': userId}, () => {
    isSuccess = true;
    Message.success('操作成功！');
  });
  return isSuccess;
}

const roleUsers = (data: QueryRoleForm) => {
  const userIds: string[] = [];
  const userNames: string[] = [];
  let isAll = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of renderData.value) {
    userIds.push(item.id);
    // @ts-ignore
    userNames.push(`${item.name}${item[data.id] === true ? ' √' : ''}`);
    // @ts-ignore
    if (item[data.id] === false) isAll = false;
  }
  if (userIds.length > 0) {
    Modal.open({
      title: `批量${isAll ? '取消关联' : '关联'}`,
      titleAlign: 'start',
      content: () => h(compile(
          `<strong>${data.name}</strong>&nbsp;
                    <strong style="color: rgb(var(--success-6))">${isAll ? '取消关联' : '关联'}</strong>&nbsp;
                    当前展示的所有用户？<br/>
                    <span  style="display: -webkit-box;overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;margin-top: 5px;border-top: 1px solid var(--color-neutral-6);"
                    title="${userNames.join('，')}">${userNames.join('，')}</span>`)),
      onOk: async () => {
        if (isAll) {
          await switchRU({'roleId': data.id, 'userId': userIds.join(',')}, () => {
            Message.success('操作成功！');
            // eslint-disable-next-line no-restricted-syntax
            for (const item of renderData.value) {
              if (userIds.includes(item.id)) {
                // @ts-ignore
                item[data.id] = false;
              }
            }
          });
        } else {
          await insertRU({'roleId': data.id, 'userId': userIds.join(',')}, () => {
            Message.success('操作成功！');
            // eslint-disable-next-line no-restricted-syntax
            for (const item of renderData.value) {
              if (userIds.includes(item.id)) {
                // @ts-ignore
                item[data.id] = true;
              }
            }
          });
        }
      }
    });
  } else {
    Message.warning('请选择用户！');
  }
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    scroll.value.y = props.height;
    tabsformParams.value.height = window.innerHeight * 0.8;
    listParams.value.modalHeight = window.innerHeight * 0.8;
    listParams.value.height = window.innerHeight * 0.8 - 260;
    basePagination.pageSize = props.pageSize;
    listParams.value.parameter = {
      userId: '',
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || ''
    }
    // 加载数据
    reset();
  }
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal v-model:visible="listParams.visible"
           :footer="false"
           :title="listParams.modalTitle"
           :width="listParams.modalWidth"
           title-align="start">
    <div :style="{height:`${listParams.modalHeight}px`}">
      <UserRoleList :filterCol="listParams.filterCol"
                    :formState="listParams.formState"
                    :height="listParams.height"
                    :pageSize="listParams.pageSize"
                    :parameter="listParams.parameter"
                    :visible="listParams.visible"/>
    </div>
  </a-modal>
  <RoleTabsForm v-model:visible="tabsformParams.visible"
                :formCol="tabsformParams.formCol"
                :formState="tabsformParams.formState"
                :height="tabsformParams.height"
                :isModal="tabsformParams.isModal"
                :modelValue="tabsformParams.id"
                :parameter="tabsformParams.parameter"
                :title="tabsformParams.title"
                :width="tabsformParams.width"
                @saveSuccess="condition"/>
  <a-row>
    <a-col :flex="1">
      <a-form :label-col-props="{ span: labelCol }" :model="filterData" :wrapper-col-props="{ span: wrapperCol }" label-align="left">
        <a-row :gutter="wrapperCol">
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.user.index.form.name')" field="name">
              <a-input v-model="filterData.name" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.user.index.form.loginName')" field="loginName">
              <a-input v-model="filterData.loginName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.user.index.form.orgName')" field="code">
              <a-input v-if="parameter.orgName" v-model="filterData.treeOrgName" readonly style="color: rgb(var(--primary-6))"/>
              <a-input v-else v-model="filterData.orgName" allow-clear @clear="condition($event)" @press-enter="condition($event)"/>
            </a-form-item>
          </a-col>
          <a-col :span="(labelCol+wrapperCol)/filterCol">
            <a-form-item :label="$t('security.user.index.form.enableStatus')" field="enableStatus">
              <a-select v-model="filterData.enableStatus" :placeholder="$t('searchTable.form.selectDefault')"
                        allow-clear @clear="condition($event)" @change="condition">
                <a-option v-for="item of enableStatusOptions" :key="item.value as string" :label="$t(`${item.label}`)" :value="item.value"/>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider direction="vertical" style="height: 84px"/>
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :size="18" direction="vertical" style="align-items: flex-start;">
        <a-button type="primary" @click="condition($event)">
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
  <a-table
      :bordered="{cell:true}"
      :columns="([] as TableColumnData[])"
      :data="renderData"
      :loading="loading"
      :pagination="pagination"
      :scroll="scroll"
      :scrollbar="scrollbar"
      :stripe="true"
      column-resizable
      row-key="id"
      @pageChange="onPageChange" @pageSizeChange="onPageSizeChange" @sorter-change="onSorterChange">
    <template #columns>
      <a-table-column :title="$t('security.user.index.form.index')" :width="70" align="center" fixed="left" data-index="index">
        <template #cell="{  rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
      </a-table-column>
      <a-table-column title="用户信息">
        <a-table-column :ellipsis="true" :title="$t('security.user.index.form.name')" :tooltip="true" :width="150" fixed="left" data-index="name">
          <template #cell="{ record }">
            <CopyToClipboard v-if="record.name" :model-value="record.name"/>
            {{ record.name }}
          </template>
        </a-table-column>
        <a-table-column :ellipsis="true" :title="$t('security.user.index.form.loginName')" :tooltip="true" :width="150" fixed="left" data-index="loginName">
          <template #cell="{ record }">
            <CopyToClipboard v-if="record.loginName" :model-value="record.loginName"/>
            {{ record.loginName }}
          </template>
        </a-table-column>
        <a-table-column :ellipsis="true" :title="$t('security.user.index.form.orgName')" :tooltip="true" :width="150" data-index="orgName"/>
        <a-table-column :title="$t('security.user.index.form.enableStatus')" :width="90" data-index="enableStatus">
          <template #cell="{ record }">
            {{ $t(`security.user.index.form.enableStatus.${record.enableStatus}`) }}
          </template>
        </a-table-column>
      </a-table-column>
      <a-table-column v-for="(nape,n) of roleData" :key="n" :title="nape.type">
        <a-table-column v-for="(item,index) of nape.data" :key="index" :ellipsis="true" :tooltip="true" :width="180" :title="item.name" :dataIndex="item.id"
                        align="center">
          <template #title>
            <a-popover :title="item.name" position="tr" style="max-width: 300px">
              <span style="cursor: pointer;">
                <span v-if="item.type==='platform'" style="font-weight: bold">{{ item.name }}</span>
                <span v-else>{{ item.name }}</span>
                &nbsp;<icon-info-circle/>
              </span>
              <template #content>
              <span>
                <strong>编码：</strong>{{ item.code }}
                <GlCopyToClipboard v-model="item.code" title="点击复制编码"/>
              </span>
                <br/>
                <span>
                <strong>权重：</strong>{{ item.weight }}
              </span>
                <br/>
                <span>
                <strong>类型：</strong>{{ $t(`security.role.index.form.type.${item.type}`) }}
              </span>
                <br/>
                <strong v-if="['app'].includes(item.type)">应用：</strong>
                <span v-if="item.appName&&['app'].includes(item.type)">{{ item.appName }}
              </span>
                <br v-if="['app'].includes(item.type)"/>
                <span :title="item.description" class="span-textarea">
                <strong>描述：</strong>{{ item.description }}
              </span>
                <a-divider v-if="!parameter.appId || (!!parameter.appId&&item.appId===parameter.appId)" style="margin: 5px 0px"/>
                <a-space v-if="!parameter.appId || (!!parameter.appId&&item.appId===parameter.appId)"
                         style="display: flex;align-items: center;justify-content: end;">
                  <a-button :disabled="formState==='view'" size="mini" type="primary" @click="editRole(item)">
                    {{ $t('searchTable.columns.operations.edit') }}
                  </a-button>
                  <a-button :disabled="formState==='view'" size="mini" status="success" type="primary" @click="roleUsers(item)">
                    {{ $t('security.orgUser.index.form.relevance') }}
                  </a-button>
                </a-space>
              </template>
            </a-popover>
          </template>
          <template #cell="{record}">
            <a-switch :disabled="formState==='view'"
                      v-model="record[item.id]" :before-change="newValue => switchBeforeChange(item.id,record.id)">
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
      <a-table-column v-if="false" :title="$t('security.user.index.form.operations')" :width="110" align="center" data-index="operations" fixed="right">
        <template #cell="{ record }">
          <a-button size="small" type="text" @click="userRoles(record)">
            {{ $t('security.orgUser.index.form.relevance') }}
          </a-button>
        </template>
      </a-table-column>
    </template>
  </a-table>
</template>

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

span.textarea-span {
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>