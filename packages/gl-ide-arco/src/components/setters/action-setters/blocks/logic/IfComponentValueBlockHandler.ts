import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";


export default class IfComponentValueBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {

        return new ParseResult(
            `
            ${props.mode === 'if' ? 'if' : 'else if'}($gl.fn.getComponentValue("${props.componentId}") ${props.relationship} ${propsExpressions?.compareValue || props.compareValue}){
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