import type IBlockHandler from '../BlockHandler'
import type { PropsExpressions } from '../BlockHandler'
import ParseResult from '../ParseResult'
import type { Param } from '@geelato/gl-ui'
import { blocksHandler, CommandBlocks } from '../BlockHandler'
import { utils } from '@geelato/gl-ui'

const toStr = (str: string) => {
  return `"${str}"`
}
export default class HttpRequestBlockHandler implements IBlockHandler {
  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    // console.log("OpenComponentPageBlockHandler > parseToScript > props:", props)
    const url = propsExpressions?.url || toStr(props.url)
    const method = propsExpressions?.method || toStr(props.method)
    const data = propsExpressions?.data || props.data || undefined
    const header = propsExpressions?.header || props.header || undefined
    const respVarName = props.respVarName || utils.gid('respVarName')

    return new ParseResult(
      // 注意这里的参数转换采用JSON.stringify，不采用BlockUtils.paramStringify，因为这两种不同的方式，到导致获取的$gl的对象不是同一个，相应的参数值也会不同。
      `
        const axios = $gl.fn.createAxios({header:${header}})
        
        $gl.vars.${respVarName} = await axios({
          method:${method},
          url:${url},
          params:${convertParams(props.params)},
          data:${data}
        })
        
        console.log('vars.${respVarName}',$gl.vars.${respVarName})
      `
    )
  }
}

const convertParams = (params?: Array<Param>) => {
  const result: string[] = []
  result.push('{')
  const pAry: string[] = []
  params?.forEach((param) => {
    pAry.push(`${param.name}:${param.valueExpression || param.value || '""'}`)
  })
  result.push(pAry.join(','))
  result.push('}')
  return result.join('')
}

interface Props {
  title: string
  // 请求地址
  url: string
  // get | post
  method: string
  // query参数
  params?: Array<Param>
  // 请求体
  data?: string
  // 请求头
  header?: string
  // 请返回的结果，ApiResult，保存的变量
  respVarName: string
}

blocksHandler.register(new HttpRequestBlockHandler(), CommandBlocks.CommandBlockOne)