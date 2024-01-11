import type IBlockHandler from '../BlockHandler'
import ParseResult from '../ParseResult'
import { blocksHandler, CommandBlocks } from '../BlockHandler'
import useVars from "../../hooks/vars";

const vars = useVars()
export default class TriggerComponentActionBlockHandler implements IBlockHandler {
  getName(): string {
    return 'TriggerComponentActionBlockHandler'
  }

  parseToScript(props: Props): ParseResult {
    const awaitStr = `${props.enableAwait ? 'await ' : ''}`
    const varStr = vars.getVarStr(props.resultVar)
    const returnStr = props.enableReturn? `return ${varStr};` : ''
    if(props.resultVar){
      return new ParseResult(
          `${varStr} = ${awaitStr}$gl.fn.triggerComponentAction("${props.componentId}","${props.actionName}");${returnStr}`
      )
    }else{
      return new ParseResult(
          `${awaitStr}$gl.fn.triggerComponentAction("${props.componentId}","${props.actionName}");${returnStr}`
      )
    }
  }
}

export class Props {
  appId: string = ''
  extendId: string = ''
  componentId: string = ''
  eventName: string = ''
  actionName: string = ''
  // 执行该方法后，返回执行结果
  enableReturn: Boolean = true
  // 是否启用同步执行
  enableAwait: Boolean = false
  // 返回结果，存储到变量
  resultVar?: string
}

blocksHandler.register(new TriggerComponentActionBlockHandler(), CommandBlocks.CommandBlockOne)
