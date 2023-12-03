import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import {blocksHandler, CommandBlocks} from "../BlockHandler";


export default class TriggerComponentActionBlockHandler implements IBlockHandler {
  getName(): string {
    return 'TriggerComponentActionBlockHandler'
  }
  parseToScript(props: Props): ParseResult {
    return new ParseResult(
      `
            $gl.fn.triggerComponentAction("${props.componentId}","${props.actionName}");
            `
    )
  }
}

interface Props {
    appId: string
    extendId: string
    componentId: string
    eventName: string
    actionName: string
}

blocksHandler.register(new TriggerComponentActionBlockHandler(), CommandBlocks.CommandBlockTwo)