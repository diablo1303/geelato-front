<template>
  <div>
    <a-select @change="onEntityChange" v-model="mv">
      <a-option v-for="item in entityLiteMetas" :value="item.entityName">{{ item.entityTitle }}</a-option>
    </a-select>
  </div>
</template>

<script lang="ts" setup>
import {inject, ref, watch} from 'vue'
import {useEntityStore} from "@geelato/gl-ide";
import type {EntityLiteMeta, EntityMeta} from "@geelato/gl-ui";

const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const emits = defineEmits(['update:modelValue'])
const entityStore = useEntityStore()
const entityLiteMetas= ref(new Array<EntityLiteMeta>)
const ds = inject('$entityDS')
const res = entityStore.loadEntityLiteMetas('')
res.then((data:Array<EntityLiteMeta>)=>{
  entityLiteMetas.value = data
})

const mv = ref('')
mv.value = props.modelValue
watch(mv, (val) => {
  emits('update:modelValue', val)
})

const setEntityAndLoadFieldMetas = (entityName: string) => {
  console.log('setEntityAndLoadFieldMetas by entity:', entityName)
  entityStore.loadFieldMetas('', entityName)
}
const onEntityChange = (entityName: string) => {
  console.log('onEntityChange', entityName,entityLiteMetas)
  let entityLiteMeta = {entityTitle:''}
  for(let i in entityLiteMetas.value){
    // @ts-ignore
    if(entityLiteMetas.value[i].entityName===entityName){
      // @ts-ignore
      entityLiteMeta = entityLiteMetas.value[i]
    }
  }
  entityStore.loadFieldMetas('', entityName).then((fieldMetas)=>{
    console.log('fieldMetas',fieldMetas)
    // @ts-ignore
    ds.value.entityMeta = {entityName:entityName,

      entityTitle:entityLiteMeta.entityTitle,
      fieldMetas
    }
    // @ts-ignore
    ds.value.fieldMetas = fieldMetas
    console.log('inject ds:',ds)
  })
}

// 初始化，加载实体列表及相应的实体元数据
if(props.modelValue){
  onEntityChange(props.modelValue)
}
</script>

<style scoped>

</style>
