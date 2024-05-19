<script lang="ts">
/**
 *  服务列表
 */
export default {
  name: 'GlApiList'
}
</script>
<script lang="ts" setup>
import { type Ref, ref, watch } from 'vue'
import {entityApi, EntityReader, EntityReaderParam, useGlobal, utils} from '@geelato/gl-ui'
import {  useAppStore } from '@geelato/gl-ide'
import GlApiModal from "./GlApiModal.vue";

const props = defineProps({
  recordId: String
})
const global = useGlobal()
const appStore = useAppStore()
const allItems: Ref<Item[]> = ref([])
const renderItems: Ref<Item[]> = ref([])
const searchText = ref('')
const orderBy = ref('updateAt')

const generateRenderItems = () => {
  // 如果有排序值，则先对数据进行排序
  if (orderBy.value === 'updateAt') {
    // @ts-ignore 从最新到最老
    allItems.value.sort((a, b) => b[orderBy.value].localeCompare(a[orderBy.value]))
  } else if (orderBy.value === 'name') {
    // @ts-ignore 从小到大
    allItems.value.sort((a, b) => a[orderBy.value].localeCompare(b[orderBy.value]))
  }

  if (!searchText.value) {
    renderItems.value.length = 0
    renderItems.value.push(...allItems.value)
    return
  }
  renderItems.value = allItems.value.filter((item) => {
    return (
      item.name.indexOf(searchText.value) != -1 || item.name?.indexOf(searchText.value) != -1
    )
  })
}
watch(searchText, () => {
  generateRenderItems()
})
watch(orderBy, () => {
  generateRenderItems()
})
type Item = {
  id: string
  creator: string
  updateAt: string
  updaterName:string
  creatorName: string
  name: string
  enableStatus:boolean
  remark?: string
}
/**
 * 加载记录
 */
const fetchData = () => {
  if (!appStore.currentApp.id) {
    return
  }
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_api'
  entityReader.setFields('id,creator,creatorName,updateAt,updaterName,name,enableStatus,remark')
  entityReader.params = []
  entityReader.params.push(new EntityReaderParam('appId', 'eq', appStore.currentApp.id))

  entityApi.queryByEntityReader(entityReader).then(
    (res: any) => {
      allItems.value = res.data
      generateRenderItems()
    },
    () => {
      global.$message.error({ content: '获取应用的接口数据失败' })
    }
  )
}

const changeTab = (value: any) => {
  orderBy.value = value
}

const visible = ref(false)
const saving = ref(false)
const apiModal = ref()
const currentApiId = ref('')
const currentApi= ref<Item>()
// 用于刷新modal，确保每新都是重新创建modal
const openModal = (item?: Item) => {
  if (item) {
    // 有item 说明是编辑
    currentApiId.value = item.id
    currentApi.value = item
  } else {
    // 无item 说明是新增
  }
  visible.value = true
}
const handleBeforeOk = () => {
  // visible.value = true
  return apiModal.value?.save()
}

const handleOk = () => {
}
const handleCancel = () => {
  visible.value = false
}

fetchData()
</script>

<template>
  <div class="gl-service-list">
    <a-tabs :default-active-key="orderBy" size="mini" @change="changeTab">
      <a-tab-pane key="updateAt" title="按时间排序"></a-tab-pane>
      <a-tab-pane key="name" title="按名称排序"></a-tab-pane>
      <template #extra>
        <a-tag style="margin-right: 8px" color="arcoblue" size="small" title="当前应用的接口总数量"
          >{{ allItems.length }}
        </a-tag>
      </template>
    </a-tabs>

    <a-space size="mini" style="padding: 4px 0">
      <a-button size="small" type="primary" @click="openModal(undefined)">
        <gl-iconfont type="gl-plus-circle"></gl-iconfont>
      </a-button>
      <a-input-search
        v-model="searchText"
        size="small"
        placeholder="录入中、英文名查询"
        style="width: 100%"
      ></a-input-search>
    </a-space>
    <a-list size="small">
      <!--      utils.timeAgo(item.updateAt)-->
      <template v-for="item in renderItems">
        <a-list-item @click="openModal(item)">
          <a-list-item-meta :title="item.name" :description="item.remark"></a-list-item-meta>
          <template #actions>
            <span class="gl-actions-description" :title="`${item.updaterName||''}更新@${item.updateAt}`">{{
              utils.timeAgo(item.updateAt)
            }}</span>
          </template>
        </a-list-item>
      </template>
    </a-list>
    <a-modal
        draggable
        ok-text="保存"
        cancel-text="取消"
        body-style="padding:0"
        v-model:visible="visible"
        :on-before-ok="handleBeforeOk"
        @cancel="handleCancel"
        @ok="handleOk"
        fullscreen>
      <template #title>
        <GlIconfont type="gl-api" style="margin-right: 4px"></GlIconfont>
        <span>{{`接口编排-${currentApi?.name}`}}</span>
      </template>
      <GlApiModal :key="currentApiId" ref="apiModal" :apiId="currentApiId"></GlApiModal>
    </a-modal>
  </div>
</template>
<style>
.gl-service-list .gl-has {
  color: #165dff;
}

.gl-service-list .arco-list-item {
  padding: 1px 14px !important;
}

.gl-service-list .arco-list-item-meta-description {
  font-size: 11px;
}

.gl-service-list .gl-actions-description {
  font-size: 11px;
}
</style>
