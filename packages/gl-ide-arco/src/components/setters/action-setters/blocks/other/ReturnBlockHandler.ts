import type IBlockHandler from "../BlockHandler";
import type {PropsExpressions} from "../BlockHandler";
import ParseResult from "../ParseResult";


export default class ReturnBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        return new ParseResult(
            `
            return ${propsExpressions?.content || props.content};
            `
        ).setBlockName('ReturnBlockHandler');
    }
}

export class Props {
    content: string = ''
}