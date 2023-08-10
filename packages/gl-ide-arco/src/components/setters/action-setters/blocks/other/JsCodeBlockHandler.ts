import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";


export default class JsCodeBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        return new ParseResult(
            `
            ${propsExpressions?.code || props.code};
            `
        ).setBlockName('JsCodeBlockHandler');
    }
}

interface Props {
    code: string
    description: string
}