<script lang="ts">
/**
 *  页面保存记录，可以通过保存记录回滚到指定的版本
 */
export default {
  name: 'GlPageSaveLog'
}
</script>
<script lang="ts" setup>

import {type Ref,computed, ref, watch} from "vue";
import {entityApi, EntityReader, EntityReaderParam, useGlobal, utils} from "@geelato/gl-ui";
import {useComponentStore, usePageStore} from "@geelato/gl-ide";

const props = defineProps({
  recordId: String
})

const pageStore = usePageStore()

type Item = {
  id: string,
  opUser: string,
  opUserId: string,
  opTime: string,
  opDescription: string
}
const items: Ref<Item[]> = ref([])
const renderItems = computed(()=>{
  return utils.arrayReverse(items.value).filter((item)=>{
    return item.opDescription&&item.opDescription.indexOf('[')===0
  })
})
const fetchData = (opDataId: string) => {
  if (!opDataId) {
    return
  }
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_oprecord'
  entityReader.setFields('id,opUser,opTime,opUserId,opDescription')
  entityReader.params = []
  entityReader.params.push(new EntityReaderParam('opDataId', 'eq', opDataId))
  entityApi.queryByEntityReader(entityReader).then((res: any) => {
    items.value = res.data
  })
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

watch(() => {
  return pageStore.currentPage?.id + '#' + props.recordId
}, () => {
  fetch()
}, {immediate: true})

const global = useGlobal()
const componentStore = useComponentStore()
// 回滚版本
const rollback = (item: Item) => {
  try {
    const opDescriptionItems = JSON.parse(item.opDescription)
    const srcFlag = '源文件内容修改为'
    opDescriptionItems?.forEach((opDescriptionItem: string) => {
      if (opDescriptionItem?.indexOf(srcFlag) === 0) {
        const srcContent = JSON.parse(opDescriptionItem.replace(srcFlag, ''))
        pageStore.rollbackPage(srcContent)
        global.$message.info({content:'回滚成功'})
      }
    })
  } catch (e) {
    console.error(e)
    global.$message.error({content:'回滚失败'})
  }
}
</script>

<template>
  <div>
    <a-alert>当前页面保存到服务端的记录</a-alert>
    <a-list>
      <a-list-item v-for="item in renderItems">
        <a-list-item-meta
            :title="item.opTime"
            :description="item.opUser"
        >
        </a-list-item-meta>
        <template #actions>
          <a-popconfirm content="确认回滚到此版本?" @ok="rollback(item)">
            <GlIconfont title="回滚到此版本" type="gl-reset"/>
          </a-popconfirm>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<style scoped>

</style>
