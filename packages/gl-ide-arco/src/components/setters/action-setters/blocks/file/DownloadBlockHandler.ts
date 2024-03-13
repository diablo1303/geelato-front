import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import { blocksHandler, CommandBlocks } from '../BlockHandler'

export default class DownloadBlockHandler implements IBlockHandler {
  getName(): string {
    return 'DownloadBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const fileId = propsExpressions?.fileId ? propsExpressions.fileId : `"${props.fileId}"`
    return new ParseResult(
      `
            $gl.fileApi.downloadFileById(${fileId},${props.toPdf})
            `
    )
  }
}

interface Props {
  fileId: string
  // 下载时是否转成PDF，对word、excel文件类型适用
  toPdf: boolean
}

blocksHandler.register(new DownloadBlockHandler(), CommandBlocks.CommandBlockOne)
