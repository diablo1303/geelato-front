const usePromise = (invokeBlocks?: Array<String>) => {
  let onFulfilled = `undefined`
  let onRejected = 'undefined'
  // 启用
  if (invokeBlocks?.includes('onFulfilled')) {
    onFulfilled = `(res)=>{
          $gl.vars.res = res;
          #{onFulfilled}
        }`
  }
  // 启用
  if (invokeBlocks?.includes('onRejected')) {
    onRejected = `(e)=>{
          $gl.vars.e = e;
          #{onRejected}
        }`
  }
  return { onFulfilled, onRejected }
}

export default usePromise
