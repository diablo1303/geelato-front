<template>
  <a-select @change="onEntityChange" v-model="mv.entityName" allow-search>
    <a-option v-for="item in entityLiteMetas" :value="item.entityName">{{ item.entityTitle }}</a-option>
  </a-select>
</template>
<script lang="ts">
export default {
  name: 'GlAppEntitySelect'
}

export class AppEntitySelectResult {
  appCode: string = ''
  entityName: string = ''
}
</script>

<script lang="ts" setup>
import {inject, type PropType, ref, watch} from 'vue'
import {useEntityStore} from "@geelato/gl-ide";
import {EntityMeta, type EntityLiteMeta} from "@geelato/gl-ui";
import ComponentSetterProvideProxy, {ComponentSetterProvideKey} from "../ComponentSetterProvideProxy";

const props = defineProps({
  modelValue: {
    type: Object as PropType<AppEntitySelectResult>,
    default() {
      return new AppEntitySelectResult()
    }
  },
  /**
   *  将选择加载的完整实体源数据信息设置到ComponentSetterProvideProxy的正下文环境变量中
   */
  exposeVarEntityMeta: {
    type: String,
    default() {
      return 'entityMate'
    }
  }
})
const emits = defineEmits(['update:modelValue'])
const entityStore = useEntityStore()
const entityLiteMetas = ref(new Array<EntityLiteMeta>)
// const ds = inject('$entityDS')
// if (!ds) {
//   console.error('未注入实体数据源：$entityDS，请检查是否已从服务端加载数据源。')
// }
const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!
const res = entityStore.loadEntityLiteMetas('')
res.then((data: Array<EntityLiteMeta>) => {
  entityLiteMetas.value = data
})

const ds = ref({entityMeta: new EntityMeta()})
const mv = ref(props.modelValue)
watch(mv, (val) => {
  emits('update:modelValue', val)
}, {deep: true})

const setEntityAndLoadFieldMetas = (entityName: string) => {
  console.log('setEntityAndLoadFieldMetas by entity:', entityName)
  entityStore.loadFieldMetas('', entityName)
}
const onEntityChange = (entityName: string) => {
  console.log('onEntityChange', entityName, entityLiteMetas)
  let entityLiteMeta = {entityTitle: ''}
  for (let i in entityLiteMetas.value) {
    // @ts-ignore
    if (entityLiteMetas.value[i].entityName === entityName) {
      // @ts-ignore
      entityLiteMeta = entityLiteMetas.value[i]
    }
  }
  entityStore.loadFieldMetas('', entityName).then((fieldMetas) => {
    console.log('fieldMetas', fieldMetas)
    // @ts-ignore
    ds.value.entityMeta = {
      entityName: entityName,
      entityTitle: entityLiteMeta.entityTitle,
      fieldMetas
    }
    // @ts-ignore
    // ds.value.fieldMetas = fieldMetas
    // console.log('inject ds:', ds)
    // componentSetterProvideProxy.setEntityDsRef(ds)
    componentSetterProvideProxy.setVarValue(props.exposeVarEntityMeta, ds.value.entityMeta)

  })
}

// 初始化，加载实体列表及相应的实体元数据
if (props.modelValue && props.modelValue.entityName) {
  onEntityChange(props.modelValue.entityName)
}
</script>

<style scoped>

</style>
