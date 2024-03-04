<script lang="ts">
/**
 *  页面保存记录
 */
export default {
  name: 'GlPageSaveLog'
}
</script>
<script lang="ts" setup>
import { type Ref, ref, watch, onUnmounted } from 'vue'
import {
  emitter,
  entityApi,
  EntityReader,
  EntitySaver,
  EntityReaderParam,
  useGlobal, utils
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
  creatorName: string
  pageId: string
  description?: string
  showDescription?: boolean
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
  entityReader.setFields('id,creator,creatorName,createAt,pageId,description')
  entityReader.params = []
  entityReader.params.push(new EntityReaderParam('pageId', 'eq', pageId))
  entityApi.queryByEntityReader(entityReader).then(
    (res: any) => {
      items.value = res.data
      // if (res.data?.length > 0) {
      //   global.$message.success({ content: '获取' + (res.data.length || 0) + '条页面保存记录' })
      // }
    },
    () => {
      global.$message.error({ content: '获取页面保存记录失败' })
    }
  )
}

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

/**
 *  更新备注
 */
const updateDescription = (item: Item) => {
  const entitySaver = new EntitySaver('platform_app_page_log')
  entitySaver.record = {
    id: item.id,
    description: item.description
  }
  entityApi.saveEntity(entitySaver).then(
    () => {
      global.$message.success({ content: '保存备注成功' })
    },
    () => {
      global.$message.error({ content: '保存备注失败' })
    }
  )
}

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
      global.$message.success({ content: '回滚成功' })
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
  <div class="gl-page-save-log">
    <a-alert
      >当前页面保存记录
      <gl-iconfont
        type="gl-refresh"
        @click="fetch"
        style="float: right; cursor: pointer; padding-right: 4px"
      ></gl-iconfont>
    </a-alert>
    <a-list size="small">
      <template v-for="item in items">
        <a-list-item>
          <div :title="item.createAt">
            <a-list-item-meta
              :title="utils.timeAgo(item.createAt)"
              :description="item.creatorName"
            ></a-list-item-meta>
          </div>
          <template #actions>
            <GlIconfont
              title="备注"
              type="gl-info-circle"
              :class="{ 'gl-has': !!item.description }"
              @click="item.showDescription = !item.showDescription"
            />
            <a-popconfirm content="确认回滚到此版本?" @ok="rollback(item.id)">
              <GlIconfont title="回滚到此版本" type="gl-reset" />
            </a-popconfirm>
          </template>
        </a-list-item>
        <div style="padding: 0 3px 0 2px">
          <a-textarea
            v-model="item.description"
            v-if="item.showDescription"
            placeholder="备注信息"
            @change="updateDescription(item)"
          ></a-textarea>
        </div>
      </template>
    </a-list>
  </div>
</template>
<style>
.gl-page-save-log .gl-has {
  color: #165dff;
}
</style>
