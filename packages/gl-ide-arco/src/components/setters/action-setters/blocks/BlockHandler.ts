import type { ComponentInstance } from '@geelato/gl-ui-schema'
import GlCommandBlockOne from './CommandBlockOne.vue'
import GlCommandBlockTwo from './CommandBlockTwo.vue'
import ParseResult from './ParseResult'

export default interface IBlockHandler {
  getName(): string

  /**
   * @param props
   * @param propsExpressions   属性性的表达式，若有配置，与props的实属对应；有配置该值时，以
   * @param componentInst
   */
  parseToScript(
    props: Object,
    propsExpressions?: {
      [key: string]: any
    },
    componentInst?: ComponentInstance
  ): ParseResult
}

export const CommandBlocks = {
  CommandBlockOne: GlCommandBlockOne,
  CommandBlockTwo: GlCommandBlockTwo
}

export type PropsExpressions = { [key: string]: any }

export class BlocksHandler {
  // key为componentName
  handlers: Record<string, IBlockHandler> = {}
  // key为componentName
  blockComponents: Record<string, any> = {}

  constructor() {}

  register<T extends IBlockHandler>(handler: T, blockComponent?: any) {
    // handler
    // 注意，由于在build时，handler.constructor.name的值变改变，会被压缩，不可直接当作handlerName，需采用getName
    const handlerName = handler.getName()
    const componentName = 'Gl' + handlerName.replace('Handler', '')
    this.handlers[componentName] = handler
    this.blockComponents[componentName] = blockComponent || CommandBlocks.CommandBlockOne
    // endLine 有值时，表示启用componentTwo
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
    // .replace(/};/g, '}')
    // };else{ IF后面加else的场景
    return commandLines
      .join(';')
      .replace(/;}/g, '}')
      .replace(/};else{/g, '}else{')
      .replace(/{;/g, '{')
  }

  parseOne(
    block: ComponentInstance,
    parentBlock?: ComponentInstance,
    parentParseResult?: ParseResult
  ): ParseResult {
    // console.log('BlocksHandler > parseOne() > block:', block)
    if (block) {
      const handler: IBlockHandler = this.handlers[block.componentName]
      // console.log(
      //   'BlocksHandler > parseOne() > parse blocks and get handler:',
      //   handler,
      //   'by nane:',
      //   block.componentName,
      //   ',handlers:',
      //   this.handlers
      // )
      const parseResult =
        handler
          ?.parseToScript(block.props, block.propsExpressions, block)
          .setBlockName(block.componentName) || new ParseResult().setBlockName(block.componentName)
      // 如有有invokeBlocks属性，且长度为0时，忽列children
      if (block?.props.invokeBlocks?.length === 0) {
        parseResult!.invokeBlockNames = []
      } else {
        parseResult!.invokeBlockNames = block?.props.invokeBlocks || []
        for (const index in block.children) {
          const subBlock = block.children[index]
          // 禁用的指令块不处理
          if (!subBlock._disabled) {
            parseResult.children.push(this.parseOne(subBlock, block, parseResult))
          }
        }
      }
      return parseResult
    }
    return new ParseResult().setBlockName('Block is empty!!!')
  }
}

const blocksHandler = new BlocksHandler()
export { blocksHandler }
