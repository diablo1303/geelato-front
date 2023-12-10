import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";
import {blocksHandler, CommandBlocks} from "../BlockHandler";


export default class AnnotationBlockHandler implements IBlockHandler {
  getName(): string {
    return 'AnnotationBlockHandler'
  }
  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    return new ParseResult(``)
  }
}

interface Props {
    content: string
}

blocksHandler.register(new AnnotationBlockHandler(), CommandBlocks.CommandBlockOne)