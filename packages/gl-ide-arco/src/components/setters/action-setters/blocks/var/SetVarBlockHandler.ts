import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";


export default class SetVarBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        return new ParseResult(
            `
            let ${props.varName} = ${propsExpressions?.varValue || props.varValue};
            `
        ).setBlockName('SetVarBlockHandler');
    }
}

interface Props {
    varName: string
    varValue: any,
    remark?: string
}