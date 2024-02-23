<script lang="ts">
/**
 *  页面保存记录
 */
export default {
  name: 'GlPageSaveLog'
}
</script>
<script lang="ts" setup>
import { type Ref, computed, ref, watch, onUnmounted } from 'vue'
import {
  emitter,
  entityApi,
  EntityReader,
  EntityReaderParam,
  useGlobal,
  utils
} from '@geelato/gl-ui'
import { useComponentStore, usePageStore, EventNames } from '@geelato/gl-ide'

const props = defineProps({
  recordId: String
})

const pageStore = usePageStore()

type Item = {
  id: string
  creator: string
  createAt: string
  creatorName: String
  pageId: string
}
const items: Ref<Item[]> = ref([])
/**
 * 加载记录
 * @param pageId
 */
const fetchData = (pageId: string) => {
  if (!pageId) {
    return
  }
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_app_page_log'
  entityReader.setFields('id,creator,creatorName,createAt,pageId')
  entityReader.params = []
  entityReader.params.push(new EntityReaderParam('pageId', 'eq', pageId))
  entityApi.queryByEntityReader(entityReader).then((res: any) => {
    items.value = res.data
  })
}

const fetchSource = (id: string) => {}

const fetch = () => {
  if (props.recordId) {
    fetchData(props.recordId)
  } else {
    // 如果组件没有传入
    if (pageStore.currentPage?.id) {
      fetchData(pageStore.currentPage.id)
    }
  }
}

watch(
  () => {
    return pageStore.currentPage?.id + '#' + props.recordId
  },
  () => {
    fetch()
  },
  { immediate: true }
)

const global = useGlobal()
const componentStore = useComponentStore()
// 回滚版本
const rollback = (id: string) => {
  try {
    const entityReader = new EntityReader()
    entityReader.entity = 'platform_app_page_log'
    entityReader.setFields('id,sourceContent')
    entityReader.params = []
    entityReader.params.push(new EntityReaderParam('id', 'eq', id))
    entityApi.queryByEntityReader(entityReader).then((res: any) => {
      pageStore.rollbackPage(JSON.parse(res.data[0]?.sourceContent))
      global.$message.info({ content: '回滚成功' })
    })
  } catch (e) {
    console.error(e)
    global.$message.error({ content: '回滚失败' })
  }
}

emitter.on(EventNames.GlIdeToolbarPageSaved, fetch)

onUnmounted(() => {
  emitter.off(EventNames.GlIdeToolbarPageSaved, fetch)
})
</script>

<template>
  <div>
    <a-alert
      >当前页面保存记录
      <gl-iconfont
        type="gl-refresh"
        @click="fetch"
        style="float: right; cursor: pointer; padding-right: 4px"
      ></gl-iconfont>
    </a-alert>
    <a-list>
      <a-list-item v-for="item in items">
        <a-list-item-meta :title="item.createAt" :description="item.creatorName"></a-list-item-meta>
        <template #actions>
          <a-popconfirm content="确认回滚到此版本?" @ok="rollback(item.id)">
            <GlIconfont title="回滚到此版本" type="gl-reset" />
          </a-popconfirm>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>
