import type IBlockHandler from '../BlockHandler'
import { type PropsExpressions, blocksHandler, CommandBlocks } from '../BlockHandler'
import ParseResult from '../ParseResult'
import useVars from '../../hooks/vars'
import usePromise from '../../hooks/usePromise'
import { utils } from '@geelato/gl-ui'

const vars = useVars()
export default class EntitySaverBlockHandler implements IBlockHandler {
  getName(): string {
    return 'EntitySaverBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const entitySaverVarStr = vars.getVarStr(props.entitySaverVar)
    // const awaitStr = `${props.enableAwait ? 'await ' : ''}`
    const varStr = vars.getVarStr(props.resultVar,'entity')
    props.resultVar = varStr.substring(9)
    let returnStr = ''
    if (props.enableReturn) {
      returnStr = `return ${varStr}`
    }

    const fulfilledVarName = props.fulfilledVarName || utils.gid('res', 8)
    props.fulfilledVarName = fulfilledVarName
    const rejectedVarName = props.rejectedVarName || utils.gid('e', 8)
    props.rejectedVarName = rejectedVarName
    const { fulfilled, rejected } = usePromise(
      props.invokeBlocks || [],
      fulfilledVarName,
      rejectedVarName
    )

    return new ParseResult(
      `${varStr} = $gl.entityApi.saveEntity(${entitySaverVarStr}).then(${fulfilled},${rejected});
       ${returnStr}
          `
    )
  }
}

class Props {
  // 实体保存的变量名
  entitySaverVar: string = ''
  // 执行该方法后，返回执行结果
  enableReturn: Boolean = true
  // 是否启用同步执行
  // enableAwait: Boolean = false
  // 返回结果，存储到变量
  resultVar?: string

  // 回调
  invokeBlocks: Array<String> = []
  // 回调成功参数名
  fulfilledVarName: string = ''
  // 回调失败参数名
  rejectedVarName: string = ''
}

blocksHandler.register(new EntitySaverBlockHandler(), CommandBlocks.CommandBlockOne)
