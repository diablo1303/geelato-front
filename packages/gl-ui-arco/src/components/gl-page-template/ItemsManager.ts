export type ItemType = {
  id: string
  [key: string]: any
}
export default function useItemsManager<T extends ItemType>(params: {
  // 初始化时不触发，只在数姐项增加时触发，数组内各项的属性改变时不触发
  change: Function
}) {
  const items: any[] = []
  return {
    exists(id: string) {
      const found = items.find((item) => {
        return item.id === id
      })
      return !!found
    },
    /**
     * 添加到集合中
     * 存在相同id的则不添加
     */
    tryPush(item: T) {
      if (this.exists(item.id)) {
        console.log('已存在同一id的数据，不再添加', item)
        return false
      } else {
        items.push(item)
        if (params.change && typeof params.change === 'function') {
          params.change('tryPush', item)
        }
        return true
      }
    },
    /**
     * 批量添加
     * @param items
     */
    tryPushBatch(items: T[]) {
      const result: boolean[] = []
      items.forEach((item: T) => {
        result.push(this.tryPush(item))
      })
      return result
    },
    getItems() {
      return items
    },
    init(data: T[]) {
      items.push(...data)
      console.log('push items', items)
    },
    remove(index: number) {
      console.log('removeIndex', index)
      items.splice(index, 1)
      if (params.change && typeof params.change === 'function') {
        params.change('remove', index)
      }
      console.log('items', items)
    },

    removeAll() {
      items.length = 0
      if (params.change && typeof params.change === 'function') {
        params.change('removeAll')
      }
      console.log('items', items)
    }
  }
}
