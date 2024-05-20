import type IBlockHandler from '../../BlockHandler'
import ParseResult from '../../ParseResult'
import type { PropsExpressions } from '../../BlockHandler'
import { blocksHandler, CommandBlocks } from '../../BlockHandler'

export default class IfComponentValueBlockHandler implements IBlockHandler {
  getName(): string {
    return 'IfComponentValueBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    if(props.relationship==='empty'||props.relationship==='notEmpty'){
      return new ParseResult(
          `${props.mode === 'if' ? 'if' : 'else if'}($gl.fn.isEmpty($gl.fn.getComponentValue("${
              props.componentId
          }"))){
            `,
          '}'
      )
    }else{
      return new ParseResult(
          `${props.mode === 'if' ? 'if' : 'else if'}($gl.fn.getComponentValue("${
              props.componentId
          }") ${props.relationship} ${propsExpressions?.compareValue || props.compareValue}){
            `,
          '}'
      )
    }
  }
}

export class Props {
  // if | else if
  mode: string = 'if'
  appId: string = ''
  extendId: string = ''
  componentId: string = ''
  relationship: string = ''
  compareValue: string = ''
  valueType: string = ''
}

blocksHandler.register(new IfComponentValueBlockHandler(), CommandBlocks.CommandBlockTwo)
