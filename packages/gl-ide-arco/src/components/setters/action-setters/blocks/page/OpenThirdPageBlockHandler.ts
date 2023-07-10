import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {Param} from "@geelato/gl-ui";

export default class OpenThirdPageBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {
        return new ParseResult(`$.fn.openWin("${props.url}",${JSON.stringify(props.params)})`).setBlockName('OpenThirdPageBlock');
    }
}

export class Props {
    url: string = '';
    params: Array<Param> = []
}
