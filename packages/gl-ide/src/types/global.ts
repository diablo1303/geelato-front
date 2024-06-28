/**
 * 在点击菜单项，依据元数据配置，打开相应的窗口
 */
export type MenuItemMeta = {
  // https://www.geelato.cn
  // url支持变量
  // 例如，如果一个页面的 URL 是 https://www.example.com:8080/path/to/page.html，那么 ${origin}相当于，window.location.origin 将返回 https://www.example.com:8080
  // 若url为空，target为_blank时，则打开一个新的窗口
  url: string
  // "_blank" 或 "_self"
  target: string
  // 查询参数
  query: [{ a: 1 }, { b: 2 }]
  // 当target为_blank时，打开新窗口的页面样式ID
  // 该页面样式ID来源于平台，平台提供多种页面样式
  theme: ''
}
