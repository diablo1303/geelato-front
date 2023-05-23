import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";


export default class ElseBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {
        return new ParseResult(`else{`,`}`).setBlockName('ElseBlock');
    }
}

export class Props {
}