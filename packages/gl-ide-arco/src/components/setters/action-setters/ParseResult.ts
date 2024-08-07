export default class ParseResult {
  // 解析失败时，存在错误信息，则否为空
  errorMessage: string | undefined = undefined
  blockHandlerName: string = ''
  startLine: string = ''
  children: Array<ParseResult> = []
  endLine: string = ''
  // 被调用的块占位符名称，通过该名称，实现代码块占位符替换
  // 占位符名称格式为#{xxxKey}
  invokeBlockNames: Array<string> = []

  isEndWithLineFeed: boolean = false

  constructor(startLine?: string, endLine?: string) {
    this.startLine = startLine || ''
    this.endLine = endLine || ''
    return this
  }

  isError(): boolean {
    return !!this.errorMessage
  }

  setErrorMessage(errorMessage:string) {
    this.errorMessage = errorMessage
    return this
  }

  setBlockName(blockHandlerName: string) {
    this.blockHandlerName = blockHandlerName
    return this
  }

  toString(): string {
    const lines = []
    let result = ''
    // console.log('ParseResult > toString() > blockHandlerName:', this.blockHandlerName)
    // console.log('ParseResult > toString() > invokeBlockNames:', this.invokeBlockNames)
    if (this.invokeBlockNames.length > 0) {
      // 有占位符替换的情况
      const invokeBlockObj: { [key: string]: any } = {}
      for (const index in this.children) {
        invokeBlockObj[this.invokeBlockNames[index]] = this.children[index].toString()
      }

      // console.log('ParseResult > toString() > invokeBlockObj:', invokeBlockObj, this.children)
      if (this.startLine) {
        let sLine = this.startLine
        for (let key in invokeBlockObj) {
          sLine = sLine.replace(`#{${key}}`, invokeBlockObj[key])
        }
        // 将未替换的占位符设置为空
        lines.push(this.replaceUnUsePlaceholder(sLine))
      }
      if (this.endLine) {
        let eLine = this.endLine
        for (let key in invokeBlockObj) {
          eLine = eLine.replace(`#{${key}}`, invokeBlockObj[key])
        }
        lines.push(this.replaceUnUsePlaceholder(eLine))
      }
      result = lines.length > 0 ? lines.join(';') : ''
    } else {
      // 无占位符替换的情况
      if (this.startLine) {
        lines.push(this.replaceUnUsePlaceholder(this.startLine))
      }

      for (const key in this.children) {
        lines.push(this.children[key].toString())
      }
      if (this.endLine) {
        lines.push(this.replaceUnUsePlaceholder(this.endLine))
      }
      result = lines.length > 0 ? lines.join(';') : ''
      if (this.isEndWithLineFeed) {
        result += '\n'
      }
    }
    return result.replace(/;;{1,}/g, ';')
  }

  /**
   * 生成的代码字符串（toString）时，是否增加换行作为结尾
   * 避免影响下一个代码块生成的代码，如代码以 注释//作为结束行时，会影响下一代码块
   * 对于不受控的，提供给用户直接编写代码的XXBlockHandler，需要调用该方法，如：JsCodeBlockHandler
   */
  endWithLineFeed() {
    this.isEndWithLineFeed = true
    return this
  }

  replaceUnUsePlaceholder(str: string) {
    // 去掉没用的占位符#{xxx}
    // 去掉每行最后一个";" replace(/;$/g,'')
    // console.log('replaceUnUsePlaceholder:', str.trim())
    return str.trim().replace(/#\{[a-zA-Z]+\}/g, '')
  }
}
