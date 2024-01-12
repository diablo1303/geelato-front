import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import type { EntityReader } from '@geelato/gl-ui'
import { blocksHandler, CommandBlocks } from '../BlockHandler'
import {utils} from "@geelato/gl-ui";

export default class GenerateEntityReaderBlockHandler implements IBlockHandler {
  getName(): string {
    return 'GenerateEntityReaderBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {

    let varName = props.varName || utils.gid('varName')

    return new ParseResult(
      `
            $gl.vars.${varName} = ${JSON.stringify(props.entityReader)}
            `
    )
  }
}

interface Props {
  entityReader: EntityReader
  // 创建的mql保存的目标变量
  varName: string
}

blocksHandler.register(new GenerateEntityReaderBlockHandler(), CommandBlocks.CommandBlockOne)
