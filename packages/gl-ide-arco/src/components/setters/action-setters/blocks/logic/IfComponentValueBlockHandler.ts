import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";



export default class IfComponentValueBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {

        return new ParseResult(
            `
            if($gl.getComponentValue("${props.componentId}") ${props.relationship} ${props.compareValue}){
            `
        ,"}").setBlockName('IfComponentValueBlock');
    }
}

export class Props {
    appId: string = ''
    extendId: string = ''
    componentId: string = ''
    relationship: string = ''
    compareValue: string = ''
    valueType: string = ''
}