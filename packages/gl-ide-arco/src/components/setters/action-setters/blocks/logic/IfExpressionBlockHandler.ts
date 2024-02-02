import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import { blocksHandler, CommandBlocks } from '../BlockHandler'

export default class IfExpressionBlockHandler implements IBlockHandler {
  getName(): string {
    return 'IfExpressionBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const expression = props.expression || propsExpressions?.expression
    return new ParseResult(
      `
      ${props.mode === 'if' ? 'if' : 'else if'}(${expression}){`,
      `}`
    )
  }
}

export class Props {
  // if | else if
  mode: string = 'if'
  expression: string = ''
}

blocksHandler.register(new IfExpressionBlockHandler(), CommandBlocks.CommandBlockTwo)
