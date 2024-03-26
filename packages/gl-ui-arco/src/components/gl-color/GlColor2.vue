<script lang="ts">
export default {
  name: "GlColor2"
}
</script>
<script setup lang="ts">
// @ts-nocheck
import {Sketch} from '@ckpack/vue-color';
import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return '#FFFFFF'
    }
  },
  colorFormat: {
    type: String,
    default() {
      return 'hex'
    }
  },
  /**
   *  显示模式
   *  simple | full
   */
  mode: {
    type: String,
    default() {
      return 'full'
    }
  }
})

const mv = ref(props.modelValue)
const color = ref({[props.colorFormat]: props.modelValue})
watch(color, () => {
  // @ts-ignore
  mv.value = color.value[props.colorFormat]
}, {deep: true})

watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const visible = ref(false)
// etc: { h: 150, s: 0.66, v: 0.30 }, { r: 255, g: 0, b: 0 }, '#194d33'

</script>

<template>
  <div class="gl-color">
    <a-input v-if="mode==='full'" readonly v-model="mv" allow-clear>
      <template #append>
        <a-button size="mini" :style="{'background-color': mv}" style="border: 1px solid #d2d2d2"
                  @click="visible=true"></a-button>
      </template>
    </a-input>
    <a-button v-else-if="mode==='simple'" size="mini" :style="{'background-color': mv}"
              style="border: 1px solid #d2d2d2" @click="visible=true">
    </a-button>
    <a-modal width="220px"
             v-model:visible="visible"
             body-style="margin: 0;padding: 0"
             :header="false"
             :footer="false"
             esc-to-close="true"
             @ok="visible=false"
             @cancel="visible=false">
      <template #title>
        选择颜色
      </template>
      <div>
        <Sketch v-model="color"/>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>

</style>
