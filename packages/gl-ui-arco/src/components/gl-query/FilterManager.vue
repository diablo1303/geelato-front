<script lang="ts">
export default {
  name: 'FilterManager'
}
</script>
<script lang="ts" setup>
import { type PropType, ref, watch } from 'vue'
import type { FilterType } from '../gl-entity-table-plus/types'
import type { QueryItemKv } from './query'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<FilterType>>,
    default() {
      return []
    }
  },
  queryItemsKvs: Object as PropType<Array<QueryItemKv>>
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    slotName: 'name'
  },
  {
    title: '展示到工作栏',
    dataIndex: 'showOnToolbar',
    slotName: 'showOnToolbar'
  },
  {
    title: '操作',
    dataIndex: 'opt',
    slotName: 'opt'
  }
]

const data = ref(mv.value)

const remove = (rowIndex: number) => {
  data.value.splice(rowIndex, 1)
}
</script>

<template>
  <div>

    <a-table :columns="columns" :data="data" :pagination="false">
      <template #name="{ rowIndex }">
        <a-input v-model="data[rowIndex].name" />
      </template>
      <template #showOnToolbar="{ rowIndex }">
        <a-switch v-model="data[rowIndex].showOnToolbar" />
      </template>
      <template #opt="{ rowIndex }">
        <a-popconfirm content="确认删除?" @ok="remove(rowIndex)">
          <a-button type="text" size="small" status="danger" shape="round"
            >删除</a-button
          >
        </a-popconfirm>
      </template>
    </a-table>
    <a-alert type="warning">
      若不保存，对过滤器的调整只对当前页面有效，刷新之后将回到调整前；点保存，可以将过滤器的设置存到服务器。
    </a-alert>
  </div>
</template>

<style scoped></style>
