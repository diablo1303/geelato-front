import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";
import {blocksHandler, CommandBlocks} from "../BlockHandler";

export default class GroupSumBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {

        // data: { [key: string]: any }[], groupField: string, sumFields: string[]
        return new ParseResult(
            `
            $gl.fn.groupSum(${props.dataVar},${props.groupField},${props.sumFields})
            `
        )
    }
}

interface Props {
    dataVar: string
    groupField: string
    sumFields: string[]
}

blocksHandler.register(new GroupSumBlockHandler(), CommandBlocks.CommandBlockOne)