import { computed} from 'vue';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

const columns = computed<TableColumnData[]>(() => [
  {
    title: '序号',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '部门名称',
    dataIndex: 'name',
  },
  {
    title: '部门编码',
    dataIndex: 'code',
  },
  {
    title: '部门类型',
    dataIndex: 'type',
  },
  {
    title: '排序',
    dataIndex: 'seq_no',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'create_at',
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
  }
]);

const statusOptions = computed<SelectOptionData[]>(() => [
  {
    label: '启用',
    value: 'enabled',
  },
  {
    label: '禁用',
    value: 'disabled',
  },
]);

  export {columns,statusOptions};