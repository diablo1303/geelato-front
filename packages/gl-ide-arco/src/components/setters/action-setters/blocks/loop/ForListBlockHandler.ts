import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import { blocksHandler, CommandBlocks } from '../BlockHandler'

export default class ForListBlockHandler implements IBlockHandler {
  getName(): string {
    return 'ForListBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const items = propsExpressions?.items || props.items || []
    // 增加  $gl.vars.${props.loopItem} ，确保在循环体将可以通用$gl.vars来引用
    return new ParseResult(
      `for(let ${props.loopItemIndex} in ${items}){
          let ${props.loopItem} = ${items}[${props.loopItemIndex}];
          $gl.vars.${props.loopItem} = ${props.loopItem};
          $gl.vars.${props.loopItemIndex} = ${props.loopItemIndex};
      `,
      `}`
    )
  }
}

export class Props {
  // 列表项
  items: [] = []
  // 循环输出项
  loopItem: string = 'loopItem'
  // 循环当前位置
  loopItemIndex: string = 'loopItemIndex'
}

blocksHandler.register(new ForListBlockHandler(), CommandBlocks.CommandBlockTwo)
