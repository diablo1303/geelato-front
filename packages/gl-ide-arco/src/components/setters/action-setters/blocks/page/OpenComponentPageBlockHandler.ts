import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import type { Param } from '@geelato/gl-ui'
import { blocksHandler, CommandBlocks } from '../BlockHandler'
import { utils } from '@geelato/gl-ui'

const toStr = (str: string) => {
  return `"${str}"`
}
export default class OpenComponentPageBlockHandler implements IBlockHandler {
  getName(): string {
    return 'OpenComponentPageBlockHandler'
  }

  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const mode = props.mode || 'Drawer'
    const title = propsExpressions?.title || toStr(props.title)
    const width = propsExpressions?.width || toStr(props.width || '1024px')
    const okText = propsExpressions?.okText || toStr(props.okText || '确定')
    const cancelText = propsExpressions?.cancelText || toStr(props.cancelText || '取消')
    const hideCancel = props.hideCancel === true
    const contentName = utils.gid('content')
    return new ParseResult(
      // 注意这里的参数转换采用JSON.stringify，不采用BlockUtils.paramStringify，因为这两种不同的方式，到导致获取的$gl的对象不是同一个，相应的参数值也会不同。
      `
            const ${contentName} = $gl.fn.loadPage("${props.pageId || ''}","${
        props.extendId
      }",${JSON.stringify(props.params || [])},"${props.pageStatus}","${props.pageTemplateName}");
            $gl.fn.open${mode}({
                title:${title},
                content: ${contentName},
                width:${width},
                okText:${okText},
                onBeforeOk: async ()=>{
                    try{
                        #{onBeforeOk}
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                onOpen:async ()=>{
                    try{
                        #{onOpen}
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                onClose:async ()=>{
                    try{
                        #{onClose}
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                cancelText:${cancelText},
                hideCancel:${hideCancel}
            })
            `
    )
  }
}

interface Props {
  title: string
  appId: string
  // pageId 或 extendId 二选一，填写其中一个，优先采用pageId
  pageId: string
  extendId: string
  // 页面状态
  pageStatus: string
  // 页面模板名称
  pageTemplateName: string
  // Drawer | Modal
  mode?: string

  width: string
  // 页面参数
  params?: Array<Param>
  // 确认按钮的内容
  okText?: string
  // 取消按钮的内容
  cancelText?: string
  // 是否隐藏取消按钮
  hideCancel?: boolean
  // 点确认之前调用的组件
  beforeOkInvokeComponentId?: string
  // 点确认之前调用的组件方法，该方法需返回true或false，true，则执行确认关闭窗口
  beforeOkInvokeMethodName?: string
  // 关闭之前调用的组件
  closeInvokeComponentId?: string
  // 关闭之前调用的组件方法，如调用列表的刷新方法
  closeInvokeMethodName?: string
}

blocksHandler.register(new OpenComponentPageBlockHandler(), CommandBlocks.CommandBlockOne)
