import type IBlockHandler from '../BlockHandler'
import { type PropsExpressions, blocksHandler, CommandBlocks } from '../BlockHandler'
import ParseResult from '../ParseResult'
import useVars from '../../hooks/vars'

const vars = useVars()
export default class ConfirmBlockHandler implements IBlockHandler {
  getName(): string {
    return 'ConfirmBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const varStr = vars.getVarStr(props.varName, 'confirm')
    props.varName = varStr.substring(9)
    let onOk = ''
    let onCancel = ''
    const invokeBlocks = props.invokeBlocks
    if (invokeBlocks?.includes('onOk')) {
      onOk = `onOk: ()=>{
                  ${varStr} = true;
                  #{onOk}
                },`
    }
    if (invokeBlocks?.includes('onCancel')) {
      onCancel = `onCancel: ()=>{
                  ${varStr} = false;
                  #{onCancel}
                },`
    }

    return new ParseResult(
      `
            $gl.fn.confirm({
                title: "${propsExpressions?.title || props.title}",
                content: "${propsExpressions?.content || props.content}",
                ${onOk}
                ${onCancel}
                width:'15em'
            })
            `
    )
  }
}

interface Props {
  title: string

  content: string
  // 存储结果的变量名
  varName: string
  invokeBlocks: Array<String>
}

blocksHandler.register(new ConfirmBlockHandler(), CommandBlocks.CommandBlockOne)
