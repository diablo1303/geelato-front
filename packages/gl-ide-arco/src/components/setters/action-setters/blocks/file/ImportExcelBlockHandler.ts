import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import { blocksHandler, CommandBlocks } from '../BlockHandler'

export default class ImportExcelBlockHandler implements IBlockHandler {
  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    const params = {
      templateId: props.fileTemplate?.templateId,
      importType: props.importType
    }
    return new ParseResult(
      `
        const content = $gl.fn.loadComponent('GlImport',${JSON.stringify(params)})
        console.log('content',content)
        $gl.fn.openModal({
            title:'导入文件',
            content: content,
            width:'800px',
            okText:'导入',
            onBeforeOk: async ()=>{
                try{
                    const importResult = await content.component.exposed.importFile()
                    console.log('importResult',importResult)
                    if(importResult===undefined){
                      return false
                    }
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
            cancelText:'取消'
        })
    `
    )
  }
}

interface Props {
  // 导入窗口标题
  // title:string
  //
  fileTemplate: { appCode: string; templateId: string }
  // part:可以部分导入；all:需要全部导入，错误即中断并回滚。
  importType: string
  // 从上下文中的数据变量名
  // varName?: object
  // 是否同步执行
  // enableAwait?:boolean
}

blocksHandler.register(new ImportExcelBlockHandler(), CommandBlocks.CommandBlockOne)
