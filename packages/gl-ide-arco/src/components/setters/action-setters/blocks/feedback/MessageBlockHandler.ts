import type IBlockHandler from '../BlockHandler'
import ParseResult from '../ParseResult'
import type { PropsExpressions } from '../BlockHandler'
import { blocksHandler, CommandBlocks } from '../BlockHandler'
import { utils } from '@geelato/gl-ui'

export default class MessageBlockHandler implements IBlockHandler {
  getName(): string {
    return 'MessageBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const method = props.method || 'info'
    // 清空全部提示
    const positionStr = props.position ? `"${props.position}"` : ''
    if (method === 'clear') {
      return new ParseResult(`$gl.fn.message.clear(${positionStr})`)
    }
    // 消息提示
    props.id = props.id || utils.gid('msg')
    const idStr = props.id ? `"${props.id}"` : ''
    const content = `content:${propsExpressions?.content || "'" + (props.content || '') + "'"},`
    const position = props.position ? `position:${positionStr},` : ''
    const showIcon = props.showIcon ? `showIcon:${props.showIcon},` : ''
    const closable = props.closable ? `closable:${props.closable},` : ''
    const duration = props.duration ? `duration:${props.duration},` : ''
    const resetOnHover = props.resetOnHover ? `resetOnHover:${props.resetOnHover},` : ''
    const id = props.id ? `id:${idStr}` : ''
    const onClose = props.invokeBlocks?.length > 0 ? `onClose:(id)=>{$gl.vars.${props.id} = id;#{onClose}},` : ''

    return new ParseResult(
      `$gl.fn.message.${method}({
         ${content}${position}${showIcon}${closable}${duration}${resetOnHover}${onClose}${id}})`
    )
  }
}

interface Props {
  method: string
  // 消息标识
  id: string
  content: string
  // 消息的位置 'top'|'bottom'
  position: string
  // 是否显示图标
  showIcon: boolean
  // 是否显示关闭按钮
  closable: boolean
  // 消息显示的持续时间
  duration: number
  // 设置鼠标移入后不会自动关闭
  resetOnHover: boolean
  // 回调
  invokeBlocks: Array<String>
}

blocksHandler.register(new MessageBlockHandler(), CommandBlocks.CommandBlockOne)
