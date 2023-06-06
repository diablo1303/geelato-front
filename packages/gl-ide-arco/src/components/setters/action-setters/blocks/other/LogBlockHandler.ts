import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";


export default class LogBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {
        return new ParseResult(
            `
            console.log(${props.content});
            `
        ).setBlockName('LogBlockHandler');
    }
}

export class Props {
    content: string = ''
}