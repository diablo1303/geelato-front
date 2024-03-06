const usePromise = (
  invokeBlocks: Array<String>,
  fulfilledVarName: string,
  rejectedVarName: string
) => {
  let fulfilled = `(res)=>{return res}`
  let rejected = '(e)=>{return e}'
  let then = ''
  // 启用
  if (invokeBlocks?.includes('fulfilled')) {
    fulfilled = `(res)=>{
          $gl.vars.${fulfilledVarName} = res;
          #{fulfilled}
        }`
  }
  // 启用
  if (invokeBlocks?.includes('rejected')) {
    rejected = `(e)=>{
          $gl.vars.${rejectedVarName} = e;
          #{rejected}
        }`
  }

  return { fulfilled, rejected }
}

export default usePromise
