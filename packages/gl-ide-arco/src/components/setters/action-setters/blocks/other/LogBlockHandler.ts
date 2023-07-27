import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";


export default class LogBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        return new ParseResult(
            `
            $gl.fn.log({content:${propsExpressions?.content || props.content}});
            `
        ).setBlockName('LogBlockHandler');
    }
}

export class Props {
    content: string = ''
}