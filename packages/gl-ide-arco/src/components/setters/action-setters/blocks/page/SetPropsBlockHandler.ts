import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PageParamConfigType} from "@geelato/gl-ui";

export default class SetPropsBlockHandler implements IBlockHandler {

    parseToScript(props: Props): ParseResult {
        const vueProps = props.vueProps || []
        const propsObj: { [key: string]: any } = {}
        vueProps.forEach((prop: PageParamConfigType) => {
            propsObj[prop.pName] = prop.pValue
        })
        return new ParseResult(
            `
            $gl.fn.setComponentProps("${props.componentId}","${vueProps}");
            `
        ).setBlockName('SetPropsBlock');
    }
}

export class Props {
    appId: string = "";
    // 调用的组件Id
    componentId: string = "";
    // 调用方法的参数
    vueProps?: Array<PageParamConfigType>
}
