import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";


export default class TriggerComponentActionBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {
        return new ParseResult(
            `
            $gl.triggerComponentAction("${props.componentId}","${props.actionName}");
            `
        ).setBlockName('TriggerComponentActionBlock');
    }
}

export class Props {
    appId: string = ''
    extendId: string = ''
    componentId: string = ''
    actionName: string = ''
}