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

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
  showPageSize?: boolean;
  pageSizeOptions?: Array<number>
}