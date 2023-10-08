import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import {blocksHandler, CommandBlocks} from "../BlockHandler";


export default class ForListBlockHandler implements IBlockHandler {
  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const items = propsExpressions?.items || props.items || []
    return new ParseResult(
      `for(let ${props.loopItemIndex} in ${items}){
          let ${props.loopItem} = ${items}[${props.loopItemIndex}];
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