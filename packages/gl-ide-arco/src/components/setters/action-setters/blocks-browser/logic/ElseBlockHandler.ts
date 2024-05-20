import type IBlockHandler from '../../BlockHandler'
import ParseResult from '../../ParseResult'
import {blocksHandler, CommandBlocks} from "../../BlockHandler";

export default class ElseBlockHandler implements IBlockHandler {
  getName(): string {
    return 'ElseBlockHandler'
  }
  parseToScript(props: Props): ParseResult {
    if (!props.description) {
      props.description = ''
    }
    return new ParseResult(`else{`, `}`)
  }
}

export class Props {
  description: string | undefined
}

blocksHandler.register(new ElseBlockHandler(), CommandBlocks.CommandBlockTwo)
