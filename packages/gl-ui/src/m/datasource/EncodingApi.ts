import { entityApi } from './EntityApi'

/**
 * 基于编码id获取一个新的编码
 * @param id
 * @param params 编码变量，如可传一些业务类型代码，{type:'ap'}、{type:'ar'}、
 */
export function generateCode(id: string, params?: Record<string, string>) {
  return entityApi.getAxios().post(`/api/encoding/generate/${id}`, params || {})
}
