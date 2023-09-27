import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";
import {blocksHandler, CommandBlocks} from "../BlockHandler";


export default class LogBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        return new ParseResult(
            `
            $gl.fn.log({content:${propsExpressions?.content || props.content}});
            `
        )
    }
}

export class Props {
    content: string = ''
}

blocksHandler.register(new LogBlockHandler(), CommandBlocks.CommandBlockOne)