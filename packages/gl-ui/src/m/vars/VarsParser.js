/**
 *  变量解析器
 *  实现字符串的变量解析
 */
export default class VarsParser {

  constructor({platform, app, page, component} = {}) {
    this.setVars({platform, app, page, component})
    return this
  }

  setVars({platform, app, page, component}) {
    this.platform = platform
    this.app = app
    this.page = page
    this.component = component
    return this
  }

  /**
   * 解析字符串，进行变量替换
   * @param contentStr 待解析的字符串
   * @param {platform, app, page, component} 环境变量
   * @return 返回解析后的字符串
   */
  parse(contentStr, {platform, app, page, component} = {}) {
    platform ? this.platform = platform : ''
    app ? this.app = app : ''
    page ? this.page = page : ''
    component ? this.component = component : ''
    const platformVars = this.platform ? this.platform.$data.glVars : {}
    // TODO 提供platform和app的变量管理入口
    const appVars = this.app ? this.app.$data.glVars : {urlRoot: 'http://localhost:8080'}
    const pageVars = this.page ? this.page.$data.glVars : {}
    const componentVars = this.component ? this.component.$data.glVars : {}
    console.log('geelato > runtime > VarsParser.js > parse() > platformVars:', platformVars)
    console.log('geelato > runtime > VarsParser.js > parse() > appVars:', appVars)
    console.log('geelato > runtime > VarsParser.js > parse() > pageVars :', pageVars)
    console.log('geelato > runtime > VarsParser.js > parse() > componentVars:', componentVars)
    const result = new Function('platform', 'app', 'page', 'component', 'return `' + contentStr + '`')(platformVars, appVars, pageVars, componentVars)
    console.log('geelato > runtime > VarsParser.js > parse() > before parse:', contentStr)
    console.log('geelato > runtime > VarsParser.js > parse() > after  parse:', result)
    return result
  }

}
