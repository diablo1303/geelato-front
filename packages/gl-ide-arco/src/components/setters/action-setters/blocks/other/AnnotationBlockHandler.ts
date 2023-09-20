import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {PropsExpressions} from "../BlockHandler";


export default class AnnotationBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        return new ParseResult(
            ``
        ).setBlockName('AnnotationBlockHandler');
    }
}

interface Props {
    content: string
}