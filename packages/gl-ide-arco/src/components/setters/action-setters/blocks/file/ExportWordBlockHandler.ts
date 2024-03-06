import type IBlockHandler from '../BlockHandler'
import { type PropsExpressions, blocksHandler, CommandBlocks } from '../BlockHandler'
import ParseResult from '../ParseResult'
import usePromise from '../../hooks/usePromise'
import { utils } from '@geelato/gl-ui'

export default class ExportWordBlockHandler implements IBlockHandler {
  getName(): string {
    return 'ExportWordBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const fileName = propsExpressions?.fileName ? propsExpressions.fileName : `"${props.fileName}"`
    const respVarName = props.respVarName || utils.gid('resp')
    props.respVarName = respVarName
    const awaitStr = props.enableAwait ?'await':''
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
      `$gl.vars.${respVarName} = ${awaitStr}  $gl.fileApi.exportFile(${fileName},"${
        props.fileTemplate?.templateId
      }","${props.dataType}",$gl.vars.${props.varName}).then(${fulfilled},${rejected})
            `
    )
  }
}

interface Props {
  fileName: string
  fileTemplate: any
  // mql | data，数据类型有可能是最新的数据结果（data），也有可能是用于后端查询获取数据结果的（gql）
  dataType: string
  // 从上下文中的数据变量名
  varName?: object
  // 是否同步执行
  enableAwait?: boolean
  // 请返回的结果
  respVarName: string
  // 回调
  invokeBlocks: Array<String>
  // 回调成功参数名
  fulfilledVarName: string
  // 回调失败参数名
  rejectedVarName: string
}

blocksHandler.register(new ExportWordBlockHandler(), CommandBlocks.CommandBlockOne)
