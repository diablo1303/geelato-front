import type IBlockHandler from '../../BlockHandler'
import ParseResult from '../../ParseResult'
import type { PropsExpressions } from '../../BlockHandler'
import { blocksHandler, CommandBlocks } from '../../BlockHandler'

export default class SetVarApiBlockHandler implements IBlockHandler {
  getName(): string {
    return 'SetVarApiBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    // 这里优先用props.varValue的值，是为了解决历史数据问题，之前是基于propsExpressions配置的，现在直接用varValue值配置
    return new ParseResult(
        `
            let ${props.varName} = ${props.varValue || propsExpressions?.varValue || 'undefined'} ;
            `
    )
  }
}

interface Props {
  // 变量名，不需要带“$gl.vars.”
  varName: string
  varValue: any
  remark?: string
}

blocksHandler.register(new SetVarApiBlockHandler(), CommandBlocks.CommandBlockOne)
