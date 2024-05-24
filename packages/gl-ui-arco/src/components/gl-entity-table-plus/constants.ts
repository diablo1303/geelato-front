import type {RenderFunction} from "vue";
import type {TableColumnData} from "@arco-design/web-vue";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import type {EntityReader, EntityReaderOrder, EntityReaderParam} from "@geelato/gl-ui";

export const SlotNameSeq: string = '__slot__seq'
export const SlotNameRecordStatus: string = '__slot__record_status'


export type Column = GlTableColumn & { checked?: true }

export interface TableMeta {
    columns: GlTableColumn[]
    columnResizable?: boolean
    entityReaderInfo: EntityReader
    enableI18n?: boolean
    rowSelection?: object
    size?: SizeProps
}

export class BaseInfo {
    // 表格标题
    label: string = ''
    // 隐藏标题，默认为隐藏
    hideLabel?: boolean
    entityName: string = ''
    showQuery: boolean = true
    // 隐藏重置按钮
    hideReset?: boolean
    // 是否在初始化之后触发查询
    triggerByInit: boolean = true
    // 是否在查询条件值改变之后自动触发查询
    triggerByValueChange: boolean = true

    // 显示工具条
    showToolbar: boolean = true
    // 显示添加一行操作
    showAddRowBtn: boolean = true
    // 显示分页
    showPagination: boolean = true
    // 表格外框间距
    tablePadding?: string | number
    // 启用表格编辑（表格内编辑）
    enableEdit?: boolean = false
    // 作为表单的子表
    isFormSubTable?: boolean = false
    // 外键，对应主表ID字段，这里不能为id字段
    subTablePidName?: string = ''
    // 显示序号
    showSeqNo?: boolean = false
    // 左边固定数
    leftFixedCount: number = 0

    // 启用行拖动
    tableDraggable?: boolean
    // 当行拖动之后，自动重新设置排序号
    autoResetSeqNoAfterDrag?: boolean

    checkType: 'checkbox' | 'radio' | undefined = undefined
    // checkType 为checkbox时，showCheckAll才有效
    showCheckAll?: boolean = false
    // 点击行数据时，选中该行，相当于点击了行的选择器
    clickAsCheck?: boolean = false
    // 数据删除模式是否为逻辑删除模式 !!！暂不支持，平台全为逻辑删除
    isLogicDeleteMode?: boolean = true
    // 行是否只计的表达式，用于控制在一些场景下，如某行的数据已审批，则不能编辑
    isRowReadonlyExpression?: string
    //  基于表达式计算出来的值，_propsExpression的示例值：{label:“用户列表”}
    _propsExpressions? = {}
}

/**
 *  定义导出表格的列
 */
export interface ExcelColumnMeta {
    // 数据key，对应导出excel中的var
    dataIndex?: string
    // 列标题，对应导出excel中的placeholder，不包括符号${}的部分
    title?: string | RenderFunction
    // 列单元格的宽度
    width?: number
    // 列标题的对齐，默认为center
    align?: 'left' | 'center' | 'right'
    // 导出excel列上的注释信息
    description?: string
    children?: ExcelColumnMeta[]
}

/**
 *  定义导出的excel值单元格的格式
 */
export enum ExcelCellValueType {
    // 字符串
    STRING = 'STRING',
    // 数值
    NUMBER = 'NUMBER',
    // 日期
    DATE = 'DATE',
    // 时间
    DATETIME = 'DATETIME'
}

/**
 *  定义导出的excel值的取值方式
 */
export enum ExcelCellValueComputeMode {
    // 变量
    VAR = 'VAR',
    // 常量
    CONST = 'CONST',
    // 表达式
    EXPRESSION = 'EXPRESSION'
}

export const ExcelCellValueTypeOptions = [
    { label: '字符串', value: 'STRING' },
    { label: '数值', value: 'NUMBER' },
    { label: '日期', value: 'DATE' },
    { label: '时间', value: 'DATETIME' }
]

export const ExcelCellValueComputeModeOptions = [
    { label: '变量', value: 'VAR' },
    { label: '常量', value: 'CONST' },
    { label: '计算公式', value: 'EXPRESSION' }
]

/**
 *  定义导出Excel的元数据
 */
export class ExcelCellMeta {
    // excel中的占位符，如${单号}
    placeholder: string = ''
    // 单元格的数据类型
    valueType: ExcelCellValueType = ExcelCellValueType.STRING
    // 单元格的取计模式
    valueComputeMode: ExcelCellValueComputeMode = ExcelCellValueComputeMode.VAR
    // 单元格取值模式为变量时的变量名
    var?: string
    // 单元格取值模式为变量时，且是从列表中获取的，其列表变量名
    listVar?: string
    // 单元格取值模式为常量时的常量值
    constValue?: any
    // 单元格取值模式为表达式时的表达式内容
    expression?: string
    // 是否为图片
    isImage?: boolean
    imageWidth?: number
    imageHeight?: number
    // 是否为列表
    isList?: boolean
    isMerge?: boolean
    isUnique?: boolean
    description?: string
}

/**
 *  定义GlTable的列
 */
export interface GlTableColumn extends TableColumnData {
    // 控制整列是否显示，而_component中的hidden是控制列内的组件是否显示，列标题还是会显示，
    // 是否显示，有没有该字段数据都会加载，只是在页面不展示，可用于前端列计算或record传值，恒等于false时不显示
    // 即renderColumns中的数据中有些例有可以_show为false
    _show?: boolean
    // 列图标的名称，如:gl-api
    _icon?: string
    // 列图标的颜色
    // _iconColor?: string
    // 数据显示的处理脚本
    _renderScript: string
    // 用于编辑表格时，作为编辑组件
    // 用于展示表格时，作为展示组件，展示特殊的数据
    _component?: ComponentInstance
    // 如果_renderScript、_component都为空时，表示没有自定义渲染
    _noCustomRender?: boolean
    // 是否必填，用于编辑状态
    _required?: boolean
    // 用于运行时表格配置时，设置是否在列表中展示该列
    _checked?: boolean
    // ！！！【待删除】需要自定义render函数时使用，目前暂未应用，优先采用_renderScript
    _renderFnBody: string
    // 背景色
    _bgColor?: string

    // 脚本运算时动态加入的
    _propsExpressions?: object

    // 描述信息
    _description?: string

    /********* 以下为导出到Excel中用到的属性  ***********/
    // 数据若需导出到Excel中，且需要计算时，其计算脚本。
    // 需注意，该脚本在服务端运行，需确保是服务端支持的脚本
    // _excelRenderScript: string
    // 该列的数据类型
    // _valueType?: ExcelCellValueType
    _cellMeta?: ExcelCellMeta
}


export type SizeProps = 'mini' | 'small' | 'medium' | 'large'
export type GenShowColumnOptions = {
    // 是否通过组件来控制列是否展示，场景1，应用于编辑表，值为true;场景2，应用于查询表，值为false
    isShowByComponent: boolean
    // 是否需要展示操作列，默认需要，可按需设置是否展示，如在没有Actions时可以设置为无
    showOptColumn?: boolean
    // 是否显示序号列
    showSeqNoColumn?: boolean
    // 显示记录状态列
    showRecordStatus?: boolean
}

/**
 *  在查询列表中，用于用户操作的查询信息，如查询条件、选择的页码信息
 */
export type EntityFetchDataInfo = {
    // 每页记录数
    pageSize?: number
    // 第几页
    pageNo?: number
    // 排序字段
    order?: Array<EntityReaderOrder>
    // 查询参数
    params?: Array<EntityReaderParam>
    // 额外的查询keys，需要作为params的or条件
    pushedRecordKeys?: string[]
    // 排除的查询keys，需要作为params的and条件
    unPushedRecordKeys?: string[]
}
/**
 * 构建fetchData的初始化props
 */
export type EntityFetchDataProps = {
    entityName: string
    isSubForm: boolean
    subFormPidName: string
}

export enum RecordPushStatus {
    ToDelete = 'ToDelete',
    ToAdd = 'ToAdd',
    None = 'None'
}

export const RecordPushStatusNames = {
    ToDelete: '待删除',
    ToAdd: '待新增',
    None: '-'
}

// 我的过滤器
import type { QueryItemKv } from '../gl-query/query'

export type FilterType = {
    id: string
    name: string
    // 显示在工具条上
    showOnToolbar: boolean
    // 过滤项的键值
    queryItemKvs: QueryItemKv[]
}

/**
 *  个性化配置
 */
export type MyEntityTableConfig = {
    // 我的常用过滤器
    filters: FilterType[]
}
