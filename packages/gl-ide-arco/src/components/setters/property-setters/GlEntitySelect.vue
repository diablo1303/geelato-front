<template>
  <div class="gl-entity-select">
    <a-select v-model="mv" allow-clear allow-search  @change="onEntityChange">
      <a-option
          v-for="(item,index) in entityLiteMetas"
          :key="index"
          :class="{ 'gl-selected': mv === item.entityName }"
          :title="item.entityName"
          :value="item.entityName">
        {{ item.entityTitle + ' ' + item.entityName }}
      </a-option>
    </a-select>
    <a-button v-if="allowOpen" size="small" style="padding: 0 4px" type="primary" @click="openEntity">打开</a-button>
  </div>
  <GlModelTableTabs v-model:visible="tableTabsParams.visible"
                    :formState="tableTabsParams.formState"
                    :modelValue="tableTabsParams.id"
                    :parameter="tableTabsParams.parameter"
                    :refApp="tableTabsParams.refApp"
                    :width="tableTabsParams.width"/>
  <GlModelTableViewForm v-model:visible="viewTabsParams.visible"
                        :formCol="viewTabsParams.formCol"
                        :formState="viewTabsParams.formState"
                        :modelValue="viewTabsParams.id"
                        :parameter="viewTabsParams.parameter"
                        :title="viewTabsParams.title"
                        :width="viewTabsParams.width"
                        :isPermission="viewTabsParams.formState==='add'?false:true"
                        :isApproval="viewTabsParams.formState==='add'?false:true"/>
</template>
<script lang="ts">
export default {
  name: 'GlEntitySelect'
}
</script>
<script lang="ts" setup>
// @ts-nocheck
import {inject, type Ref, ref, watch} from 'vue'
import {useAppStore, useEntityStore} from '@geelato/gl-ide'
import {entityApi, type EntityLiteMeta, EntityMeta, EntityReader, EntityReaderParam, modelApi, useGlobal} from '@geelato/gl-ui'
import {ComponentSetterProvideKey, ComponentSetterProvideProxy} from '@geelato/gl-ide'
import GlModelTableTabs from "../../sidebar/model/table/tableTabs.vue";
import GlModelTableViewForm from "../../sidebar/model/view/form.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  将选择加载的完整实体源数据信息设置到ComponentSetterProvideProxy的上下文环境变量中
   */
  exposeVarEntityMeta: {
    type: String,
    default() {
      return 'entityMeta'
    }
  },
  /**
   * 允许打开模型页面
   */
  allowOpen: {
    type: Boolean,
    default() {
      return true
    }
  }
})
const emits = defineEmits(['update:modelValue'])
const global = useGlobal()
const appStore = useAppStore()
const entityStore = useEntityStore()
const entityLiteMetas: Ref<EntityLiteMeta[]> = ref([])

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!
const res = entityStore.loadEntityLiteMetas('')
res.then((data: Array<EntityLiteMeta>) => {
  entityLiteMetas.value = data
})
const ds = ref({entityMeta: new EntityMeta()})
// 模型或视图英文名
const mv = ref('')
mv.value = props.modelValue
watch(mv, (val) => {
  emits('update:modelValue', val)
})

const setEntityAndLoadFieldMetas = (entityName: string) => {
  // console.log('setEntityAndLoadFieldMetas by entity:', entityName)
  entityStore.loadFieldMetas('', entityName)
}
const onEntityChange = (entityName: string) => {
  let entityLiteMeta = entityLiteMetas.value.find((item) => item.entityName === entityName) || {entityName, entityTitle: '', entityType: ''}
  entityStore.loadFieldMetas('', entityName).then((fieldMetas) => {
    ds.value.entityMeta = {
      entityName: entityName,
      entityType: entityLiteMeta.entityType,
      entityTitle: entityLiteMeta.entityTitle,
      fieldMetas
    }
    // @ts-ignore
    // ds.value.fieldMetas = fieldMetas
    componentSetterProvideProxy.setEntityDsRef(ds)
    componentSetterProvideProxy.setVarValue(props.exposeVarEntityMeta, ds.value.entityMeta)
  })
}

// 初始化，加载实体列表及相应的实体元数据
if (props.modelValue) {
  onEntityChange(props.modelValue)
}


const fetchData = (entityName: string, type: string, successBack?: any, failBack?: any) => {
  if (!appStore.currentApp.id || !entityName || !type) {
    return
  }
  const entityReader = new EntityReader()
  entityReader.params = []
  if (['View'].includes(type)) {
    entityReader.entity = 'platform_dev_view'
    entityReader.setFields('id,title,viewName,viewType,description,entityName,connectId,appId,tenantCode')
    entityReader.params.push(new EntityReaderParam('viewName', 'eq', entityName))
  } else if (['Class', 'Table'].includes(type)) {
    entityReader.entity = 'platform_dev_table'
    entityReader.setFields('id,title,entityName,tableComment,description,tableType,synced,sourceType,packBusData,connectId,appId,tenantCode')
    entityReader.params.push(new EntityReaderParam('entityName', 'eq', entityName))
  }
  entityApi.queryByEntityReader(entityReader).then(
      async (res: any) => {
        if (res.data && res.data.length > 0) {
          if (successBack && typeof successBack === 'function') successBack(res.data[0]);
        } else {
          global.$message.error({content: '数据源不存在'})
        }
      }, () => {
        global.$message.error({content: '数据源查询失败'})
      }
  )
}

const tableTabsParams = ref({
  id: '', visible: false, formState: 'edit', formCol: 2, width: '76%', refApp: false,
  parameter: {appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode}
});
const viewTabsParams = ref({
  id: '', visible: false, formState: 'edit', formCol: 2, title: '', width: '76%',
  parameter: {
    connectId: '', entityName: '',
    appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode
  },
});
const openEntity = () => {
  if (!mv.value) return
  if (!appStore.currentApp.id) return
  const entityLiteMeta = entityLiteMetas.value.find((item) => item.entityName === mv.value)
  console.log('openEntity entityLiteMeta', entityLiteMeta)
  if (!entityLiteMeta) return
  fetchData(mv.value, entityLiteMeta.entityType, (data: Record<string, any>) => {
    if (['View'].includes(entityLiteMeta.entityType)) {
      Object.assign(viewTabsParams.value, {
        id: data.id, visible: true, title: `编辑模型视图（${data.viewName}）`, parameter: {
          connectId: data.connectId, entityName: data.entityName,
          appId: data.appId || appStore.currentApp.id,
          tenantCode: data.tenantCode || appStore.currentApp.tenantCode
        }
      });
    } else if (['Class', 'Table'].includes(entityLiteMeta.entityType)) {
      Object.assign(tableTabsParams.value, {
        id: data.id, visible: true, parameter: {
          appId: data.appId || appStore.currentApp.id,
          tenantCode: data.tenantCode || appStore.currentApp.tenantCode
        }
      });
    }
  });
}
</script>

<style>
.gl-entity-select {
  display: flex;
}
</style>
