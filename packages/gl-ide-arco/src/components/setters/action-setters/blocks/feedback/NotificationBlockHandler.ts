import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";

export default class NotificationBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        const method = props.method || 'info'
        return new ParseResult(
            `
            $gl.fn.notification.${method}({
                title:"${propsExpressions?.title || props.title || ''}",
                content:"${propsExpressions?.content || props.content}"
                })
            `
        ).setBlockName('NotificationBlock');
    }
}

interface Props {
    title: string
    content: string
    method: string
}