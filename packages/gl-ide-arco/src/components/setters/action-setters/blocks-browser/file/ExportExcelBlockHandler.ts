import type IBlockHandler from '../../BlockHandler'
import { type PropsExpressions, blocksHandler, CommandBlocks } from '../../BlockHandler'
import ParseResult from '../../ParseResult'
import usePromise from '../../hooks/usePromise'
import useVars from '../../hooks/vars'
import { type Param, utils } from '@geelato/gl-ui'

const { getVarStr } = useVars()
export default class ExportExcelBlockHandler implements IBlockHandler {
  getName(): string {
    return 'ExportExcelBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const fileName = propsExpressions?.fileName ? propsExpressions.fileName : `"${props.fileName}"`
    const respVarName = props.respVarName || utils.gid('resp')
    props.respVarName = respVarName
    const awaitStr = props.enableAwait ? 'await' : ''
    const fulfilledVarName = props.fulfilledVarName || utils.gid('res', 8)
    props.fulfilledVarName = fulfilledVarName
    const rejectedVarName = props.rejectedVarName || utils.gid('e', 8)
    props.rejectedVarName = rejectedVarName
    const { fulfilled, rejected } = usePromise(
      props.invokeBlocks || [],
      fulfilledVarName,
      rejectedVarName
    )
    const varName = propsExpressions?.varName ? getVarStr(propsExpressions.varName ): `"${getVarStr(props.varName)}"`

    const keyValues:any[] = []
    props.subRecordsArray?.forEach((record:Param)=>{
      // 此record的key只有一个，如aList
      keyValues.push(`
          ${[record.name]}: ${record.valueExpression}
        `)
    })

    const data = `
    {
      valueMap:${props.mainRecordExp || '{}'},
      valueMapList:[{${keyValues.join(',')}}]
    }`

    return new ParseResult(
      `$gl.vars.${respVarName} = ${awaitStr} $gl.fileApi.exportExcel(${fileName},"${props.fileTemplate?.templateId}","${props.dataType}",${data}).then(${fulfilled},${rejected})
            `
    )
  }
}

interface Props {
  fileName: string
  fileTemplate: any
  // mql | data，数据类型有可能是最新的数据结果（data），也有可能是用于后端查询获取数据结果的（gql）
  dataType: string
  // 数据源主表记录表达式，格式为：Record<string, any>，如{id,name,age}，使用mainRecord和subRecordsArray替代varName，配置时更直观
  // 值可为变量名，如mainRecord: $gl.vars.user
  mainRecordExp:string
  // 数据源从表记录集表达式，格式为：Array<Record<string, Array<Record<string, any>>>>，如{aList: [{id,name,age},bList: [{id,name,age}]
  // 值可为变量名，如subRecordsArray: $gl.vars.subRecordsArray
  subRecordsArray: Array<Param>
  // 从上下文中的数据变量名
  // TODO 待删除
  varName?: string
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

blocksHandler.register(new ExportExcelBlockHandler(), CommandBlocks.CommandBlockOne)
