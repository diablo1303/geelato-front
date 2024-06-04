<template>
  <div class="gl-entity-field-select">
    <a-select
      size="small"
      v-model="mv.entityName"
      @change="onEntityChange"
      allow-search
      allow-clear
      :class="{ 'gl-error': !mv.entityName }"
      placeholder="选择实体"
    >
      <template #prefix>
        <span
          title="点击复制"
          @click="copyEntity"
          style="cursor: pointer"
          ><gl-iconfont type="gl-copy" text="实体"
        /></span>
      </template>
      <a-option
        v-for="item in entityLiteMetas"
        :value="item.entityName"
        :title="item.entityName + ' ' + item.entityTitle"
        :class="{ 'gl-selected': mv.entityName === item.entityName }"
      >
        {{ item.entityTitle + ' ' + item.entityName }}
      </a-option>
    </a-select>
    <a-select
      size="small"
      v-model="mv.fieldName"
      @change="onFieldChange"
      allow-search
      allow-clear
      :class="{ 'gl-error': !mv.fieldName }"
      placeholder="选择字段"
    >
      <template #prefix>
        <span title="点击复制" @click="copyField" style="cursor: pointer"
          ><gl-iconfont type="gl-copy" text="字段"
        /></span>
      </template>
      <a-option
        v-for="item in entityFieldMetas"
        :value="item.name"
        :title="item.name + ' ' + item.title"
        :class="{ 'gl-selected': mv.fieldName === item.name }"
      >
        <span style="overflow: hidden"> {{ item.title + ' ' + item.name }}</span>
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
</script>
<script lang="ts" setup>
// @ts-nocheck
/**
 *  基于当前实体选择、字段选择
 */
import { type PropType, type Ref, ref, watch } from 'vue'
import { type FieldMeta, type EntityLiteMeta, useGlobal } from '@geelato/gl-ui'
import { useEntityStore } from '@geelato/gl-ide'
import { BindField } from '@geelato/gl-ui-schema'
import ClipboardJS from 'clipboard'

const global = useGlobal()
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object as PropType<BindField>,
    default() {
      return new BindField()
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
const entityLiteMetas: Ref<EntityLiteMeta[]> = ref([])
const entityFieldMetas: Ref<FieldMeta[]> = ref([])

const res = entityStore.loadEntityLiteMetas('')
res.then((data: Array<EntityLiteMeta>) => {
  entityLiteMetas.value = data
})

/**
 *  从浏览器存储中获取，若无则创建一个
 */
const getLastEntityFieldSelectResult = () => {
  // 缓存结果
  let lastEntityFieldSelectResultStr = localStorage.getItem('lastEntityFieldSelectResult')
  // console.log('lastEntityFieldSelectResultStr', lastEntityFieldSelectResultStr)
  let lastEntityFieldSelectResult
  if (lastEntityFieldSelectResultStr) {
    lastEntityFieldSelectResult = JSON.parse(lastEntityFieldSelectResultStr)
  } else {
    lastEntityFieldSelectResult = new BindField()
  }
  return lastEntityFieldSelectResult
}
/**
 *  保存到浏览器存储中
 */
const saveLastEntityFieldSelectResult = (lastEntityFieldSelectResult: BindField) => {
  localStorage.setItem('lastEntityFieldSelectResult', JSON.stringify(lastEntityFieldSelectResult))
}

const setEntityAndLoadFieldMetas = (entityName: string) => {
  // console.log('setEntityAndLoadFieldMetas by entity:', entityName)
  entityStore.loadFieldMetas('', entityName).then((fieldMetas) => {
    // console.log('onEntityChange loadFieldMetas', fieldMetas)
    entityFieldMetas.value = fieldMetas
  })
}

const onEntityChange = (entityName: string) => {
  // console.log('onEntityChange', entityName, entityLiteMetas)
  let entityLiteMeta = { entityTitle: '' }
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
const mv = ref(props.modelValue)

// 检查当前字段选择器是否已配置了实体，若无，则尝试从浏览器存储中获取实体信息
if (!props.modelValue.entityName) {
  let lastEntityFieldSelectResult = getLastEntityFieldSelectResult()
  if (lastEntityFieldSelectResult.entityName) {
    onEntityChange(lastEntityFieldSelectResult.entityName)
  }
} else {
  setEntityAndLoadFieldMetas(props.modelValue.entityName)
}

watch(
  mv,
  (val) => {
    console.log('mv', val)
    emits('update:modelValue', val)
  },
  { deep: true }
)

const copyEntity = ($event: any) => {
  $event.stopPropagation();
  $event.preventDefault();
  if(mv.value?.entityName){
    ClipboardJS.copy(mv.value.entityName)
    global.$message.success('复制成功：' + mv.value.entityName)
  }else{
    global.$message.error('复制失败，实体为空')
  }
}

const copyField = ($event: any) => {
  $event.stopPropagation();
  $event.preventDefault();
  if(mv.value?.fieldName){
    ClipboardJS.copy(mv.value.fieldName)
    global.$message.success('复制成功：' + mv.value.fieldName)
  }else{
    global.$message.error('复制失败，字段为空')
  }
}

const onFieldChange = () => {}
</script>

<style>
.gl-entity-field-select .gl-error {
  background-color: rgba(236, 100, 100, 0.3);
}
</style>
