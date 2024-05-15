import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import {blocksHandler, CommandBlocks} from "../BlockHandler";

export default class SetValueBlockHandler implements IBlockHandler {
  getName(): string {
    return 'SetValueBlockHandler'
  }

  parseToScript(props: Props, propsExpressions: Props): ParseResult {
    return new ParseResult(
      `
            $gl.fn.setComponentValue("${props.componentId}",${props.value});
            `
    )
  }
}

export class Props {
    appId: string = "";
    // 调用的组件Id
    componentId: string = "";
    // 设置的值，该值可为表达式，若是表达式会在执行时自动解析
    value?: any
}


blocksHandler.register(new SetValueBlockHandler(), CommandBlocks.CommandBlockOne)