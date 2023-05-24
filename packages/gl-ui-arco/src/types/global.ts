export interface AnyObject {
    [key: string]: unknown;
}

export interface Options {
    value: unknown;
    label: string;
}

export interface NodeOptions extends Options {
    children?: NodeOptions[];
}

export interface GetParams {
    body: null;
    type: string;
    url: string;
}

export interface PostData {
    body: string;
    type: string;
    url: string;
}

export interface Pagination {
    current: number;
    pageSize: number;
    total?: number;
    showPageSize: boolean;
    pageSizeOptions: Array<number>
}

export type Status = 'normal' | 'warning' | 'success' | 'danger'

/**
 * 操作
 */
export interface Action {
    title: string,
    // 绑定的函数名称
    fn: string,
    // 状态，用于展示按钮或链接的样式
    status?: Status,
}

export type TimeRanger = [string, string];

export interface GeneralChart {
    xAxis: string[];
    data: Array<{ name: string; value: number[] }>;
}
