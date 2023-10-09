import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import { utils, type EntityReader } from '@geelato/gl-ui'
import { blocksHandler, CommandBlocks } from '../BlockHandler'

export default class EntityQueryBlockHandler implements IBlockHandler {
  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    console.log('props', props)
    let respVarName = props.respVarName || utils.gid('respVarName')
    let dataVarName = props.dataVarName|| utils.gid('dataVarName')
    return new ParseResult(
      `
          $gl.vars.${respVarName} = await $gl.entityApi.queryByEntityReader(${JSON.stringify(
        props.entityReader
      )})
          $gl.vars.${dataVarName} = $gl.vars.${respVarName}.data
            `
    )
  }
}

interface Props {
  entityReader: EntityReader
  // 查询返回的结果数据data:[]，保存的变量
  dataVarName: string
  // 查询返回的结果，ApiResult，保存的变量
  respVarName: string
}

blocksHandler.register(new EntityQueryBlockHandler(), CommandBlocks.CommandBlockOne)