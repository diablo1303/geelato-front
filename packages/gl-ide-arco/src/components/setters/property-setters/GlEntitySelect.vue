<template>
  <div class="gl-entity-select">
    <a-select v-model="mv" allow-clear allow-search style="width: 240px" @change="onEntityChange">
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
  <GlModelTableTabs v-model:visible="formTabsParams.visible"
                    :formState="formTabsParams.formState"
                    :modelValue="formTabsParams.id"
                    :parameter="formTabsParams.parameter"
                    :refApp="formTabsParams.refApp"
                    :width="formTabsParams.width"/>
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


const fetchData = (entityName: string, successBack?: any, failBack?: any) => {
  if (!appStore.currentApp.id) {
    return
  }
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_dev_table'
  entityReader.setFields('id,creator,creatorName,updateAt,updaterName,entityName,title,tableComment')
  entityReader.params = []
  // entityReader.params.push(new EntityReaderParam('appId', 'eq', appStore.currentApp.id))
  entityReader.params.push(new EntityReaderParam('entityName', 'eq', entityName))
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

const formTabsParams = ref({
  id: '', visible: false, formState: 'view', formCol: 2, width: '76%', refApp: false,
  parameter: {appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode}
});
const openEntity = () => {
  if (!mv.value) return
  if (!appStore.currentApp.id) return
  let entityLiteMeta = entityLiteMetas.value.find((item) => item.entityName === mv.value)
  console.log('openEntity entityLiteMeta', entityLiteMeta)
  fetchData(mv.value, (data: Record<string, any>) => {
    formTabsParams.value.id = data.id;
    formTabsParams.value.refApp = false;
    formTabsParams.value.visible = true;
  });
}
</script>

<style>
.gl-entity-select {
  display: flex;
}
</style>
