import OpenThirdPageBlockHandler from "./page/OpenThirdPageBlockHandler";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import ParseResult from "./ParseResult";
import NotificationBlockHandler from "./feedback/NotificationBlockHandler";
import IfBlockHandler from "./logic/IfBlockHandler";
import ElseBlockHandler from "./logic/ElseBlockHandler";
import OpenComponentPageBlockHandler from "./page/OpenComponentPageBlockHandler";
import ComponentInvokeBlockHandler from "./page/ComponentInvokeBlockHandler";
import ConfirmBlockHandler from "./feedback/ConfirmBlockHandler";
import SetVisibleBlockHandler from "./page/SetVisibleBlockHandler";
import IfComponentValueBlockHandler from "./logic/IfComponentValueBlockHandler";
import TriggerComponentActionBlockHandler from "./logic/TriggerComponentActionBlockHandler";
import LogBlockHandler from "./other/LogBlockHandler";
import SetValueBlockHandler from "./page/SetValueBlockHandler";
import ReturnBlockHandler from "./other/ReturnBlockHandler";
import SetVarBlockHandler from "./var/SetVarBlockHandler";
import GroupSumBlockHandler from "./data/GroupSumBlockHandler";
import JsCodeBlockHandler from "./other/JsCodeBlockHandler";
import ExportExcelBlockHandler from "./file/ExportExcelBlockHandler";
import GenerateMqlBlockHandler from "./data/GenerateMqlBlockHandler";

export default interface IBlockHandler {
    /**
     * @param props
     * @param propsExpressions   属性性的表达式，若有配置，与props的实属对应；有配置该值时，以
     * @param componentInst
     */
    parseToScript(props: Object, propsExpressions?: {[key:string]:any}, componentInst?: ComponentInstance): ParseResult;
}

export type PropsExpressions =  { [key: string]: any }

type Handlers = { [key: string]: any }

export class BlocksHandler {

    handlers: Handlers = {}

    constructor() {
        this.handlers = {
            GlBlockSetVisible: new SetVisibleBlockHandler(),
            GlBlockOpenThirdPage: new OpenThirdPageBlockHandler(),
            GlBlockOpenComponentPage: new OpenComponentPageBlockHandler(),
            GlBlockComponentInvoke: new ComponentInvokeBlockHandler(),
            GlBlockNotification: new NotificationBlockHandler(),
            GlBlockConfirm: new ConfirmBlockHandler(),
            GlBlockIf: new IfBlockHandler(),
            GlBlockElse: new ElseBlockHandler(),
            GlIfComponentValueBlock: new IfComponentValueBlockHandler(),
            GlTriggerComponentActionBlock: new TriggerComponentActionBlockHandler(),
            GlLogBlock: new LogBlockHandler(),
            GlSetValueBlock: new SetValueBlockHandler(),
            GlReturnBlock: new ReturnBlockHandler(),
            GlSetVarBlock: new SetVarBlockHandler(),
            GlGroupSumBlock:new GroupSumBlockHandler(),
            GlJsCodeBlock:new JsCodeBlockHandler(),
            GlExportExcelBlock:new ExportExcelBlockHandler(),
            GlGenerateMqlBlock:new GenerateMqlBlockHandler()
        }
    }

    parseToScript(block: ComponentInstance | undefined): string {
        // console.log('BlocksHandler > parseToScript() > block:', block)
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

    parseOne(block: ComponentInstance, parentBlock?: ComponentInstance, parentParseResult?: ParseResult): ParseResult {
        // console.log('BlocksHandler > parseOne() > block:', block)
        if (block) {
            const handler: IBlockHandler = this.handlers[block.componentName]
            // console.log('BlocksHandler > parseOne() > parse blocks and get handler:', handler, 'by nane:', block.componentName, ',handlers:', this.handlers)
            const parseResult = handler?.parseToScript(block.props, block.propsExpressions, block) || new ParseResult().setBlockName(block.componentName)
            parseResult!.invokeBlockNames = block?.props.invokeBlocks || []
            for (const index in block.children) {
                const subBlock = block.children[index]
                // 禁用的指令块不处理
                if (!subBlock._disabled) {
                    parseResult.children.push(this.parseOne(subBlock, block, parseResult))
                }
            }
            return parseResult;
        }
        return new ParseResult().setBlockName('Block is empty!!!')
    }
}

const blocksHandler = new BlocksHandler()
export {blocksHandler}