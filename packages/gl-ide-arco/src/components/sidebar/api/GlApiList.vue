<script lang="ts">
/**
 *  服务列表
 */
export default {
  name: 'GlApiList'
}
</script>
<script lang="ts" setup>
import {type Ref, ref, watch} from 'vue'
import {entityApi, EntityReader, EntityReaderParam, interApi, useGlobal, utils} from '@geelato/gl-ui'
import {useAppStore} from '@geelato/gl-ide'
import GlApiModal from "./GlApiModal.vue";
import ApiForm from "./ApiForm.vue";
import ApiList from "./ApiList.vue";

const props = defineProps({
  recordId: String
})
const global = useGlobal()
const appStore = useAppStore()
const allItems: Ref<Item[]> = ref([])
const renderItems: Ref<Item[]> = ref([])
const groupNames = ref<String[]>([])
const existNull = ref<boolean>(false)
const activeKey = ref<number[]>([]);
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
  setActiveKey()
})

watch(orderBy, () => {
  generateRenderItems()
  setActiveKey()
})

type Item = {
  id: string
  name: string
  code: string
  remark?: string
  groupName: string
  creator: string
  updateAt: string
  updaterName: string
  creatorName: string
  enableStatus: boolean
}

const setGroupNames = () => {
  groupNames.value = [];
  if (allItems.value.length > 0) {
    for (const item of allItems.value) {
      if (!item.groupName) {
        existNull.value = true;
      } else if (!groupNames.value.includes(item.groupName)) {
        groupNames.value.push(item.groupName);
      }
    }
  }
}

const setActiveKey = () => {
  // 初始化activeKey
  activeKey.value = []
  if (groupNames.value.length > 0) {
    for (let i = 0; i < groupNames.value.length; i += 1) {
      const names = renderItems.value.filter(item => item.groupName === groupNames.value[i]);
      if (names && names.length > 0) activeKey.value.push(i + 1);
    }
    if (existNull.value) {
      const names = renderItems.value.filter(item => !groupNames.value.includes(item.groupName));
      if (names && names.length > 0) activeKey.value.push(groupNames.value.length + 1);
    }
  }
}

/**
 * 加载记录
 */
const fetchData = (successBack?: any) => {
  if (!appStore.currentApp.id) {
    return
  }
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_api'
  entityReader.setFields('id,creator,creatorName,updateAt,updaterName,name,code,enableStatus,remark,groupName')
  entityReader.params = []
  entityReader.params.push(new EntityReaderParam('appId', 'eq', appStore.currentApp.id))

  entityApi.queryByEntityReader(entityReader).then(
      (res: any) => {
        allItems.value = res.data
        setGroupNames()
        generateRenderItems()
        setActiveKey()
        if (successBack && typeof successBack === 'function') successBack();
      },
      () => {
        global.$message.error({content: '获取应用的接口数据失败'})
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
const currentApi = ref<Item>()
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

const formParams = ref({
  id: '', visible: false, formState: 'add', formCol: 2, width: '76%', title: '',
  parameter: {appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode}
});
/**
 * 点击打开tab页面
 * @param id
 */
const addApiForm = () => {
  if (!appStore.currentApp.id) {
    return
  }
  Object.assign(formParams.value, {
    id: '', visible: true, formState: 'add'
  });
}
const editApiModel = (item: Item) => {
  Object.assign(formParams.value, {
    id: item.id, visible: true, formState: 'edit'
  });
}

const deleteApiModel = async (item: Item) => {
  try {
    await interApi.deleteApi(item.id);
    global.$message.success({content: '删除成功'});
  } catch (e) {
    global.$message.error({content: '删除失败'});
  } finally {
    fetchData();
  }
}

const resetApiData = () => {
  fetchData(() => {
    global.$message.success({content: '刷新成功'});
  });
}

fetchData()
</script>

<template>
  <div class="gl-api-list">
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
      <a-tooltip content="添加接口" position="top">
        <a-button size="small" type="primary" style="padding: 0 7px;" @click="addApiForm">
          <gl-iconfont type="gl-plus-circle"/>
        </a-button>
      </a-tooltip>
      <a-tooltip content="刷新" position="top">
        <a-button size="small" type="outline" style="padding: 0 7px;" @click="resetApiData">
          <gl-iconfont type="gl-reset"/>
        </a-button>
      </a-tooltip>
      <a-input-search v-model="searchText" size="small" placeholder="录入中、英文名查询" style="width: 100%"/>
    </a-space>

    <a-collapse v-if="groupNames.length > 0" v-model:active-key="activeKey" :bordered="true" class="collapse1">
      <a-collapse-item v-for="(name,n) in groupNames" :key="n+1" class="colapse-list1">
        <template #header>
          {{ `${name}（${(renderItems.filter(it => it.groupName === name)).length}）` }}
        </template>
        <ApiList :model-value="renderItems.filter(it => it.groupName === name)"
                 @openModal="openModal" @editApiModel="editApiModel" @deleteApiModel="deleteApiModel"/>
      </a-collapse-item>
      <a-collapse-item v-if="existNull" :key="groupNames.length+1" class="colapse-list1">
        <template #header>
          {{ `其他（无分组）（${(renderItems.filter(it => !groupNames.includes(it.groupName))).length}）` }}
        </template>
        <ApiList :model-value="renderItems.filter(it => !groupNames.includes(it.groupName))"
                 @openModal="openModal" @editApiModel="editApiModel" @deleteApiModel="deleteApiModel"/>
      </a-collapse-item>
    </a-collapse>
    <ApiList v-else :model-value="renderItems"
             @openModal="openModal" @editApiModel="editApiModel" @deleteApiModel="deleteApiModel"/>

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
        <GlIconfont type="gl-api" style="margin-right: 4px"/>
        <span>{{ `接口编排-${currentApi?.name}` }}</span>
      </template>
      <GlApiModal :key="currentApiId" ref="apiModal" :apiId="currentApiId"/>
    </a-modal>

    <ApiForm v-model:visible="formParams.visible"
             :model-value="formParams.id"
             :form-state="formParams.formState"
             :form-col="formParams.formCol"
             :parameter="formParams.parameter"
             :title="formParams.id ? '编辑接口' : '新增接口'"
             :width="formParams.width"
             @saveSuccess="fetchData"/>
  </div>
</template>
<style>
.gl-api-list .gl-has {
  color: #165dff;
}

.gl-api-list .arco-list-item {
  padding: 1px 14px !important;
}

.gl-api-list .arco-list-item-extra {
  display: flex;
  align-items: center;
}

.gl-api-list .arco-list-item-action {
  margin-top: 0 !important;
}

.gl-api-list .arco-list-item-meta-title {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
}

.gl-api-list .arco-collapse-item-header-title {
  font-weight: bold !important;
}

.gl-api-list .arco-list-item-meta-description {
  font-size: 11px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-wrap: break-word;
}

.gl-api-list .gl-actions-description {
  font-size: 11px;
}
</style>
