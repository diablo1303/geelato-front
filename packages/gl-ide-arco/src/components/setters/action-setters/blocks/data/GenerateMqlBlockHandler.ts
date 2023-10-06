import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import type { EntityReader } from '@geelato/gl-ui'
import { blocksHandler, CommandBlocks } from '../BlockHandler'

export default class ExportExcelBlockHandler implements IBlockHandler {
  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    console.log('props', props)
    return new ParseResult(
      `
            $gl.vars.${props.varName} = $gl.entityApi.convertEntityReaderToMql(${JSON.stringify(
        props.entityReader
      )})
            `
    )
  }
}

interface Props {
  entityReader: EntityReader
  // 创建的mql保存的目标变量
  varName: string
}

blocksHandler.register(new ExportExcelBlockHandler(), CommandBlocks.CommandBlockOne)
