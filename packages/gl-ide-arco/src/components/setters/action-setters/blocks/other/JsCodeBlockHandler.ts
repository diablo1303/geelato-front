import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";
import {blocksHandler, CommandBlocks} from "../BlockHandler";


export default class JsCodeBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        return new ParseResult(
            `
            ${propsExpressions?.code || props.code};
            `
        )
    }
}

interface Props {
    code: string
    description: string
}
blocksHandler.register(new JsCodeBlockHandler(), CommandBlocks.CommandBlockOne)