<script lang="ts">
/**
 *  模型列表
 */
export default {
  name: 'GlModelList'
}
</script>
<script lang="ts" setup>
import {type Ref, ref, watch} from 'vue'
import type {QueryTableForm} from '@geelato/gl-ui'
import {entityApi, EntityReader, EntityReaderParam, useGlobal, utils} from '@geelato/gl-ui'
import {useAppStore} from '@geelato/gl-ide'
import GlModelTableModal from "./table/modal.vue";
import GlModelTableTabs from "./table/tableTabs.vue";

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
  } else if (orderBy.value === 'entityName') {
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
        item.entityName.indexOf(searchText.value) != -1 || item.title?.indexOf(searchText.value) != -1
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
  updaterName: string
  creatorName: string
  entityName: string
  title?: string
  tableComment?: string
}
/**
 * 加载记录
 */
const fetchData = () => {
  if (!appStore.currentApp.id) {
    return
  }
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_dev_table'
  entityReader.setFields(
      'id,creator,creatorName,updateAt,updaterName,entityName,title,tableComment'
  )
  entityReader.params = []
  entityReader.params.push(new EntityReaderParam('appId', 'eq', appStore.currentApp.id))
  entityApi.queryByEntityReader(entityReader).then(
      (res: any) => {
        allItems.value = res.data
        generateRenderItems()
        // if (res.data?.length > 0) {
        //   global.$message.success({ content: '获取' + (res.data.length || 0) + '条页面保存记录' })
        // }
      },
      () => {
        global.$message.error({content: '获取应用的模型数据失败'})
      }
  )
}

const changeTab = (value: any) => {
  orderBy.value = value
}

fetchData()

/* 模型tab页所需参数 */
const formTabsParams = ref({
  id: '', visible: false, formState: 'edit', formCol: 2, width: '76%',
  parameter: {appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode}
});
/**
 * 点击打开tab页面
 * @param id
 */
const tableOpen = (id: string) => {
  if (!appStore.currentApp.id) {
    return
  }
  formTabsParams.value.id = id;
  formTabsParams.value.visible = true;
}

/* 模型表单所需参数 */
const formParams = ref({
  id: '', visible: false, formState: 'add', formCol: 2, width: '1020px',
  parameter: {connectId: '', appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode}
});
/**
 * 新增模型，打开模型表单
 * @param ev
 */
const addTableForm = (ev?: MouseEvent) => {
  if (!appStore.currentApp.id) {
    return
  }
  formParams.value.visible = true;
}
/**
 * 表单保存成功后
 * @param data
 * @param action
 */
const tableFormSaveSuccess = (data: QueryTableForm, action: string) => {
  // 打开模型tab页面
  if (data.id && action === 'add') tableOpen(data.id);
  // 刷新模型列表
  fetchData();
}
</script>

<template>
  <div class="gl-model-list">
    <a-tabs :default-active-key="orderBy" size="mini" @change="changeTab">
      <a-tab-pane key="updateAt" title="按时间排序"/>
      <a-tab-pane key="entityName" title="按名称排序"/>
      <template #extra>
        <a-tag color="arcoblue" size="small" style="margin-right: 8px" title="当前应用的模型总数量">
          {{ allItems.length }}
        </a-tag>
      </template>
    </a-tabs>

    <a-space size="mini" style="padding: 4px 0">
      <a-button size="small" type="primary" @click="addTableForm">
        <gl-iconfont type="gl-plus-circle"/>
      </a-button>
      <a-input-search v-model="searchText" placeholder="录入中、英文名查询" size="small" style="width: 100%"/>
    </a-space>

    <a-list size="small">
      <!--      utils.timeAgo(item.updateAt)-->
      <template v-for="item in renderItems" :key="item.id">
        <a-list-item style="cursor: pointer;" @click="tableOpen(item.id)">
          <a-list-item-meta :description="item.title as string" :title="item.entityName"/>
          <template #actions>
            <span :title="`${item.updaterName || ''}更新@${item.updateAt}`" class="gl-actions-description">
              {{ utils.timeAgo(item.updateAt) }}
            </span>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </div>

  <GlModelTableModal v-model:visible="formParams.visible" :formCol="formParams.formCol"
                     :formState="formParams.formState" :modelValue="formParams.id"
                     :parameter="formParams.parameter" :width="formParams.width"
                     @saveSuccess="tableFormSaveSuccess"/>

  <GlModelTableTabs v-model:visible="formTabsParams.visible" :formState="formTabsParams.formState"
                    :modelValue="formTabsParams.id" :parameter="formTabsParams.parameter"
                    :width="formTabsParams.width"
                    @deleteSuccess="tableFormSaveSuccess" @updateSuccess="tableFormSaveSuccess"/>
</template>
<style>
.gl-model-list .gl-has {
  color: #165dff;
}

.gl-model-list .arco-list-item {
  padding: 1px 14px !important;
}

.gl-model-list .arco-list-item-meta-description {
  font-size: 11px;
}

.gl-model-list .gl-actions-description {
  font-size: 11px;
}
</style>
