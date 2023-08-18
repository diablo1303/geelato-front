export default class ParseResult {

    blockName: string = ''
    startLine: string = ''
    children: Array<ParseResult> = []
    endLine: string = ''
    // 被调用的块占位符名称，通过该名称，实现代码块占位符替换
    // 占位符名称格式为#{xxxKey}
    invokeBlockNames: Array<string> = []


    constructor(startLine?: string, endLine?: string) {
        this.startLine = startLine || ''
        this.endLine = endLine || ''
        return this
    }

    setBlockName(blockName: string) {
        this.blockName = blockName
        return this
    }

    toString(): string {
        const lines = []
        let result = ''
        // console.log('ParseResult > toString() > blockName:', this.blockName)
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
        }
        return result.replace(/;;{1,}/g, ';')
    }

    replaceUnUsePlaceholder(str: string) {
        // 去掉没用的占位符#{xxx}
        // 去掉每行最后一个";" replace(/;$/g,'')
        // console.log('replaceUnUsePlaceholder:', str.trim())
        return str.trim().replace(/#\{[a-zA-Z]+\}/g, '')
    }
}
