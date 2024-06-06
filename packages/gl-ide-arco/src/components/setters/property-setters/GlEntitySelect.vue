<template>
  <div class="gl-entity-select">
    <a-select @change="onEntityChange" v-model="mv" allow-search allow-clear>
      <a-option
        v-for="item in entityLiteMetas"
        :value="item.entityName"
        :title="item.entityName"
        :class="{ 'gl-selected': mv === item.entityName }"
      >
        {{ item.entityTitle + ' ' + item.entityName }}
      </a-option>
    </a-select>
    <a-button v-if="allowOpen" size="small" type="primary" @click="openEntity" style="padding: 0 4px">打开</a-button>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlEntitySelect'
}
</script>
<script lang="ts" setup>
// @ts-nocheck
import { inject, type Ref, ref, watch } from 'vue'
import { useEntityStore } from '@geelato/gl-ide'
import { type EntityLiteMeta, EntityMeta } from '@geelato/gl-ui'
import { ComponentSetterProvideKey, ComponentSetterProvideProxy } from '@geelato/gl-ide'

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
const entityStore = useEntityStore()
const entityLiteMetas: Ref<EntityLiteMeta[]> = ref([])

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!
const res = entityStore.loadEntityLiteMetas('')
res.then((data: Array<EntityLiteMeta>) => {
  entityLiteMetas.value = data
})
const ds = ref({ entityMeta: new EntityMeta() })
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
  let entityLiteMeta = entityLiteMetas.value.find((item) => item.entityName === entityName) || {entityName,entityTitle:'',entityType:''}
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

const openEntity = () => {
  if(!mv.value) return
  let entityLiteMeta = entityLiteMetas.value.find((item) => item.entityName === mv.value)
  // entityLiteMeta 示例1：{entityName: 'v_il_payment_info', entityTitle: '付款通知单视图', entityType: 'View'}
  // entityLiteMeta 示例2：{entityName: 'il_cooperating_org', entityTitle: '合作单位', entityType: 'Table'}
  console.log('openEntity entityLiteMeta',entityLiteMeta)
}
</script>

<style>
.gl-entity-select {
  display: flex;
}
</style>
