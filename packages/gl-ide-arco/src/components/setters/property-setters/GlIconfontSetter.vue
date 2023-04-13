<template>
  <div class="gl-iconfont-setter">
    <span style="cursor: pointer" @click="showIconSelect">
          <GlIconfont :type="mv.type"></GlIconfont>
    </span>
    <span v-if="mv.type" style="cursor: pointer" @click="()=>{mv.type=''}">
          删除图标
    </span>
    <span v-else style="cursor: pointer" @click="showIconSelect">
          选择图标
    </span>
    <span>
      <a-input style="width: 50%" v-model="mv.text" placeholder="附加文本"
               @change="onChangeText"></a-input>
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

<script lang="ts" setup>
import {iconsJson,IconsJson} from "@geelato/gl-ui"
import {ref} from 'vue'

const props = defineProps({
  modelValue: {
    type: Object
  }
})
const emits = defineEmits(['update:modelValue'])
const visible = ref(false)
const json:IconsJson = iconsJson
const mv = ref(props.modelValue||{
  type: '',
  text: '',
  rotate: 0
})

const onChangeText = (x: string) => {
  console.log('onChangeText', x)
  emitUpdate()
}
const onSelected = (iconItem: any) => {
  console.log('iconItem',iconItem,json)
  mv.value.type = json.css_prefix_text + iconItem.font_class
  emitUpdate()
  visible.value = false
}
const showIconSelect = ()=>{
  visible.value = true
}
const emitUpdate = () => {
  emits('update:modelValue', mv)
}
</script>

<style>

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
