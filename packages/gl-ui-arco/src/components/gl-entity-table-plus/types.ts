// TODO 未来是否可以做到过滤器的分享？方便同事查看数据

// 我的过滤器
import type { QueryItemKv } from '../gl-query/query'

export type FilterType = {
  id: string
  name: string
  // 显示在工具条上
  showOnToolbar: boolean
  // 过滤项的键值
  queryItemKvs: QueryItemKv[]
}

/**
 *  个性化配置
 */
export type MyEntityTableConfig = {
  // 我的常用过滤器
  filters: FilterType[]
}
