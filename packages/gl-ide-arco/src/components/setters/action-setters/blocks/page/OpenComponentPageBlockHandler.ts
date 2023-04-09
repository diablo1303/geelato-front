import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
export default class OpenComponentPageBlockHandler implements IBlockHandler {

    parseToScript(props: Props): ParseResult {
        return new ParseResult(`$gl.$drawer.open({title: "${props.title}",content: $gl.loadPage("${props.pageId}"),width:"1024px"})`);
    }
}

export class Props {
    title:string = ''
    appId: string = '';
    pageId: string = '';
    width:string = '1024px'
}