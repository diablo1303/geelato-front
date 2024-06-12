type MessageRule = {
  rule: string // 匹配规则
  msg: string // 匹配后显示的提示
  extractKeyRules: Record<string, string[]> // 匹配规则，用于替换msg中的{0}
}
/**
 * 异常信息匹配
 * rule 匹配规则
 * msg 匹配后显示的提示
 * extractKeyRules 匹配规则，用于替换msg中的{0}等占位符。
 *                 如：'{0}': ["'.*'"]，表示以msg为输入，匹配出第一个正则表达式中的内容，替换msg中的{0}
 *                 如：'{0}': ["'.*'",".*"]，表示以msg为输入，匹配出第一个正则表达式"'.*'"中的内容，再进一步作为输入匹配第二个正则表达试".*"，最终结果替换msg中的{0}
 */
const zhMessages: MessageRule[] = [
  {
    rule: "Duplicate entry '.*' for key",
    msg: '唯一值冲突，内容{0}已存在',
    extractKeyRules: {
      '{0}': ["'.*'"]
    }
  },
  {
    rule: "Data truncation: Data too long for column '(\\w+)' at row \\d+",
    msg: '实体{0}的字段{1}被截断，数据太长。',
    extractKeyRules: {
      '{0}':["SQL\\s\\[(update|insert into)\\s\\w+","\\w+$"],
      '{1}': ["'(\\w+)'","\\w+"],
    }
  },
  {
    rule: "Data truncation: Out of range value for column '(\\w+)' at row \\d+",
    msg: '实体{0}的字段{1}被截断，可能是值太大或太小（如负数）、小数点、数据类型不匹配',
    extractKeyRules: {
      '{0}':["SQL\\s\\[(update|insert into)\\s\\w+","\\w+$"],
      '{1}': ["'(\\w+)'","\\w+"],
    }
  },
  {
    rule: "Column '\\w+' cannot be null",
    msg: '实体{0}的字段{1}不能为空',
    extractKeyRules: {
      '{0}':["SQL\\s\\[(update|insert into)\\s\\w+","\\w+$"],
      '{1}': ["'(\\w+)'","\\w+"],
    }
  },
  {
    rule: "Incorrect result size: expected 1, actual 0",
    msg: '期待获取到1条记录，实际获取的记录数为0',
    extractKeyRules: {}
  }
]

export const messages = zhMessages

/**
 * 匹配不到时，返回空字符串：''
 * @param data 异常字符串，或对象{code:-2,data:null,msg:"xxxxxxx",status:"fail"}
 */
export const getMessage = (data: string | Record<string, any>) => {
  if (!data) return ''
  let srcMsg = ''
  if (typeof data === 'object') {
    srcMsg = data.msg
  } else {
    srcMsg = data
  }

  /**
   * 从一组rules中，匹配提取关键字
   * 链式匹配，如：rule1的匹配结果为matchStr1，作为rule2的匹配输入
   */
  const matchKeywords = (inputStr: string, rules: string[]) => {
    let hasMatchStr = false
    let lastMatchStr = inputStr
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      const re = new RegExp(rule, 'g')
      if (re.test(lastMatchStr)) {
        lastMatchStr = lastMatchStr.match(re)![0]
        hasMatchStr = true
      }
    }
    return hasMatchStr ? lastMatchStr : ''
  }

  for (let index in messages) {
    const message = messages[index]
    // console.log('message', srcMsg, message, index,message.rule == srcMsg)
    if (new RegExp(message.rule, 'g').test(srcMsg)) {
      let hasMatchText = false
      let result = message.msg
      const ruleKeys = Object.keys(message.extractKeyRules)
      if (ruleKeys.length === 0) return message.msg
      ruleKeys.forEach((key) => {
        const matchText = matchKeywords(srcMsg, message.extractKeyRules[key])
        if (matchText) hasMatchText = true
        result = result.replace(key, matchText)
      })
      if (hasMatchText) return result
    }
  }
  return ''
}

export default () => {
  return { getMessage }
}
