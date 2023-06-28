import type {TableColumnData} from "@arco-design/web-vue/es/table/interface";
import type {EntityReader} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";

export type SizeProps = "mini" | "small" | "medium" | "large";
export type Column = TableColumnDataPlus & { checked?: true };

export interface TableColumnDataPlus extends TableColumnData {
    // TODO 和xRenderScript的关系？
    xRenderFnBody: string;
    // 数据显示的处理脚本
    xRenderScript: string;
    // 用于编辑该字段的组件，作为子表时用到
    xEditComponent?: ComponentInstance;
    // 是否显示，用于控制数据查询加载，但不展示，可用于前端列计算或record传值，恒等于false时才不显示
    xShow?:boolean;
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