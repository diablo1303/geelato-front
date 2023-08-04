import type {TableColumnData} from "@arco-design/web-vue/es/table/interface";
import type {EntityReader} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import cloneDeep from "lodash/cloneDeep";
import type {TableData} from "@arco-design/web-vue";
import {inject, toRaw} from "vue";
import {jsScriptExecutor, PageProvideKey, PageProvideProxy} from "@geelato/gl-ui";

const pageProvideProxy: PageProvideProxy | undefined = inject(PageProvideKey)

export type SizeProps = "mini" | "small" | "medium" | "large";
export type Column = TableColumnDataPlus & { checked?: true };

export interface TableColumnDataPlus extends TableColumnData {
    // TODO 和_renderScript的关系？
    _renderFnBody: string;
    // 数据显示的处理脚本
    _renderScript: string;
    // 用于编辑表格时，作为编辑组件
    // 用于展示表格时，作为展示组件，展示特殊的数据
    _component?: ComponentInstance;
    // 是否显示，用于控制数据查询加载，但不展示，可用于前端列计算或record传值，恒等于false时才不显示
    _show?: boolean;
    // 是否必填，用于编辑状态
    _required?: boolean
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
    // 表格标题
    label: string = ''
    // 隐藏标题，默认为隐藏
    hideLabel?: boolean
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
    //  基于表达式计算出来的值，_propsExpression的示例值：{label:“用户列表”}
    _propsExpressions? = {}
}

const defaultTable: TableMeta = {
    columns: [],
    entityReaderInfo: {} as EntityReader,
};
export {defaultTable};

// 强制约定，实体需要有逻辑删除字段delStatus
export const logicDeleteFieldName = 'delStatus'

export const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
        // 先替换后面的，然后拿到替换的结果替换前面的
        newArray.splice(
            beforeIdx,
            1,
            newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
        );
    }
    return newArray;
}

const evalExpression = (data: {
    record: TableData;
    column: TableColumnDataPlus;
    rowIndex: number;
}) => {
    const ctx = {
        pageProxy: pageProvideProxy,
        record: toRaw(data.record),
        column: toRaw(data.column),
        rowIndex: toRaw(data.rowIndex),
    };
    return jsScriptExecutor.evalExpression(ctx.column._renderScript, ctx);
};