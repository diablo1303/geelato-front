import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";

export default class OpenThirdPageBlockHandler implements IBlockHandler {
    parseToScript(props: Props): ParseResult {
        const paramsAry: Array<string> = []
        if (props.params) {
            props.params.forEach((param) => {
                paramsAry.push(`${param.pName}=${replace$Ctx(param.pValue)}`)
            })
        }
        const paramsStr = paramsAry.join('&')
        return new ParseResult(`window.open(\`${props.url}?${paramsStr}\`)`);
    }
}

export class Props {
    url: string = '';
    params: Array<{ pName: string, pValue: string }> = []
}

function replace$Ctx(valueStr: string) {
    if (valueStr && valueStr.indexOf('$ctx') != -1) {
        return '${' + valueStr + '}'
    }
    return ''
}