import { utils } from '@geelato/gl-ui'

/**
 * 获取变量名
 * 返回$gl.vars.xxx的格式
 * @param varName
 */
const getVarStr = (varName?: string) => {
  if (!varName) {
    return varName || utils.gid('$gl.vars.var')
  }
  if (varName.trim().startsWith('$gl.vars')) {
    return varName
  }
  return `$gl.vars.${varName}`
}

const useVars = () => {
  return { getVarStr }
}
export default useVars
