import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";
import {blocksHandler, CommandBlocks} from "../BlockHandler";

export default class ConfirmBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        return new ParseResult(
            `
            let varName = '${props.varName}' || 'confirm'
            let vars = {};
            $gl.fn.confirm({
                width:'15em',
                title: "${propsExpressions?.title || props.title}",
                content: "${propsExpressions?.content || props.content}",
                onOk: ()=>{
                  vars[varName] = true;
                  #{onOk}
                },
                onCancel: ()=>{
                  vars[varName] = false;
                  #{onCancel}
                }
            })
            `
        )
    }
}

interface Props {
    title: string;

    content: string;
    // 存储结果的变量名
    varName: string;
}


blocksHandler.register(new ConfirmBlockHandler(), CommandBlocks.CommandBlockOne)