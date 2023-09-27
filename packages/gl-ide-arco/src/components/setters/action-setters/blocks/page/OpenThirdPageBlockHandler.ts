import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {Param} from "@geelato/gl-ui";
import {blocksHandler, CommandBlocks} from "../BlockHandler";

export default class OpenThirdPageBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {
        return new ParseResult(`$.fn.openWin("${props.url}",${JSON.stringify(props.params)})`)
    }
}

export class Props {
    url: string = '';
    params: Array<Param> = []
}

blocksHandler.register(new OpenThirdPageBlockHandler(), CommandBlocks.CommandBlockOne)