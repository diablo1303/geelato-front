<template>
  <div>
    <a-select size="small" v-model="mv.entityName" @change="onEntityChange" allow-search placeholder="选择实体">
      <template #prefix>实体</template>
      <a-option v-for="item in entityLiteMetas" :value="item.entityName" :title="item.entityName+' '+item.entityTitle"
                :class="{'gl-selected':mv.entityName===item.entityName}">
        {{ item.entityTitle + ' ' + item.entityName }}
      </a-option>
    </a-select>
    <a-select size="small" v-model="mv.fieldName" @change="onFieldChange" allow-search placeholder="选择字段">
      <template #prefix>字段</template>
      <a-option v-for="item in entityFieldMetas" :value="item.name" :title="item.name+' '+item.title"
                :class="{'gl-selected':mv.fieldName===item.name}">
        {{ item.title + ' ' + item.name }}
      </a-option>
    </a-select>
  </div>
</template>

<script lang="ts">
/**
 *  选择实体及字段，构建实体字段对象信息
 */
export default {
  name: 'GlEntityFieldSelect'
}

export class EntityFieldSelectResult {
  appCode: string = ''
  fieldName: string = ''
  entityName: string = ''
}
</script>
<script lang="ts" setup>
/**
 *  基于当前实体选择、字段选择
 */
import {type PropType, ref, watch} from 'vue'
import type {FieldMeta, EntityLiteMeta} from "@geelato/gl-ui";
import {useEntityStore} from "@geelato/gl-ide";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object as PropType<EntityFieldSelectResult>,
    default() {
      return new EntityFieldSelectResult()
    }
  },
  bindFieldCount: {
    type: Number,
    default() {
      return 1
    }
  }
})
// 实体信息
const entityStore = useEntityStore()
const entityLiteMetas = ref(new Array<EntityLiteMeta>)
const entityFieldMetas = ref(new Array<FieldMeta>())

const res = entityStore.loadEntityLiteMetas('')
res.then((data: Array<EntityLiteMeta>) => {
  entityLiteMetas.value = data
})

/**
 *  从浏览器存储中获取，若无则创建一个
 */
const getLastEntityFieldSelectResult = () => {
  // 缓存结果
  let lastEntityFieldSelectResultStr = localStorage.getItem('lastEntityFieldSelectResult');
  console.log('lastEntityFieldSelectResultStr', lastEntityFieldSelectResultStr)
  let lastEntityFieldSelectResult;
  if (lastEntityFieldSelectResultStr) {
    lastEntityFieldSelectResult = JSON.parse(lastEntityFieldSelectResultStr)
  } else {
    lastEntityFieldSelectResult = new EntityFieldSelectResult()
  }
  return lastEntityFieldSelectResult
}
/**
 *  保存到浏览器存储中
 */
const saveLastEntityFieldSelectResult = (lastEntityFieldSelectResult: EntityFieldSelectResult) => {
  localStorage.setItem('lastEntityFieldSelectResult', JSON.stringify(lastEntityFieldSelectResult));
}

const setEntityAndLoadFieldMetas = (entityName: string) => {
  console.log('setEntityAndLoadFieldMetas by entity:', entityName)
  entityStore.loadFieldMetas('', entityName).then((fieldMetas) => {
    console.log('onEntityChange loadFieldMetas', fieldMetas)
    entityFieldMetas.value = fieldMetas
  })
}

const onEntityChange = (entityName: string) => {
  console.log('onEntityChange', entityName, entityLiteMetas)
  let entityLiteMeta = {entityTitle: ''}
  for (let i in entityLiteMetas.value) {
    if (entityLiteMetas.value[i].entityName === entityName) {
      entityLiteMeta = entityLiteMetas.value[i]
    }
  }
  // 加载字段元数据
  setEntityAndLoadFieldMetas(entityName)
  let lastEntityFieldSelectResult = getLastEntityFieldSelectResult()
  lastEntityFieldSelectResult.entityName = entityName
  mv.value.entityName = entityName
  saveLastEntityFieldSelectResult(lastEntityFieldSelectResult)
}


// 字段信息
const mv = ref(new EntityFieldSelectResult())
mv.value = props.modelValue

// 检查当前字段选择器是否已配置了实体，若无，则尝试从浏览器存储中获取实体信息
if (!props.modelValue.entityName) {
  let lastEntityFieldSelectResult = getLastEntityFieldSelectResult()
  if (lastEntityFieldSelectResult.entityName) {
    onEntityChange(lastEntityFieldSelectResult.entityName)
  }
} else {
  setEntityAndLoadFieldMetas(props.modelValue.entityName)
}

watch(mv, (val) => {
  console.log('mv', val)
  emits('update:modelValue', val)
}, {deep: true})

const onFieldChange = () => {
}
</script>

<style scoped>

</style>
