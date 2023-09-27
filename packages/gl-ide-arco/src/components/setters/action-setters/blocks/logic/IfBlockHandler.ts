import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import {blocksHandler, CommandBlocks} from "../BlockHandler";

export default class IfBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {
        return new ParseResult(`${props.mode === 'if' ? 'if' : 'else if'}(${props.target1} ${props.relationship} ${props.target2}){`, `}`)
    }
}

export class Props {
    // if | else if
    mode: string = 'if'
    target1: string = '';
    relationship: string = ''
    target2: string = ''
}

blocksHandler.register(new IfBlockHandler(), CommandBlocks.CommandBlockTwo)