import type IBlockHandler from '../../BlockHandler'
import ParseResult from '../../ParseResult'
import type { PropsExpressions } from '../../BlockHandler'
import { blocksHandler, CommandBlocks } from '../../BlockHandler'
import { toRaw } from 'vue'

export default class LogBlockHandler implements IBlockHandler {
  getName(): string {
    return 'LogBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const method = props.method || 'log'
    const message = props.message
    console.log('LogBlockHandler message',message,'!message',!message,'!props.message',!props.message)
    if (message) {
      return new ParseResult(`console.${method}('${message}',${propsExpressions?.content || props.content});`)
    }else{
      return new ParseResult(
        `console.${method}(${propsExpressions?.content || props.content});`
      )
    }
  }
}

export class Props {
  message: string = ''
  // log error
  method: string = ''
  // 打印内容
  content: string = ''
}

blocksHandler.register(new LogBlockHandler(), CommandBlocks.CommandBlockOne)
