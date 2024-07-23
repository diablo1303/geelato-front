<script lang="ts">
export default {
  name: 'RoleUserList'
};
</script>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import type {SelectOptionData, TableColumnData, TableData} from '@arco-design/web-vue';
import {utils, securityApi} from '@geelato/gl-ui'
import type {PageQueryFilter, PageQueryRequest,} from '@geelato/gl-ui';
// 页面所需 对象、方法
import useLoading from '../../../../hooks/loading';
import {type Pagination, PageSizeOptions} from '../../../../types/global';

// 页面所需 参数
type PageParams = {
  roleId: string;
  treeNodeId: string;
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue']);
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
// 列表 - 分页
const basePagination: Pagination = {current: 1, pageSize: props.pageSize};
const pagination = reactive({...basePagination, showTotal: true, showPageSize: true, pageSizeOptions: PageSizeOptions});
// 列表 - 滑动条
const scrollbar = ref(true);
const scroll = ref({x: 720, y: props.height});
// 列表 - 排序
const lastSort = ref<string>('seqNo|asc');

const typeOptions = computed<SelectOptionData[]>(() => [
  {value: 'folder', label: '目录'},
  {value: 'listPage', label: '列表页面'},
  {value: 'freePage', label: '自定义页面'},
  {value: 'formPage', label: '表单页面'},
  {value: 'flowPage', label: '工作流页面'},
  {value: 'templatePage', label: '模型页面'},
]);

/**
 * 分页查询方法
 * @param params
 */
const fetchRoleTreeNode = async (params: PageQueryRequest, successBack?: any, failBack?: any) => {
  setLoading(true);
  try {
    const {data} = await securityApi.pageQueryRoleTreeNodeOf(params);
    data.items.forEach((item, index) => {
      // @ts-ignore
      item.isLeaf = (item.isLeaf !== '0');
      // @ts-ignore
      item.isRoled = (item.isRoled !== '0');
    });
    if (successBack && typeof successBack === 'function') successBack(data.items);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  } finally {
    setLoading(false);
    if (failBack && typeof failBack === 'function') failBack();
  }
};

/**
 * 角色应用查询方法
 * @param params
 * @param successBack
 * @param failBack
 */
const fetchRoleApp = async (params: PageQueryRequest, successBack?: any, failBack?: any) => {
  try {
    const {data} = await securityApi.pageQueryRoleAppOf(params);
    if (successBack && typeof successBack === 'function') successBack(data.items);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 单个数据删除接口
 * @param id
 * @param successBack
 * @param failBack
 */
const deleteData = async (roleId: string, treeNodeId: string, successBack?: any, failBack?: any) => {
  try {
    await securityApi.deleteRoleTreeNodeById(roleId, treeNodeId);
    if (successBack && typeof successBack === 'function') successBack();
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
};

/**
 * 数据懒加载函数，传入时开启懒加载功能
 * @param record
 * @param done
 */
const loadMore = (record: TableData, done: any) => {
  fetchRoleTreeNode({
    ...basePagination, order: lastSort.value,
    pid: record.id || '', roleId: props.parameter.roleId || '',
    appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || '',
  } as unknown as PageQueryRequest, (data: PageQueryFilter[]) => {
    done(data);
  });
}
/**
 * 初始化
 */
const loadInit = () => {
  if (props.parameter?.appId) {
    fetchRoleTreeNode({
      ...basePagination, order: lastSort.value,
      pid: props.parameter?.appId || '', roleId: props.parameter.roleId || '',
      appId: props.parameter?.appId || '', tenantCode: props.parameter?.tenantCode || '',
    } as unknown as PageQueryRequest, (data: PageQueryFilter[]) => {
      renderData.value = data;
    });
  } else {
    fetchRoleApp({
      ...basePagination,
      roleId: props.parameter.roleId || '',
      tenantCode: props.parameter?.tenantCode || ''
    } as unknown as PageQueryRequest, (data: Record<string, any>[]) => {
      const items: PageQueryFilter[] = [];
      data.forEach((item, index) => {
        items.push({
          id: item.appId, text: item.appName, flag: 'app', iconType: item.appIcon, isRoled: false, isLeaf: false
        } as unknown as PageQueryFilter);
      });
      renderData.value = items;
    });
  }
}

/**
 * 列表按钮 - 删除
 * @param record
 */
const deleteTable = (record: Record<string, any>) => {
  deleteData(props.parameter.roleId, record.id, (id: string) => {
    record.isRoled = false;
  });
}

watch(() => props, (val) => {
  if (props.visible === true) {
    // 页面设置
    scroll.value.y = props.height;
    basePagination.pageSize = props.pageSize;
    // 加载数据
    loadInit();
  }
}, {deep: true, immediate: true});
</script>

<template>
  <a-table
      :bordered="{cell:true}"
      :columns="([] as TableColumnData[])"
      :data="renderData"
      :load-more="loadMore"
      :loading="loading"
      :pagination="false"
      :scroll="scroll"
      :scrollbar="scrollbar"
      :stripe="true"
      column-resizable
      row-key="id">
    <template #columns>
      <a-table-column :ellipsis="true" :tooltip="true" :width="240" data-index="text" title="标题">
        <template #cell="{ record }">
          &nbsp;
          <span :style="{color: record.flag==='app'?'rgb(var(--primary-6))':''}">
            <gl-iconfont :type="record.iconType"/> {{ record.text }}
          </span>
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="90" data-index="flag" title="菜单">
        <template #cell="{ record }">
          {{ record.flag === 'app' ? '应用' : (record.flag === 'menuItem' ? '菜单' : '') }}
        </template>
      </a-table-column>
      <a-table-column :ellipsis="true" :tooltip="true" :width="120" data-index="type" title="类型">
        <template #cell="{ record }">
          {{ utils.getOptionLabel(record.type, typeOptions) }}
        </template>
      </a-table-column>
      <a-table-column :width="180" data-index="updateAt" title="更新时间"/>
      <a-table-column :title="$t('security.permission.index.form.operations')" :width="90" align="center" data-index="operations" fixed="right">
        <template #cell="{ record }">
          <a-popconfirm v-if="record.isRoled" :content="$t('searchTable.columns.operations.relevance.deleteMsg')"
                        position="tr" type="warning" @ok="deleteTable(record)">
            <a-button :disabled="formState==='view'" size="small" status="danger" type="text">
              {{ $t('searchTable.columns.operations.delete') }}
            </a-button>
          </a-popconfirm>
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
</style>