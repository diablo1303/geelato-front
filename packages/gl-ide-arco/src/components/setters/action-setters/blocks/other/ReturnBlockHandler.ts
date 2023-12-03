import type IBlockHandler from "../BlockHandler";
import type {PropsExpressions} from "../BlockHandler";
import ParseResult from "../ParseResult";
import {blocksHandler, CommandBlocks} from "../BlockHandler";


export default class ReturnBlockHandler implements IBlockHandler {
  getName(): string {
    return 'ReturnBlockHandler'
  }
  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    return new ParseResult(
      `
            return ${propsExpressions?.content || props.content};
            `
    )
  }
}

export class Props {
    content: string = ''
}

blocksHandler.register(new ReturnBlockHandler(), CommandBlocks.CommandBlockOne)