import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";

export default class OpenThirdPageBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {
        return new ParseResult(`window.open("${props.url}")`);
    }
}

export class Props {
    url: string = '';
    target: string = '_blank'
    // 新窗口时有效
    windowName:string = ''
}