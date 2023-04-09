export default class ParseResult {
    startLine: string = ''
    children: Array<ParseResult> = []
    endLine: string = ''

    constructor(startLine?: string, endLine?: string) {
        this.startLine = startLine || ''
        this.endLine = endLine || ''
    }

    toString(): string {
        const lines = []
        if (this.startLine) {
            lines.push(this.startLine)
        }
        for (const key in this.children) {
            lines.push(this.children[key].toString())
        }
        if (this.endLine) {
            lines.push(this.endLine)
        }
        // console.log('lines', lines)
        return lines.length > 0 ? lines.join(';') : ''
    }
}
