import type IBlockHandler from '../../BlockHandler'
import ParseResult from '../../ParseResult'
import type { PropsExpressions } from '../../BlockHandler'
import { blocksHandler, CommandBlocks } from '../../BlockHandler'
import { utils } from '@geelato/gl-ui'

export default class NotificationBlockHandler implements IBlockHandler {
  getName(): string {
    return 'NotificationBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const method = props.method || 'info'
    // 清空全部提示
    const positionStr = props.position ? `"${props.position}"` : ''
    if (method === 'clear') {
      return new ParseResult(`$gl.fn.notification.clear(${positionStr})`)
    }
    // 消息提示
    props.id = props.id || utils.gid('notif')
    const idStr = props.id ? `"${props.id}"` : ''
    const title = `title:${propsExpressions?.title || "'" + (props.title || '') + "'"},`
    const content = `content:${propsExpressions?.content || "'" + (props.content || '') + "'"},`
    const position = props.position ? `position:${positionStr},` : ''
    const showIcon = props.showIcon ? `showIcon:${props.showIcon},` : ''
    const closable = props.closable ? `closable:${props.closable},` : ''
    const duration = props.duration ? `duration:${props.duration},` : ''
    const id = props.id ? `id:${idStr}` : ''
    const onClose =
      props.invokeBlocks?.length > 0 ? `onClose:async(id)=>{$gl.vars.${props.id} = id;#{onClose}},` : ''

    return new ParseResult(
      `$gl.fn.notification.${method}({
         ${title}${content}${position}${showIcon}${closable}${duration}${onClose}${id}})`
    )
  }
}

interface Props {
  id: string
  title: string
  content: string
  method: string
  // 消息的位置 'topLeft'|'topRight'|'bottomLeft'|'bottomRight'
  position: string
  // 是否显示图标
  showIcon: boolean
  // 是否显示关闭按钮
  closable: boolean
  // 消息显示的持续时间
  duration: number
  // 回调
  invokeBlocks: Array<String>
}

blocksHandler.register(new NotificationBlockHandler(), CommandBlocks.CommandBlockOne)
