import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import {blocksHandler, CommandBlocks} from "../BlockHandler";

export default class IfEmptyBlockHandler implements IBlockHandler {
  getName(): string {
    return 'IfEmptyBlockHandler'
  }

  parseToScript(props: Props): ParseResult {
    return new ParseResult(
      `${props.mode === 'if' ? 'if' : 'else if'}($gl.fn.isEmpty(${props.target})){`,
      `}`
    )
  }
}

export class Props {
    // if | else if
    mode: string = 'if'
    target: string = '';
}

blocksHandler.register(new IfEmptyBlockHandler(), CommandBlocks.CommandBlockTwo)