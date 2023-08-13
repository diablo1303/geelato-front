<template>
  <a-select @change="onEntityChange" v-model="mv" allow-search allow-clear>
    <a-option v-for="item in entityLiteMetas" :value="item.entityName" :title="item.entityName" :class="{'gl-selected':mv===item.entityName}">
      {{ item.entityTitle + ' ' + item.entityName }}
    </a-option>
  </a-select>
</template>
<script lang="ts">
export default {
  name: 'GlEntitySelect'
}
</script>
<script lang="ts" setup>
import {inject, ref, watch} from 'vue'
import {useEntityStore} from "@geelato/gl-ide";
import {type EntityLiteMeta, EntityMeta} from "@geelato/gl-ui";
import ComponentSetterProvideProxy, {ComponentSetterProvideKey} from "../ComponentSetterProvideProxy";

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
  }
})
const emits = defineEmits(['update:modelValue'])
const entityStore = useEntityStore()
const entityLiteMetas = ref(new Array<EntityLiteMeta>)

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!
const res = entityStore.loadEntityLiteMetas('')
res.then((data: Array<EntityLiteMeta>) => {
  entityLiteMetas.value = data
})
const ds = ref({entityMeta: new EntityMeta()})
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
  // console.log('onEntityChange', entityName, entityLiteMetas)
  let entityLiteMeta = {entityTitle: ''}
  for (let i in entityLiteMetas.value) {
    // @ts-ignore
    if (entityLiteMetas.value[i].entityName === entityName) {
      // @ts-ignore
      entityLiteMeta = entityLiteMetas.value[i]
    }
  }
  entityStore.loadFieldMetas('', entityName).then((fieldMetas) => {
    ds.value.entityMeta = {
      entityName: entityName,
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
</script>

<style scoped>

</style>
