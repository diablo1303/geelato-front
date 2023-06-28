import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PageParamConfigType} from "@geelato/gl-ui";
import {paramStringify} from "@geelato/gl-ui";

export default class ComponentInvokeBlockHandler implements IBlockHandler {

    parseToScript(props: Props): ParseResult {
        console.log("ComponentInvokeBlockHandler > parseToScript > props:", props)

        const params = props.params || []
        return new ParseResult(
            `
            const method = $gl.getComponentMethod("${props.componentId}","${props.methodName}");
            const params = ${paramStringify(params)};
            return method(params);
            `
        ).setBlockName('ComponentInvokeBlock');
    }
}

export class Props {
    appId: string = "";
    // 调用的组件Id
    componentId: string = "";
    // 组件definedExpose出来的方法名
    methodName: string = "";
    // 调用方法的参数
    params?: Array<PageParamConfigType>
}
