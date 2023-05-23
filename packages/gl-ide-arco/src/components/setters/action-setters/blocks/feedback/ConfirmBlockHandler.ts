import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";

export default class ConfirmBlockHandler implements IBlockHandler {
    parseToScript(props: any): ParseResult {

        return new ParseResult(
            `
            let varName = '${props.varName}' || 'confirm'
            let vars = {};
            $gl.$modal.open({
                width:'15em',
                title: "${props.title}",
                content: "${props.content}",
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
        ).setBlockName('ConfirmBlock');
    }
}

export class Props {
    title: string = "";

    content: string = "";
    // 存储结果的变量名
    varName: string = "";
}
