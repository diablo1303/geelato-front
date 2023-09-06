import type IBlockHandler from "../BlockHandler";
import type {PropsExpressions} from "../BlockHandler";
import ParseResult from "../ParseResult";

export default class ExportExcelBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        const fileName = propsExpressions?.fileName ? propsExpressions.fileName : `"${props.fileName}"`;
        return new ParseResult(
            `
            ${props.enableAwait ? 'await ' : ''} $gl.fileApi.exportExcel(${fileName},"${props.fileTemplate?.templateId}","${props.dataType}",$gl.vars.${props.varName})
            `
        ).setBlockName('ExportExcelBlock');
    }
}

interface Props {
    fileName: string
    fileTemplate: any
    // mql | data，数据类型有可能是最新的数据结果（data），也有可能是用于后端查询获取数据结果的（gql）
    dataType: string
    // 从上下文中的数据变量名
    varName?: object
    // 是否同步执行
    enableAwait?:boolean
}