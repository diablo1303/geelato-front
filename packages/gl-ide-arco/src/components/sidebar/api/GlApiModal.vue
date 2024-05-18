<script lang="ts">
export default {
  name: 'GlApiModal'
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
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
</script>

<template>
  <div>
    <div class="gl-segment" style="background-image: ">
      <div style="width: 100px;text-align: center;padding: 1em 4em">
        <gl-iconfont type="gl-api" style="font-size: 8em"></gl-iconfont>
      </div>
      <div style="padding: 1em">
        <h2>XXX接口</h2>
        <div>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<style scoped>
.gl-segment{display: flex}
</style>
