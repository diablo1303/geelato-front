import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";
import {blocksHandler, CommandBlocks} from "../BlockHandler";


export default class SetVarBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        return new ParseResult(
            `
            $gl.vars.${props.varName} = ${propsExpressions?.varValue || props.varValue} ;
            `
        )
    }
}

interface Props {
    varName: string
    varValue: any,
    remark?: string
}

blocksHandler.register(new SetVarBlockHandler(), CommandBlocks.CommandBlockOne)