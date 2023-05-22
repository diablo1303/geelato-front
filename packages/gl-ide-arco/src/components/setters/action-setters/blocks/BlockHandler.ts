import OpenThirdPageBlockHandler from "./page/OpenThirdPageBlockHandler";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import ParseResult from "./ParseResult";
import NotificationBlockHandler from "./feedback/NotificationBlockHandler";
import IfBlockHandler from "./logic/IfBlockHandler";
import ElseBlockHandler from "./logic/ElseBlockHandler";
import OpenComponentPageBlockHandler from "./page/OpenComponentPageBlockHandler";
import ComponentInvokeBlockHandler from "./page/ComponentInvokeBlockHandler";
import ConfirmBlockHandler from "./feedback/ConfirmBlockHandler";

export default interface IBlockHandler {
    parseToScript(props: Object): ParseResult;
}

type Handlers = { [key: string]: any }

export class BlocksHandler {

    handlers: Handlers = {}

    constructor() {
        this.handlers = {
            GlBlockOpenThirdPage: new OpenThirdPageBlockHandler(),
            GlBlockOpenComponentPage: new OpenComponentPageBlockHandler(),
            GlBlockComponentInvoke: new ComponentInvokeBlockHandler(),
            GlBlockNotification: new NotificationBlockHandler(),
            GlBlockConfirm: new ConfirmBlockHandler(),
            GlBlockIf: new IfBlockHandler(),
            GlBlockElse: new ElseBlockHandler()
        }
    }

    parseToScript(block: ComponentInstance): string {
        console.log('BlocksHandler > parseToScript() > block:', block)
        if (!block) return ''
        const commandLines: Array<string> = []
        if (!block._disabled) {
            const line = this.parseOne(block).toString()
            if (line) {
                commandLines.push(line)
            }
        }
        return commandLines.join(";").replace(/};/g, '}').replace(/;}/g, '}').replace(/{;/g, '{')
    }

    parseOne(block: ComponentInstance): ParseResult {
        console.log('BlocksHandler > parseOne() > block:', block)
        if (block) {
            const handler: IBlockHandler = this.handlers[block.componentName]
            console.log('BlocksHandler > parseOne() > parse blocks and get handler:', handler, 'by nane:', block.componentName, ',handlers:', this.handlers)
            const parseResult = handler?.parseToScript(block.props) || new ParseResult()
            for (const key in block.children) {
                const subBlock = block.children[key]
                if (!subBlock._disabled) {
                    parseResult.children.push(this.parseOne(subBlock))
                }
            }
            return parseResult;
        }
        return new ParseResult()
    }
}

const blocksHandler = new BlocksHandler()
export {blocksHandler}