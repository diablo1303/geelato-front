import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";


export default class TriggerComponentActionBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {
        return new ParseResult(
            `
            $gl.fn.triggerComponentAction("${props.componentId}","${props.actionName}");
            `
        ).setBlockName('TriggerComponentActionBlock');
    }
}

interface Props {
    appId: string
    extendId: string
    componentId: string
    eventName: string
    actionName: string
}