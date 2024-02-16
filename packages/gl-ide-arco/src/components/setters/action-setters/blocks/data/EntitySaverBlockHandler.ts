import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import { blocksHandler, CommandBlocks } from '../BlockHandler'
import useVars from "../../hooks/vars";

const vars = useVars()
export default class EntitySaverBlockHandler implements IBlockHandler {
  getName(): string {
    return 'EntitySaverBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const entitySaverVarStr = vars.getVarStr(props.entitySaverVar)
    // const awaitStr = `${props.enableAwait ? 'await ' : ''}`
    const varStr = vars.getVarStr(props.resultVar)
    // const returnStr = props.enableReturn? `return ${varStr};` : ''
    // if(props.resultVar){
    //   return new ParseResult(
    //       `${varStr} = ${awaitStr}$gl.entityApi.saveEntity(${entitySaverVarStr});${returnStr}`
    //   )
    // }else{
    //   return new ParseResult(
    //       ` ${awaitStr}$gl.entityApi.saveEntity(${entitySaverVarStr});${returnStr}`
    //   )
    // }
    return new ParseResult(
          `${varStr} = $gl.entityApi.saveEntity(${entitySaverVarStr}).then((res)=>{
              #{fulfilled}
            },(res)=>{
              #{rejected}
            });
           if(${props.enableReturn}){
              return ${varStr}
           }
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
}

blocksHandler.register(new EntitySaverBlockHandler(), CommandBlocks.CommandBlockOne)
