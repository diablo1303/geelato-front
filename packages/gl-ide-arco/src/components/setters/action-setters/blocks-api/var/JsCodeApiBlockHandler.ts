import type IBlockHandler from "../../BlockHandler";
import ParseResult from "../../ParseResult";
import type {PropsExpressions} from "../../BlockHandler";
import {blocksHandler, CommandBlocks} from "../../BlockHandler";


export default class JsCodeApiBlockHandler implements IBlockHandler {
  getName(): string {
    return 'JsCodeApiBlockHandler'
  }
  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    return new ParseResult(
      `
            ${propsExpressions?.code || props.code};
            `
    ).endWithLineFeed()
  }
}

interface Props {
    code: string
    description: string
}
blocksHandler.register(new JsCodeApiBlockHandler(), CommandBlocks.CommandBlockOne)