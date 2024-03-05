import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import { utils } from '@geelato/gl-ui'
import { blocksHandler, CommandBlocks } from '../BlockHandler'

export default class DictQueryBlockHandler implements IBlockHandler {
  getName(): string {
    return "DictQueryBlockHandler";
  }
  
  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    // console.log('props', props)
    let respVarName = props.respVarName || utils.gid('respVarName')
    let dataVarName = props.dataVarName || utils.gid('dataVarName')
    return new ParseResult(
      `
          $gl.vars.${respVarName} = await $gl.entityApi.queryDictItem('${props.dictId}',${
        propsExpressions?.dictItemValue || props.dictItemValue
      })
          $gl.vars.${dataVarName} = $gl.vars.${respVarName}.data
            `
    )
  }
}

interface Props {
  // 字典id
  dictId: string
  // 字典项值
  dictItemValue: string

  // 查询返回的结果数据data:[]，保存的变量
  dataVarName: string
  // 查询返回的结果，ApiResult，保存的变量
  respVarName: string
}

blocksHandler.register(new DictQueryBlockHandler(), CommandBlocks.CommandBlockOne)
