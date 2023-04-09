import OpenThirdPageBlockHandler from "./page/OpenThirdPageBlockHandler";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import ParseResult from "./ParseResult";
import NotificationBlockHandler from "./feedback/NotificationBlockHandler";
import IfBlockHandler from "./logic/IfBlockHandler";
import ElseBlockHandler from "./logic/ElseBlockHandler";
import OpenComponentPageBlockHandler from "./page/OpenComponentPageBlockHandler";

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
            GlBlockNotification: new NotificationBlockHandler(),
            GlBlockIf: new IfBlockHandler(),
            GlBlockElse: new ElseBlockHandler()
        }
    }

    parseToScript(block: ComponentInstance): string {
        console.log('parseToScript block:', block)
        if (!block) return ''
        const commandLines: Array<string> = []
        if (!block._disabled) {
            const line = this.parseOne(block).toString()
            if (line) {
                commandLines.push(line)
            }
        }
        return commandLines.join(";").replace(/};/g,'}').replace(/;}/g,'}').replace(/{;/g,'{')
    }

    // parseToScript(blocks: Array<ComponentInstance>): string {
    //     console.log('parseToScript blocks:', blocks)
    //     if (!blocks) return ''
    //
    //     const commandLines: Array<string> = []
    //     for (const key in blocks) {
    //         const block = blocks[key]
    //         if (!block._disabled) {
    //             const line = this.parseOne(block).toString()
    //             if (line) {
    //                 commandLines.push(line)
    //             }
    //         }
    //     }
    //     return commandLines.join(";")
    // }

    parseOne(block: ComponentInstance): ParseResult {
        console.log('parseOne block:', block)
        if (block) {
            const handler: IBlockHandler = this.handlers[block.componentName]
            console.log('parseToScript blocks, get handler:', handler, 'by nane:', block.componentName, 'from handlers:', this.handlers)
            const parseResult = handler?.parseToScript(block.props) || new ParseResult()
            for (const key in block.children) {
                const subBlock = block.children[key]
                if(!subBlock._disabled){
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