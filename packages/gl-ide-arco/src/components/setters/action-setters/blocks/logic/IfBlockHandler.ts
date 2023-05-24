import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";


export default class IfBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {
        return new ParseResult(`if(${props.target1} ${props.relationship} ${props.target2}){`,`}`).setBlockName('IfBlock');
    }
}

export class Props {
    target1: string = '';
    relationship: string = ''
    target2: string = ''
}