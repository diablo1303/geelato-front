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
import {modelApi, type QueryAppTableForm, type QueryTableForm} from '@geelato/gl-ui'
import {entityApi, EntityReader, EntityReaderParam, useGlobal, utils} from '@geelato/gl-ui'
import {useAppStore} from '@geelato/gl-ide'
import GlModelTableModal from "./table/modal.vue";
import GlModelTableTabs from "./table/tableTabs.vue";
import GlModelTableAppForm from "./application/form.vue";
import {approvalStatusOptions} from "./application/searchTable";

const props = defineProps({
  recordId: String
})
const global = useGlobal()
const appStore = useAppStore()
const allItems: Ref<Item[]> = ref([])
const renderItems: Ref<Item[]> = ref([])
const allAccreditItems: Ref<QueryAppTableForm[]> = ref([])
const renderAccreditItems: Ref<QueryAppTableForm[]> = ref([])
const searchText = ref('')
const orderBy = ref('updateAt')
const activeKey = ref<number[]>([1, 2]);

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
  } else {
    renderItems.value = allItems.value.filter((item) => {
      return (
          item.entityName.indexOf(searchText.value) != -1 || item.title?.indexOf(searchText.value) != -1
      )
    })
  }

  activeKey.value = activeKey.value.filter(item => item !== 2);
  if (renderItems.value.length > 0) {
    activeKey.value.push(2);
  }
}
const generateRenderAccreditItems = () => {
  // 如果有排序值，则先对数据进行排序
  if (orderBy.value === 'updateAt') {
    // @ts-ignore 从最新到最老
    allAccreditItems.value.sort((a, b) => b[orderBy.value].localeCompare(a[orderBy.value]))
  } else if (orderBy.value === 'entityName') {
    // @ts-ignore 从小到大
    allAccreditItems.value.sort((a, b) => a['tableName'].localeCompare(b['tableName']))
  }

  if (!searchText.value) {
    renderAccreditItems.value.length = 0
    renderAccreditItems.value.push(...allAccreditItems.value)
  } else {
    renderAccreditItems.value = allAccreditItems.value.filter((item) => {
      return (
          item.tableName.indexOf(searchText.value) != -1 || item.tableTitle?.indexOf(searchText.value) != -1
      )
    })
  }

  activeKey.value = activeKey.value.filter(item => item !== 1);
  if (renderAccreditItems.value.length > 0) {
    activeKey.value.push(1);
  }
}

watch(searchText, () => {
  generateRenderItems()
  generateRenderAccreditItems()
})
watch(orderBy, () => {
  generateRenderItems()
  generateRenderAccreditItems()
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
  entityReader.setFields('id,creator,creatorName,updateAt,updaterName,entityName,title,tableComment')
  entityReader.params = []
  entityReader.params.push(new EntityReaderParam('appId', 'eq', appStore.currentApp.id))
  entityApi.queryByEntityReader(entityReader).then(
      (res: any) => {
        allItems.value = res.data
        generateRenderItems()
      }, () => {
        global.$message.error({content: '获取应用的模型数据失败'})
      }
  )
}

const fetchAccreditData = async () => {
  if (!appStore.currentApp.id) {
    return
  }
  try {
    const {data} = await modelApi.queryAppTables({appId: appStore.currentApp.id});
    allAccreditItems.value = data;
  } catch (err) {
    allAccreditItems.value = [];
  } finally {
    generateRenderAccreditItems()
  }
}

const changeTab = (value: any) => {
  orderBy.value = value
}

fetchData()
fetchAccreditData()

/* 模型tab页所需参数 */
const formTabsParams = ref({
  id: '', visible: false, formState: 'edit', formCol: 2, width: '76%', refApp: false,
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
  formTabsParams.value.refApp = false;
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

const aTableFormSaveSuccess = (data: QueryAppTableForm, action: string) => {
  // 刷新模型列表
  fetchAccreditData();
}

const atFormParams = ref({
  id: '', visible: false, formState: 'add', formCol: 1, width: '', title: '',
  parameter: {
    tableId: '', tableName: '', author: true,
    appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode
  }
});

const appTableOpen = (record: QueryAppTableForm) => {
  if (!appStore.currentApp.id) {
    return
  }
  if (['agree'].includes(record.approvalStatus)) {
    formTabsParams.value.id = record.tableId;
    formTabsParams.value.refApp = true;
    formTabsParams.value.visible = true;
  } else {
    atFormParams.value.id = record.id;
    atFormParams.value.formState = ['draft', 'reject'].includes(record.approvalStatus) ? 'edit' : 'view';
    atFormParams.value.visible = true;
    atFormParams.value.parameter.tableName = record.tableName;
  }
}
/**
 * 新增模型，打开模型表单
 * @param ev
 */
const addAppTableForm = (ev?: MouseEvent) => {
  if (!appStore.currentApp.id) {
    return
  }
  atFormParams.value.id = '';
  atFormParams.value.formState = 'add';
  atFormParams.value.visible = true;
}
</script>

<template>
  <div class="gl-model-list">
    <a-tabs :default-active-key="orderBy" size="mini" @change="changeTab">
      <a-tab-pane key="updateAt" title="按时间排序"/>
      <a-tab-pane key="entityName" title="按名称排序"/>
      <template #extra>
        <a-tag color="arcoblue" size="small" style="margin-right: 8px" title="当前应用的模型总数量">
          {{ allItems.length + allAccreditItems.length }}
        </a-tag>
      </template>
    </a-tabs>

    <div style="padding: 4px 10px;">
      <a-input-search v-model="searchText" placeholder="录入中、英文名查询" size="small" style="width: 100%"/>
    </div>

    <a-collapse class="collapse1" :bordered="true" v-model:active-key="activeKey">
      <a-collapse-item class="colapse-list1" :header="`授权模型（${renderAccreditItems.length}）`" :key="1">
        <template #extra>
          <a-space>
            <a-button size="mini" type="text" style="padding: 0 5px;" @click.stop="addAppTableForm">
              <gl-iconfont type="gl-plus-circle"/>
            </a-button>
            <a-button size="mini" type="text" style="padding: 0 5px;" @click.stop="fetchAccreditData">
              <gl-iconfont type="gl-reset"/>
            </a-button>
          </a-space>
        </template>
        <a-list size="small">
          <template v-for="item in renderAccreditItems" :key="item.id">
            <a-list-item style="cursor: pointer;" @click="appTableOpen(item)">
              <a-list-item-meta :title="item.tableName">
                <template #description>
                  <span v-for="option of approvalStatusOptions.filter((option)=> option.value===item.approvalStatus)"
                        :style="option.other">
                    {{ option.label }}
                  </span>
                  {{ `| ${item.tableTitle}` }}
                </template>
              </a-list-item-meta>
              <template #actions>
            <span :title="`${item.updaterName || ''}更新@${item.updateAt}`" class="gl-actions-description">
              {{ utils.timeAgo(item.updateAt || '') }}
            </span>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-collapse-item>
      <a-collapse-item class="colapse-list1" :header="`应用模型（${renderItems.length}）`" :key="2">
        <template #extra>
          <a-space>
            <a-button size="mini" type="text" style="padding: 0 5px;" @click.stop="addTableForm">
              <gl-iconfont type="gl-plus-circle"/>
            </a-button>
            <a-button size="mini" type="text" style="padding: 0 5px;" @click.stop="fetchData">
              <gl-iconfont type="gl-reset"/>
            </a-button>
          </a-space>
        </template>
        <a-list size="small">
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
      </a-collapse-item>
    </a-collapse>
  </div>

  <GlModelTableAppForm v-model:visible="atFormParams.visible"
                       :formCol="atFormParams.formCol"
                       :formState="atFormParams.formState"
                       :modelValue="atFormParams.id"
                       :parameter="atFormParams.parameter"
                       :title="atFormParams.title"
                       :width="atFormParams.width"
                       @saveSuccess="aTableFormSaveSuccess"/>

  <GlModelTableModal v-model:visible="formParams.visible" :formCol="formParams.formCol"
                     :formState="formParams.formState" :modelValue="formParams.id"
                     :parameter="formParams.parameter" :width="formParams.width"
                     @saveSuccess="tableFormSaveSuccess"/>

  <GlModelTableTabs v-model:visible="formTabsParams.visible" :formState="formTabsParams.formState"
                    :modelValue="formTabsParams.id" :parameter="formTabsParams.parameter"
                    :width="formTabsParams.width" :refApp="formTabsParams.refApp"
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

.colapse-list1 .arco-collapse-item-content {
  padding-left: 4px;
  padding-right: 0px;
  background-color: var(--color-bg-5);
}
</style>
