<template>
  <div class="gl-iconfont-text-setter" style="padding-left: 4px">
    <div style="display: flex">
      <div style="flex: 1;min-width: 6em;max-width:6em;line-height: 2.2em">
        <span style="cursor: pointer" @click="showIconSelect" title="点击重新选择图标">
          <GlIconfont :type="mv.type"></GlIconfont>
        </span>
        <span v-if="mv.type" style="cursor: pointer" @click="()=>{mv.type=''}" title="点击删除该图标">
          删除图标
        </span>
        <span v-else style="cursor: pointer" @click="showIconSelect">
          选择图标
        </span>
      </div>
      <div style="flex: auto">
        <a-input style="width: 100%" v-model="mv.text" placeholder="按钮文字"
                 @change="onChangeText"></a-input>
      </div>
    </div>
    <a-modal draggable v-model:visible="visible"  @ok="showIconSelect" :width="1124" style="top: 20px">
      <template #title>
        选择图标
        <a-input-search v-model="searchText" style="width: 18em;margin-left: 0.5em"
                        placeholder="输入查询过滤图标"></a-input-search>
      </template>
      <div style="height:640px;overflow-y: scroll;padding:1em 1em 0 1em;margin:-24px 0">
        <div v-for="item in items" class="gl-iconfont-setter-icon-item"
             :class="{'gl-selected':mv.type===json.css_prefix_text + item.font_class}" @click="onSelected(item)">
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
  name: 'GlIconfontTextSetter'
}
</script>
<script lang="ts" setup>
import {iconsJson, IconsJson} from "@geelato/gl-ui"
import {computed, ref} from 'vue'

const props = defineProps({
  modelValue: {
    type: Object
  }
})
const emits = defineEmits(['update:modelValue'])
const visible = ref(false)
const json: IconsJson = iconsJson
const mv = ref(props.modelValue || {
  type: '',
  text: '',
  rotate: 0
})

const searchText = ref('')

const items = computed(() => {
  const text = searchText.value.trim()
  if (!text) {
    return json.glyphs
  }
  return json.glyphs.filter((glyph: any) => {
    return (json.css_prefix_text + glyph.font_class).indexOf(text) != -1
  })
})

const onChangeText = (x: string) => {
  // console.log('onChangeText', x)
  emitUpdate()
}
const onSelected = (iconItem: any) => {
  // console.log('iconItem', iconItem, json)
  mv.value.type = json.css_prefix_text + iconItem.font_class
  emitUpdate()
  visible.value = false
}
const showIconSelect = () => {
  visible.value = true
}
const emitUpdate = () => {
  emits('update:modelValue', mv)
}
</script>

<style scoped>

.gl-iconfont-setter-icon-item {
  display: inline-block;
  padding: 0.5em;
  text-align: center;
  cursor: pointer;
  min-width: 10em;
  max-width: 10em;
  height: 7em;
  vertical-align: top;
}

.gl-iconfont-setter-icon-item:hover, .gl-iconfont-setter-icon-item.gl-selected {
  box-shadow: 0px 0px 4px #1890FF;
}

</style>
