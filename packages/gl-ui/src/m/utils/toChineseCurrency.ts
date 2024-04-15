/**
 * 将金额转换为大写
 * @param num
 */
export function toChineseCurrency(num: number | string) {
  // 确保 num 是字符串
  num = String(num)

  // 处理负数
  const isNegative = num[0] === '-'
  const absoluteNum = isNegative ? num.substring(1) : num

  // 定义中文数字和单位
  const chineseNumbers = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const integerUnits = ['', '拾', '佰', '仟']
  const groupUnits = ['元', '万', '亿', '万亿', '亿亿']
  const decimalUnits = ['角', '分']

  // 分离整数部分和小数部分
  const integerPart = absoluteNum.split('.')[0]
  const decimalPart = absoluteNum.split('.')[1] || ''

  // 处理整数部分
  let integerStr = ''
  let zeroCount = 0
  for (let i = 0; i < integerPart.length; i++) {
    const digit = parseInt(integerPart[i])
    if (digit === 0) {
      zeroCount++
    } else {
      if (zeroCount > 0) {
        // 多个0转为零
        integerStr += chineseNumbers[0]
      }
      zeroCount = 0
      integerStr +=
        chineseNumbers[digit] +
        integerUnits[(integerPart.length - i - 1) % 4] +
        ((integerPart.length - i) % 4 === 1
          ? groupUnits[Math.floor((integerPart.length - i) / 4)]
          : '')
    }
  }
  if (zeroCount > 0) {
    // zeroCount未清0，表示值以0结尾
    integerStr += groupUnits[Math.floor(zeroCount / 4)]
  }
  // integerStr = integerStr ? integerStr : '零'

  // 处理小数部分，保留2位：0.1212零元壹角贰分
  let decimalStr = ''
  if (decimalPart.length > 0) {
    for (let i = 0; i < decimalPart.length && i < 2; i++) {
      decimalStr += chineseNumbers[parseInt(decimalPart[i])] + decimalUnits[i]
    }
  }

  // 修正末尾的零和单位
  const result = integerStr + (decimalStr || '元整')

  const finalResult = result
    .replace(/元元/g, '元')
    .replace(/零元/g, '元')
    .replace(/零万/g, '万')
    .replace(/零亿/g, '亿')
    .replace(/零+/g, '零')
    .replace(/零分$/, '')
    .replace(/零角$/, '')
    // .replace(/零元整$/, '元整')
    .replace(/^元/, '零元')
    .replace(/元$/, '元整')

  // 添加正负号
  return isNegative ? '负' + finalResult : finalResult
}
