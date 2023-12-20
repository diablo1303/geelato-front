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
  getName(): string {
    return 'HttpRequestBlockHandler'
  }
  parseToScript(props: Props, propsExpressions?: PropsExpressions): ParseResult {
    // console.log("OpenComponentPageBlockHandler > parseToScript > props:", props)
    const url = propsExpressions?.url || toStr(props.url)
    const method = propsExpressions?.method || toStr(props.method)
    const data = propsExpressions?.data || props.data || undefined
    const respVarName = props.respVarName || utils.gid('respVarName')

    return new ParseResult(
      // 注意这里的参数转换采用JSON.stringify，不采用BlockUtils.paramStringify，因为这两种不同的方式，到导致获取的$gl的对象不是同一个，相应的参数值也会不同。
      `
        const axios = $gl.fn.createAxios({header:${convertParams(
          props.header
        )}},{widthDefaultHeader:${
        propsExpressions?.widthDefaultHeader || props.widthDefaultHeader
      }})
        $gl.vars.${respVarName} = ${props.enableAwait ? 'await ' : ' '}axios({
          method:${method},
          url:${url},
          params:${convertParams(props.params)},
          data:${data}
        })
      `+ (props.enableReturn ? `\r\n return $gl.vars.${respVarName}` : '')
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
  header?:  Array<Param>
  // 是否带上平台默认的header，如header有token信息
  widthDefaultHeader:boolean
  // 执行该方法后，返回执行结果
  enableReturn: Boolean
  // 是否启用同步执行
  enableAwait: Boolean
  // 请返回的结果，ApiResult，保存的变量
  respVarName: string
}

blocksHandler.register(new HttpRequestBlockHandler(), CommandBlocks.CommandBlockOne)
