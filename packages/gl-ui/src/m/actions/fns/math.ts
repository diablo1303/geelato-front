import Big, { type BigSource } from 'big.js'

export const useMathFns = () => {
  return {
    newBig(value: BigSource){
      return new Big(value)
    },
    // 加法
    plus(value1:BigSource,value2:BigSource){
      return new Big(value1).plus(value2)
    },
    // 减法
    minus(value1:BigSource,value2:BigSource){
      return new Big(value1).minus(value2)
    },
    // 乘法
    times(value1:BigSource,value2:BigSource){
      return new Big(value1).times(value2)
    },
    // 除法
    div(value1:BigSource,value2:BigSource){
      return new Big(value1).div(value2)
    },
    // 取绝对值
    abs(value:BigSource){
      return new Big(value)
    },
    // 判断是否相等
    eq(value1:BigSource,value2:BigSource){
      return new Big(value1).eq(value2)
    },
    // 判断是否大于
    gt(value1:BigSource,value2:BigSource){
      return new Big(value1).gt(value2)
    },
    // 判断是否大于等于
    gte(value1:BigSource,value2:BigSource){
      return new Big(value1).gt(value2)
    },
    // 判断是否小于
    lt(value1:BigSource,value2:BigSource){
      return new Big(value1).lt(value2)
    },
    // 判断是否小于等于
    lte(value1:BigSource,value2:BigSource){
      return new Big(value1).lte(value2)
    },
    // 取模
    mod(value:BigSource,value2:BigSource){
      return new Big(value).mod(value2)
    },
    neg(value:BigSource){
      return new Big(value).neg()
    },
    // 计算x的n次幂
    pow(value:BigSource,value2:number){
      return new Big(value).pow(value2)
    },
    prec(sd:number, rm:number){
      return new Big(sd).prec(rm)
    },
    round(dp:number, rm:number){
      return new Big(dp).prec(rm)
    },
    sqrt(value:BigSource){
      return new Big(value).sqrt()
    },
    toExponential(dp:number, rm:number){
      return new Big(dp).toExponential(rm)
    },
    toFixed(dp:number, rm:number){
      return new Big(dp).toFixed(rm)
    },
    toPrecision(sd:number, rm:number){
      return new Big(sd).toPrecision(rm)
    },
    toNumber(value:BigSource) {
      return new Big(value).toNumber()
    },
    toString(value:BigSource) {
      return new Big(value).toString()
    },
    valueOf(value:BigSource) {
      return new Big(value).valueOf()
    },
  }
}