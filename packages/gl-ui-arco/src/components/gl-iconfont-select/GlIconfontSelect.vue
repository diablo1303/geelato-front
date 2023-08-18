<template>
  <div class="gl-iconfont-select">
    <span style="cursor: pointer;margin-left: 1em" @click="showIconSelect">
          <GlIconfont :type="mv"></GlIconfont>
    </span>
    <span v-if="mv" style="cursor: pointer;float: right;margin-right: 0.5em" @click="()=>{mv=''}">
          清除
    </span>
    <span v-else style="cursor: pointer" @click="showIconSelect">
          选择图标
    </span>
    <a-modal v-model:visible="visible" title="选择图标xx" @ok="showIconSelect" :width="1024" style="top: 20px">
      <template #title>
        选择图标
        <a-input-search v-model="searchText" style="width: 18em;margin-left: 0.5em"
                        placeholder="输入查询过滤图标"></a-input-search>
      </template>
      <div style="height:640px;overflow-y: scroll;padding:1em;margin:-24px">
        <div v-for="item in items" class="gl-iconfont-select-icon-item" @click="onSelected(item)">
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
  name: 'GlIconfontSelect'
}
</script>
<script lang="ts" setup>
import {iconsJson, IconsJson} from "@geelato/gl-ui"
import {ref, watch,computed} from 'vue'

const props = defineProps({
  /**
   *  图标类型
   *  示例值：gl-setting
   */
  modelValue: {
    type: String
  }
})
const emits = defineEmits(['update:modelValue'])
const visible = ref(false)
const json: IconsJson = iconsJson
const mv = ref(props.modelValue)

const onSelected = (iconItem: any) => {
  // console.log('iconItem', iconItem, json)
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
  console.log('onChangeText', x)
  emitUpdate()
}

defineExpose({showIconSelect})
</script>

<style scoped>
.gl-iconfont-select{
  line-height: 32px;
}
.gl-iconfont-select-icon-item {
  display: inline-block;
  padding: 0.5em;
  text-align: center;
  cursor: pointer;
  min-width: 9em;
  max-width: 9em;
  height: 9em;
  vertical-align: top;
}

.gl-iconfont-select-icon-item:hover {
  box-shadow: 0 0 4px #1890FF;
}
</style>
