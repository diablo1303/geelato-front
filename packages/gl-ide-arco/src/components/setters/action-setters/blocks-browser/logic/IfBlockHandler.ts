import type IBlockHandler from '../../BlockHandler'
import type { PropsExpressions } from '../../BlockHandler'
import ParseResult from '../../ParseResult'
import { blocksHandler, CommandBlocks } from '../../BlockHandler'

export default class IfBlockHandler implements IBlockHandler {
  getName(): string {
    return 'IfBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const target1 = props.target1 || propsExpressions?.target1
    const target2 = props.target2 || propsExpressions?.target2
    return new ParseResult(
      `
      ${props.mode === 'if' ? 'if' : 'else if'}(${target1} ${props.relationship} ${target2}){`,
      `}`
    )
  }
}

export class Props {
  // if | else if
  mode: string = 'if'
  target1: string = ''
  relationship: string = ''
  target2: string = ''
}

blocksHandler.register(new IfBlockHandler(), CommandBlocks.CommandBlockTwo)
