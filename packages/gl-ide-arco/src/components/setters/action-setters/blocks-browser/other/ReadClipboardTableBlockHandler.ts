import type IBlockHandler from '../../BlockHandler'
import ParseResult from '../../ParseResult'
import type { PropsExpressions } from '../../BlockHandler'
import { blocksHandler, CommandBlocks } from '../../BlockHandler'
import { type CellMeta, utils } from '@geelato/gl-ui'

export default class ReadClipboardTableBlockHandler implements IBlockHandler {
  getName(): string {
    return 'ReadClipboardTableBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    let varName = props.varName || utils.gid('varName')
    let cellMetas = props.cellMetas || []
    return new ParseResult(
      ` $gl.vars.${varName} = await $gl.fn.readClipboardTable("${props.splitChar||'\\t'}",${JSON.stringify(cellMetas)});
      `
    )
  }
}

export class Props {
  // ","、"\\t"，其中"\\t"为制表符
  splitChar?: string
  varName?: string
  // 表格的列元数据，未设置的列，默认格式为字符串
  cellMetas?: CellMeta[]
}

blocksHandler.register(new ReadClipboardTableBlockHandler(), CommandBlocks.CommandBlockOne)
