import useLogger from '../hooks/useLogger'

/**
 *  实体查询缓存
 */
class EntityQueryCache {
  public logger = useLogger('EntityQueryCache')
  public data: Record<string, any> = {}

  /**
   * @param key gql 对象字符串
   * @param value promise
   * @param maxAge 毫秒
   */
  set(key: string, value: any, maxAge: any) {
    // 保存数据
    this.data[key] = {
      maxAge: maxAge || 0,
      value,
      now: Date.now()
    }
    // this.logger.debug(`添加缓存，当前缓存长度：${Object.keys(this.data).length}`)
  }

  get(key: string) {
    // 从缓存中获取指定 key 对应的值。
    const cachedItem = this.data[key]
    if (!cachedItem) return null
    const isExpired = Date.now() - cachedItem.now > cachedItem.maxAge
    if (isExpired) {
      this.delete(key)
      // this.logger.debug(`缓存过期，删除缓存，当前缓存长度：${Object.keys(this.data).length}`)
      return null
    }
    return cachedItem.value
  }

  delete(key: string) {
    // 从缓存中删除指定 key 对应的值。
    return delete this.data[key]
  }

  clear() {
    // 清空已缓存的数据。
    this.data = {}
  }
}

const entityQueryCache = new EntityQueryCache()

/**
 *  清除已过期的缓存
 */
const clearExpired = () => {
  entityQueryCache.logger.debug(
    `定时器清除过期缓存，清理前缓存长度：${Object.keys(entityQueryCache.data || {}).length}`
  )
  if (entityQueryCache.data) {
    for (const key in entityQueryCache.data) {
      // 从缓存中获取指定 key 对应的值。
      const cachedItem = entityQueryCache.data[key]
      if (cachedItem) {
        const isExpired = Date.now() - cachedItem.now > cachedItem.maxAge
        if (isExpired) {
          entityQueryCache.logger.debug(
            `定时器清除过期缓存，清除KEY:${key}，清除后缓存长度：${
              Object.keys(entityQueryCache.data).length
            }`
          )
          entityQueryCache.delete(key)
        }
      }
    }
  }
}
// 每2分钟自动清理一次过期的缓存
// ！！！ 定时的清理缓存，会导致引用的对象被删除，导致无法使用
// const monitor = setInterval(clearExpired, 2 * 60 * 1000)
export const destory = () => {
  // clearInterval(monitor)
}
export default entityQueryCache
