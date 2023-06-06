import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PageParamType} from "@geelato/gl-ui";

export default class SetPropsBlockHandler implements IBlockHandler {

    parseToScript(props: Props): ParseResult {
        const vueProps = props.vueProps || []
        const propsObj: { [key: string]: any } = {}
        vueProps.forEach((prop: PageParamType) => {
            propsObj[prop.pName] = prop.pValue
        })
        return new ParseResult(
            `
            $gl.setComponentProps("${props.componentId}","${vueProps}");
            `
        ).setBlockName('SetPropsBlock');
    }
}

export class Props {
    appId: string = "";
    // 调用的组件Id
    componentId: string = "";
    // 组件definedExpose出来的方法名
    methodName: string = "";
    // 调用方法的参数
    vueProps?: Array<PageParamType>
}
