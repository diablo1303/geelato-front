/* 过滤条件 */
export interface PageQueryFilter {
  id: string;
  createdTime: string;
}

/* 列表参数 */
export interface PageQueryRequest extends Partial<PageQueryFilter> {
  current: number;
  pageSize: number;
}

/* 列表返回结果 */
export interface PageQueryResponse {
  items: PageQueryFilter[];
  total: number;
}

/* 返回结果 */
export interface QueryResult {
  data: any;
  msg: string;
  code: number;
  status: string;
}

/* 树状列表 */
export interface SelectOption {
  value: string | number | Record<string, any>;
  label: string;
  isLeaf?: boolean; // 是否是叶子节点
  disabled?: boolean; // 是否不可选
  children?: SelectOption[]
}

/* 页面传递参数 */
export interface ListUrlParams {
  action: 'add' | 'edit' | 'view'; // 页面状态 formState
  isModal?: boolean; // 是否被引用为表单，list
  formCol?: 1 | 2; // 表单单行或双行，model
  pageSize?: 5 | 10 | 20 | 50 | 100 | 1000 | 10000; // 每页数量，list
  id?: string; // 表单主键id，model
  params?: Record<string, any>; // 参数
  closeBack?: any; // 页面关闭传递参数
  loadSuccessBack?: any; // 页面加载成功，model
  loadFailBack?: any; // 页面加载失败，model
  modalAddBack?: any; // 页面 新增按钮反馈，list
  modalEditBack?: any; //  页面 编辑按钮反馈，list
  modalDeleteBack?: any; //  页面 删除按钮反馈，list
}

/* base64参数 */
export interface Base64FileParams {
  name: string;
  size: number;
  type: string;
  base64: string;
}