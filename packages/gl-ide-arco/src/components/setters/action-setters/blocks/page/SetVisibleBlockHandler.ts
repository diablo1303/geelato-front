import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import {blocksHandler, CommandBlocks} from "../BlockHandler";

export default class SetVisibleBlockHandler implements IBlockHandler {
  getName(): string {
    return 'SetVisibleBlockHandler'
  }

  parseToScript(props: Props): ParseResult {
    return new ParseResult(
      `
            $gl.fn.setComponentProps("${props.componentId}",{_hidden:${!!props._hidden}});
            `
    )
  }
}

export class Props {
    appId: string = "";
    // 调用的组件Id
    componentId: string = "";
    // 组件是否不渲染
    _hidden: boolean = true
}

blocksHandler.register(new SetVisibleBlockHandler(), CommandBlocks.CommandBlockOne)