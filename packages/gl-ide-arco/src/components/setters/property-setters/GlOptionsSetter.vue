<template>
  <GlOptions v-if="cols" v-model="mv" :columns="cols" :key="key">
    <template #actions>
      <a-switch :key="key"  :default-checked="isValueNumberType" size="medium" @change="onchangeType">
        <template #checked> 值为数字类型</template>
        <template #unchecked> 值为字符类型</template>
      </a-switch>
    </template>
  </GlOptions>
</template>
<script lang="ts">
export default {
  name: 'GlOptionsSetter'
}
</script>
<script lang="ts" setup>
import { type PropType, ref, watch } from 'vue'
import GlOptions from '../GlOptions.vue'
import type { ColumnType } from '../Types'
import { utils } from '@geelato/gl-ui'

const props = defineProps({
  modelValue: {
    type: Array,
    default() {
      return []
    }
  },
  columns: {
    type: Array as PropType<Array<ColumnType>>,
    default() {
      return [
        { dataIndex: 'label', title: '名' },
        { dataIndex: 'value', title: '值' }
      ]
    }
  }
})
const emits = defineEmits(['update:modelValue'])
const mv = ref(props.modelValue)
watch(
  mv,
  (val: any) => {
    console.log('emits',val)
    emits('update:modelValue', val)
  },
  { deep: true }
)

const cols = ref(props.columns)
const isValueNumberType = ref(true)
const onchangeType = () => {
  isValueNumberType.value = !isValueNumberType.value
}
// 检查当前已配置的数据，看是什么类型，进行数据类型初始化
if (mv.value.length > 0) {
  const vItem = mv.value[0]
  const valueFiledName = cols.value[1].dataIndex
  // @ts-ignore
  isValueNumberType.value = typeof vItem[valueFiledName] === 'number'
}
// 用于刷新GlOptions组件，在值类型变化时变化
const key = ref(utils.gid('id'))
/**
 *  值类型变化时
 *  更改每列的类型定义，并更换mv中的值类型
 */
watch(
  isValueNumberType,
  () => {
    key.value = utils.gid('id')
    if (isValueNumberType.value) {
      cols.value = [
        { dataIndex: 'label', title: '名' },
        { dataIndex: 'value', title: '值', type: 'AInputNumber' }
      ]
      mv.value.forEach((vItem: any) => {
        const valueFiledName = cols.value[1].dataIndex
        // @ts-ignore
        if (typeof vItem[valueFiledName] === 'string') {
          try {
            // @ts-ignore
            vItem[valueFiledName] = Number.parseInt(vItem[valueFiledName])
          } catch (e) {
            // @ts-ignore
            vItem[valueFiledName] = undefined
          }
        }
      })
    } else {
      cols.value = [
        { dataIndex: 'label', title: '名' },
        { dataIndex: 'value', title: '值' }
      ]
      mv.value.forEach((vItem: any) => {
        const valueFiledName = cols.value[1].dataIndex
        // @ts-ignore
        if (typeof vItem[valueFiledName] === 'number') {
          try {
            // @ts-ignore
            vItem[valueFiledName] = vItem[valueFiledName] + ''
          } catch (e) {
            // @ts-ignore
            vItem[valueFiledName] = undefined
          }
        }
      })
    }
  },
  { immediate: true }
)
</script>
