import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";

export default class SetValueBlockHandler implements IBlockHandler {

    parseToScript(props: Props): ParseResult {
        const value = props.value

        return new ParseResult(
            `
            $gl.setComponentValue("${props.componentId}","${value}");
            `
        ).setBlockName('SetValueBlock');
    }
}

export class Props {
    appId: string = "";
    // 调用的组件Id
    componentId: string = "";
    // 设置的值
    value?: any
    // 设置的值表达式，若有设置，则取代value
    valueExpress?: string
}
