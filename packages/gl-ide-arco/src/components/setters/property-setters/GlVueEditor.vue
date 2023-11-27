<script lang="ts">
export default {
  name: 'GlVueEditor'
}
</script>
<script lang="ts" setup>

import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
// const editingContent = ref(props.modelValue)
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const visible = ref(false)

const monacoEditor = ref()
const ok = () => {
  visible.value = false
  // mv.value = editingContent.value
}
const close = () => {
  visible.value = false
}

</script>

<template>
  <div>
    <a-input @click="visible = true" readonly v-model="mv"></a-input>
    <a-modal :visible="visible" title="页面内容编辑"  draggable :footer="false" @ok="ok" @cancel="close" @close="close" width="80%">
      <GlMonacoEditor ref="monacoEditor" v-model="mv" :height="1000"
                      language="html" style="max-height:1000px"></GlMonacoEditor>
    </a-modal>
  </div>
</template>
