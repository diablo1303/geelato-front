import type IBlockHandler from "../BlockHandler";
import type {PropsExpressions} from "../BlockHandler";
import ParseResult from "../ParseResult";
import {blocksHandler, CommandBlocks} from "../BlockHandler";

export default class DownloadBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        const fileId = propsExpressions?.fileId ? propsExpressions.fileId : `"${props.fileId}"`;
        return new ParseResult(
            `
            $gl.fileApi.downloadFileById(${fileId})
            `
        )
    }
}

interface Props {
    fileId: string
}

blocksHandler.register(new DownloadBlockHandler(), CommandBlocks.CommandBlockOne)