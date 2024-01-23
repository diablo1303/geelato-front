<script lang="ts">
export default {
  name: 'GlPageHelp'
}
</script>
<script lang="ts" setup>
import { ref } from 'vue'
import { entityApi, EntityReader, EntityReaderParam } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  pageHelpId: String
})

const pageHelp = ref({
  id: '',
  title: '',
  content: ''
})
const fullscreen = ref(false)
const loading = ref(false)
const showPageHelp = (pageHelpId?: string) => {
  if (!pageHelpId) return
  pageHelpVisible.value = true
  loading.value = true
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_app_page_help'
  entityReader.setFields('id,title,content')
  entityReader.params = [new EntityReaderParam('id', 'eq', pageHelpId)]
  entityApi.queryByEntityReader(entityReader).then(
    (res: any) => {
      loading.value = false
      if (res && res.data && res.data.length > 0) {
        pageHelp.value = res.data[0]
      }
    },
    () => {
      pageHelp.value.content = '加载失败'
      loading.value = false
    }
  )
}
const pageHelpVisible = ref(false)
const handleOk = () => {
  pageHelpVisible.value = false
}
const handleCancel = () => {
  pageHelpVisible.value = false
}
</script>

<template>
  <div class="gl-page-help">
    <div v-if="pageHelpId" title="帮助指引" @click="showPageHelp(pageHelpId)">
      <gl-iconfont type="gl-help"></gl-iconfont>
    </div>
    <a-modal
      :visible="pageHelpVisible"
      :width="1280"
      @ok="handleOk"
      @cancel="handleCancel"
      draggable
      :fullscreen="fullscreen"
    >
      <template #title>
        【帮助指引】{{ pageHelp.title }}
        <span style="position: absolute; right: 60px">
          <a-button @click="fullscreen = !fullscreen" size="mini" shape="round" type="primary">{{
            fullscreen ? '原始大小' : '全屏'
          }}</a-button>
        </span>
      </template>
      <div style="min-height: 800px">
        <div v-if="loading" style="padding-top: 380px; text-align: center">
          <a-spin dot />
        </div>
        <div v-else-if="!loading && pageHelp.content" v-html="pageHelp.content"></div>
      </div>
      <template #footer>
        <a-space>
          <a-button @click="handleCancel">关闭</a-button>
          <!--          <a-button @click="handleCancel">编辑</a-button>-->
        </a-space>
      </template>
    </a-modal>
  </div>
</template>

<style scoped></style>