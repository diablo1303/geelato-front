export default class EntityQueryCache {
  private data: Record<string, any> = {}

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
    // console.log(`添加缓存，当前缓存长度：${Object.keys(this.data).length}`)
  }

  get(key: string) {
    // 从缓存中获取指定 key 对应的值。
    const cachedItem = this.data[key]
    if (!cachedItem) return null
    const isExpired = Date.now() - cachedItem.now > cachedItem.maxAge
    if(isExpired){
      this.delete(key)
      // console.log(`缓存过期，删除缓存，当前缓存长度：${Object.keys(this.data).length}`)
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