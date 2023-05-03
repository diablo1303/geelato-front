<template>
  <div class="gl-iconfont-setter">
    <span style="cursor: pointer;margin-left: 1em" @click="showIconSelect">
          <GlIconfont :type="mv"></GlIconfont>
    </span>
    <span v-if="mv" style="cursor: pointer;float: right;margin-right: 0.5em" @click="()=>{mv=''}">
          清除
    </span>
    <span v-else style="cursor: pointer" @click="showIconSelect">
          选择图标
    </span>
    <a-modal v-model:visible="visible" title="选择图标" @ok="showIconSelect" :width="1024" style="top: 20px">
      <div style="height:640px;overflow-y: scroll;padding:1em;margin:-24px">
        <div v-for="item in json.glyphs" class="gl-iconfont-setter-icon-item" @click="onSelected(item)">
          <div style="font-size: 2em;">
            <GlIconfont :type="json.css_prefix_text+item.font_class"></GlIconfont>
          </div>
          <div>{{ json.css_prefix_text + item.font_class }}</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlIconfontSetter'
}
</script>
<script lang="ts" setup>
import {iconsJson, IconsJson} from "@geelato/gl-ui"
import {ref, watch} from 'vue'

const props = defineProps({
  modelValue: {
    type: String
  }
})
const emits = defineEmits(['update:modelValue'])
const visible = ref(false)
const json: IconsJson = iconsJson
const mv = ref(props.modelValue)

const onSelected = (iconItem: any) => {
  console.log('iconItem', iconItem, json)
  mv.value = json.css_prefix_text + iconItem.font_class
  visible.value = false
}
const showIconSelect = () => {
  visible.value = true
}
const emitUpdate = () => {
  emits('update:modelValue', mv.value)
}
watch(mv, () => {
  emitUpdate()
})
</script>

<style scoped>

.gl-iconfont-setter-icon-item {
  display: inline-block;
  padding: 0.5em;
  text-align: center;
  cursor: pointer;
  min-width: 9em;
  max-width: 9em;
  height: 9em;
  vertical-align: top;
}

.gl-iconfont-setter-icon-item:hover {
  box-shadow: 0px 0px 4px #1890FF;
}
</style>
