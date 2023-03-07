import type {App} from "vue";

export default class PluginUtil {
  /**
   * 标记开始安装，若标记前未开始，则返回false，否则标记并返回true
   * @param app
   * @param packageName
   */
  static markInstalledPlugin(app: App, packageName: string){
    if(app.config.globalProperties.$gl_packages===undefined){
      app.config.globalProperties.$gl_packages = {}
    }
    if(app.config.globalProperties.$gl_packages[packageName]){
      return true
    }
    app.config.globalProperties.$gl_packages[packageName] = true
    // console.log(packageName,"> install()",app.config.globalProperties.$gl_packages,'app._uid:',app._uid);
    return false
  }
}
