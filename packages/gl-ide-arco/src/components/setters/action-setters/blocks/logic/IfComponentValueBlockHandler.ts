import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";


export default class IfComponentValueBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {

        return new ParseResult(
            `
            ${props.mode === 'if' ? 'if' : 'else if'}($gl.fn.getComponentValue("${props.componentId}") ${props.relationship} ${props.compareValue}){
            `
            , "}").setBlockName('IfComponentValueBlock');
    }
}

export class Props {
    // if | else if
    mode: string = 'if'
    appId: string = ''
    extendId: string = ''
    componentId: string = ''
    relationship: string = ''
    compareValue: string = ''
    valueType: string = ''
}