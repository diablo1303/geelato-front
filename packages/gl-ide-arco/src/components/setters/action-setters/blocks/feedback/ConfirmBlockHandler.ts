import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";

export default class ConformBlockHandler implements IBlockHandler {
    parseToScript(props: any): ParseResult {

        return new ParseResult(
            `
            let vars = {};
            $gl.$modal.open({
                width:'15em',
                title: "${props.title}",
                content: "${props.content}",
                onOk: ()=>{
                  vars.${props.varName} = true
                },
                onCancel: ()=>{
                  vars.${props.varName} = false
                }
            })
            `
        );
    }
}

export class Props {
    title: string = "";

    content: string = "";
    // 存储结果的变量名
    varName: string = "";
}
