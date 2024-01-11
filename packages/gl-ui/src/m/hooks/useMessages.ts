const zhMessages = [
  {
    rule: "Duplicate entry '.*' for key",
    msg: '唯一值冲突，内容{0}已存在',
    detailRule: "'.*'"
  }
]

export const messages = zhMessages

/**
 * 匹配不到时，返回空字符串：''
 * @param data
 */
export const getMessage = (data: string) => {
  for (let key in messages) {
    const message = messages[key]
    // console.log('message', message, data)
    const re = new RegExp(message.rule, 'g')
    const matchStr = re.source
    if (re.test(data)) {
      if (message.detailRule) {
        const str = data.match(re)![0]
        const detailMessages = str.match(new RegExp(message.detailRule,'g'))
        let result = message.msg
        detailMessages?.forEach((v, index) => {
          result = result.replace(`{${index}}`, detailMessages[index])
        })
        return result
      }
      return message.msg
    }
  }
  return ''
}

export default () => {
  return { getMessage }
}
