export const PageSizeOptions = [5, 10, 20, 50, 100, 200];
export type FormState = 'add' | 'edit' | 'view';

/* 过滤条件 */
export interface PageQueryFilter {
  id: string;
  createdTime: string;
}

/* 列表参数 */
export interface PageQueryRequest extends Partial<PageQueryFilter> {
  current: number;
  pageSize: number;
  order?: string;
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

export interface ListParams {
  visible?: boolean; // 页面是否显示
  parameter?: Record<string, any>; // 页面需要的参数 appId,tenantCode
  formState?: FormState; // 页面状态
  filterCol?: number; // 列表 - 搜索条件 - 一行显示个数
  pageSize?: number; // 列表 - 条数
  height?: number; // 列表 - 数据列表高度，滑动条高度
}

export interface FormParams {
  visible?: boolean; // 弹层 - 是否显示
  isModal?: boolean; // 弹层 - 方式，true-弹窗；false-抽屉
  title?: string; // 弹层 - 标题
  width?: string; // 弹层 - 宽度，为空-自然宽度
  height?: number | string; // 弹层 - 高度，为空-自然变化
  parameter?: Record<string, any>; // 页面需要的参数
  formState?: FormState; // 页面状态
  id?: string; // 表单 - 主键
  formCol?: number; // 表单 - 一行显示个数
}

export interface ModelParams {
  visible?: boolean; // 页面是否显示
  parameter?: Record<string, any>; // 页面需要的参数 appId,tenantCode
  formState?: FormState; // 页面状态
  id?: string; // 表单 - 主键
  formCol?: number; // 表单 - 一行显示个数
}

/**
 * 值处于数值的那个区间
 * @param options 数组
 * @param value 值
 * @param defaultValue 默认值
 */
export const resetValueByOptions = (options: number[], value: number, defaultValue: number) => {
  const arr = [];
  for (let i = 0; i < options.length - 1; i += 1) {
    if (i === 0) arr.push({s: 0, e: options[i]})
    arr.push({s: options[i], e: options[i + 1]})
  }
  for (let i = 0; i < arr.length; i += 1) {
    if (value > arr[i].s && value <= arr[i].e) return arr[i].e;
  }

  return defaultValue;
}

/**
 * 查询选项值对应标题
 * @param optionValue 选项值
 * @param data 选项集合
 */
export const getOptionLabel = (optionValue: string | number | boolean, data: any[]) => {
  if (data && data.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      if (item.value === optionValue) {
        return item.label;
      }
    }
  }
  return '';
}