const usePromise = (
  invokeBlocks: Array<String>,
  fulfilledVarName: string,
  rejectedVarName: string
) => {
  let fulfilled = `async(res)=>{return res}`
  let rejected = 'async(e)=>{return e}'
  let then = ''
  // 启用
  if (invokeBlocks?.includes('fulfilled')) {
    fulfilled = `async(res)=>{
          $gl.vars.${fulfilledVarName} = res;
          #{fulfilled}
        }`
  }
  // 启用
  if (invokeBlocks?.includes('rejected')) {
    rejected = `async(e)=>{
          $gl.vars.${rejectedVarName} = e;
          #{rejected}
        }`
  }

  return { fulfilled, rejected }
}

export default usePromise
