import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {Param} from "@geelato/gl-ui";
import type {PropsExpressions} from "../BlockHandler";

const toStr = (str: string) => {
    return `"${str}"`
}
export default class OpenComponentPageBlockHandler implements IBlockHandler {
    parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
        // console.log("OpenComponentPageBlockHandler > parseToScript > props:", props)
        const mode = props.mode || 'Drawer'
        const title = propsExpressions?.title || toStr(props.title)
        const width = propsExpressions?.width || toStr(props.width || "1024px")
        const okText = propsExpressions?.okText || toStr(props.okText || "确定")
        const cancelText = propsExpressions?.cancelText || toStr(props.cancelText || "取消")
        const hideCancel = props.hideCancel === true ? true : false
        return new ParseResult(
            `
            const content = $gl.fn.loadPage("${props.pageId || ''}","${props.extendId}",${JSON.stringify(props.params)});
            $gl.fn.open${mode}({
                title:${title},
                content: content,
                width:${width},
                okText:${okText},
                onBeforeOk: async ()=>{
                    #{onBeforeOk}
                },
                onOpen:async ()=>{
                    #{onOpen}
                },
                onClose:async ()=>{
                    #{onClose}
                },
                cancelText:${cancelText},
                hideCancel:${hideCancel}
            })
            `
        ).setBlockName('OpenComponentPageBlock');
    }
}

interface Props {
    // Drawer | Modal
    mode: string
    title: string
    appId: string
    // pageId 或 extendId 二选一，填写其中一个，优先采用pageId
    pageId: string
    extendId: string
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
