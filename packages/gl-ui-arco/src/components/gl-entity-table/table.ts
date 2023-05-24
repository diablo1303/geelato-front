import type {TableColumnData} from "@arco-design/web-vue/es/table/interface";
import type {EntityReader} from "@geelato/gl-ui";

export type SizeProps = "mini" | "small" | "medium" | "large";
export type Column = TableColumnData & { checked?: true };

export interface TableColumnDataPlus extends TableColumnData {
    xRenderFnBody: string;
    xRenderScript: string;
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
}

const defaultTable: TableMeta = {
    columns: [],
    entityReaderInfo: {} as EntityReader,
};
export {defaultTable};
