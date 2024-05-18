import type IBlockHandler from '../BlockHandler'
import ParseResult from '../ParseResult'
import type { PropsExpressions } from '../BlockHandler'
import { blocksHandler, CommandBlocks } from '../BlockHandler'

export default class SetVarBlockHandler implements IBlockHandler {
  getName(): string {
    return 'SetVarBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    // 这里优先用props.varValue的值，是为了解决历史数据问题，之前是基于propsExpressions配置的，现在直接用varValue值配置
    let varName = props.varName
    if (props.varName?.startsWith('$gl.vars.')) {
      varName = props.varName.substring(9)
      props.varName = varName
    }else if (props.varName?.startsWith('$gl.var.')) {
      varName = props.varName.substring(8)
      props.varName = varName
    }

    if (varName) {
      return new ParseResult(
        `
            $gl.vars.${varName} = ${props.varValue || propsExpressions?.varValue || 'undefined'} ;
            `
      )
    } else {
      return new ParseResult(``)
    }
  }
}

interface Props {
  // 变量名，不需要带“$gl.vars.”
  varName: string
  varValue: any
  remark?: string
}

blocksHandler.register(new SetVarBlockHandler(), CommandBlocks.CommandBlockOne)
