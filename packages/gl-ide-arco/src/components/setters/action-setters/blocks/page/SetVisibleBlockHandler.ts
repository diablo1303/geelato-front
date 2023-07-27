import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";

export default class SetVisibleBlockHandler implements IBlockHandler {

    parseToScript(props: Props): ParseResult {
        return new ParseResult(
            `
            $gl.fn.setComponentProps("${props.componentId}",{_hidden:${!!props._hidden}});
            `
        ).setBlockName('SetVisibleBlock');
    }
}

export class Props {
    appId: string = "";
    // 调用的组件Id
    componentId: string = "";
    // 组件是否不渲染
    _hidden: boolean = true
}
