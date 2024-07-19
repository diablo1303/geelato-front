import type IBlockHandler from '../../BlockHandler'
import ParseResult from '../../ParseResult'
import type { PropsExpressions } from '../../BlockHandler'
import { blocksHandler, CommandBlocks } from '../../BlockHandler'
import type { ComponentInstance,ActionMeta } from '@geelato/gl-ui-schema'

export default class GetArgBlockHandler implements IBlockHandler {
  getName(): string {
    return 'GetArgBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions,componentInst?:ComponentInstance,actionMeta?: ActionMeta): ParseResult {
    // 这里优先用props.varValue的值，是为了解决历史数据问题，之前是基于propsExpressions配置的，现在直接用varValue值配置
    let varName = props.varName
    if (props.varName?.startsWith('$gl.vars.')) {
      varName = props.varName.substring(9)
      props.varName = varName
    }else if (props.varName?.startsWith('$gl.var.')) {
      varName = props.varName.substring(8)
      props.varName = varName
    }

    let paramIndex = -1
    actionMeta?.params?.forEach((param, index) => {
      if (param.name == props.paramName) {
        paramIndex = index
      }
    })

    // 如果未选择第几个参数，获取的参数值也未赋值，则不生成代码
    if (varName&&paramIndex>=0) {
      return new ParseResult(
        `$gl.vars.${varName} = $gl.ctx.args[${paramIndex}]`
      )
    } else {
      // return new ParseResult(``).setErrorMessage('未选择参数，无法生成代码')
      return new ParseResult(``)
    }
  }
}

interface Props {
  // 选择的参数索引
  paramName: string
  // 变量名，
  varName: string
}

blocksHandler.register(new GetArgBlockHandler(), CommandBlocks.CommandBlockOne)
