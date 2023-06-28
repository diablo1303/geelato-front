import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import {paramStringify} from "@geelato/gl-ui";
import type {PageParamConfigType} from "@geelato/gl-ui";


export default class OpenComponentPageBlockHandler implements IBlockHandler {

    parseToScript(props: Props): ParseResult {
        // console.log("OpenComponentPageBlockHandler > parseToScript > props:", props)
        const width = props.width || "1024px"
        const okText = props.okText || "确定"
        const cancelText = props.cancelText || "取消"
        const hideCancel = props.hideCancel === true ? true : false
        const params = props.params || []
        return new ParseResult(
            `
            const content = $gl.loadPage("${props.pageId || ''}","${props.extendId}",{params:${paramStringify(params)}});
            $gl.$drawer.open({
                title: "${props.title}",
                content: content,
                width:"${width}",
                okText:"${okText}",
                onBeforeOk: async ()=>{
                    #{onBeforeOk}
                },
                onOpen:async ()=>{
                    #{onOpen}
                },
                onClose:async ()=>{
                    #{onClose}
                },
                cancelText:"${cancelText}",
                hideCancel:${hideCancel}
            })
            `
        ).setBlockName('OpenComponentPageBlock');
    }


    // varParse(v: any) {
    //     const vType = typeof v
    //     switch (vType) {
    //         case "function":
    //             return v;
    //         case "object":
    //             let newObj: { [key: string]: any } = {}
    //             Object.keys(v).forEach((key) => {
    //                 newObj[key] = this.varParse(v[key])
    //             })
    //             return newObj
    //         case "string":
    //             if (v.trim().indexOf('js:') === 0) {
    //                 return v.substring(3)
    //             } else {
    //                 return "\"" + v + "\""
    //             }
    //         default:
    //             return v
    //     }
    // }
}

export class Props {
    title: string = ""
    appId: string = "";
    // pageId 或 extendId 二选一，填写其中一个，优先采用pageId
    pageId: string = "";
    extendId: string = "";
    width: string = "1024px";
    // 页面参数
    params?: Array<PageParamConfigType>
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
