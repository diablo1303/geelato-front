import type {TableColumnData} from "@arco-design/web-vue/es/table/interface";
import type {EntityReader} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";

export type SizeProps = "mini" | "small" | "medium" | "large";
export type Column = TableColumnDataPlus & { checked?: true };

export interface TableColumnDataPlus extends TableColumnData {
    xRenderFnBody: string;
    xRenderScript: string;
    xEditComponent?: ComponentInstance;
}

export interface TableMeta {
    columns: TableColumnDataPlus[];
    columnResizable?: boolean;
    entityReaderInfo: EntityReader;
    enableI18n?: boolean;
    rowSelection?: object;
    size?: SizeProps;
}

export class BaseInfo {
    tableTitle: string = ''
    entityName: string = ''
    showQuery: boolean = true
    showToolbar: boolean = true
    showPagination: boolean = true
    // 表格外框间距
    tablePadding?: string | number
    // 启用表格编辑（表格内编辑）
    enableEdit?: boolean = false
    // 作为表单的子表
    isFormSubTable?: boolean = false
    // 外键，对应主表ID字段
    subTablePidName?: string = ''
    // 显示序号
    showSeqNo?: boolean = false
    // 左边固定数
    leftFixedCount: number = 0

    checkType: 'checkbox' | 'radio' | undefined = undefined
    // checkType 为checkbox时，showCheckAll才有效
    showCheckAll?: boolean = false
    // 数据删除模式是否为逻辑删除模式
    isLogicDeleteMode?: boolean = true
}

const defaultTable: TableMeta = {
    columns: [],
    entityReaderInfo: {} as EntityReader,
};
export {defaultTable};

// 强制约定，实体需要有逻辑删除字段delStatus
export const logicDeleteFieldName = 'delStatus'