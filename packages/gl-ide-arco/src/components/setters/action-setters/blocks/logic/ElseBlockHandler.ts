import type IBlockHandler from '../BlockHandler'
import ParseResult from '../ParseResult'

export default class ElseBlockHandler implements IBlockHandler {
  parseToScript(props: Props): ParseResult {
    if (!props.description) {
      props.description = ''
    }
    return new ParseResult(`else{`, `}`).setBlockName('ElseBlock')
  }
}

export class Props {
  description: string | undefined
}
