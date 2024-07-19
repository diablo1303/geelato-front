<script lang="ts">
export default {
  name: 'GlActionArgumentSetter'
}
</script>
<script lang="ts" setup>

import { computed, ref, watch } from 'vue'
import { useActionStore } from '@geelato/gl-ide'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})

const actionStore = useActionStore()
const actionMeta = actionStore.actionMeta

const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const selectItem = computed(()=>{
  return actionMeta?.params?.find(item=>{
    return item.name === mv.value
  })
})
</script>

<template>
  <div>
    <a-select v-model="mv" placeholder="请选择" allow-clear>
       <a-option v-for="item in actionMeta.params" :key="item.name" :value="item.name">{{`${item.title} ${item.name}`}}</a-option>
    </a-select>
    <div style="margin-left: 1em" v-if="selectItem">
      <div>
        <div>
          <div style="font-weight: 600; padding: 8px 0">类型：</div>
          {{ selectItem.type || '无' }}
        </div>
        <div>
          <div style="font-weight: 600; padding: 8px 0">描述</div>
          {{ selectItem.description || '无' }}
        </div>
        <div v-if="selectItem.docId" style="padding: 8px 0; color: #165dff">
          <GlPageHelp :pageHelpId="selectItem.docId" text="查看更多"></GlPageHelp>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
