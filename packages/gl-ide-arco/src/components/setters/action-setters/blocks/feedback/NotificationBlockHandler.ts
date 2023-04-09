import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";

export default class NotificationBlockHandler implements IBlockHandler {
    parseToScript(props: any): ParseResult {
        const method = props.method || 'info'
        return new ParseResult(`$gl.$notification.${method}({title:"${props.title||''}",content:"${props.content}"})`)
    }
}