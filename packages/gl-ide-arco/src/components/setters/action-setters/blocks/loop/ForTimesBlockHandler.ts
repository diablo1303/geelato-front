import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import {blocksHandler, CommandBlocks} from "../BlockHandler";


export default class ForTimesBlockHandler implements IBlockHandler {
  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const startNumber = propsExpressions?.startNumber || props.startNumber || 0
    const endNumber = propsExpressions?.endNumber || props.endNumber || 1
    const stepNumber = propsExpressions?.stepNumber || props.stepNumber || 1
    const loopIndex = props.loopIndex || 'loopIndex'
    return new ParseResult(
      `
      for(let ${loopIndex}=1;${startNumber}+(${loopIndex}-1)*${stepNumber}<${endNumber};${loopIndex}+=1){ 
      `,

      `}`
    )
  }
}

export interface Props {
  // 起始值
  startNumber: number
  // 结束值
  endNumber: number
  // 递增值（步长）
  stepNumber: number
  // 索引变量名
  loopIndex:string
}

blocksHandler.register(new ForTimesBlockHandler(), CommandBlocks.CommandBlockTwo)