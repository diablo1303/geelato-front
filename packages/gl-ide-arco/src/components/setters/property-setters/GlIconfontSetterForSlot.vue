<template>
  <div>
    <div>{{modelValue.props}}</div>
    <span style="cursor: pointer" @click="()=>{visible=true}">
          <GlIconfont :="modelValue.props"></GlIconfont>
    </span>
    <span v-if="modelValue.props&&modelValue.props.type" style="cursor: pointer" @click="()=>{modelValue.props.type=''}">
          删除图标
    </span>
    <span v-else style="cursor: pointer" @click="()=>{visible=true}">
          选择图标
    </span>
    <span>
      <a-input style="width: 50%" v-model="modelValue.props.text" placeholder="附加文本"
               @change="onChangeText"></a-input>
    </span>
    <a-modal v-model:visible="visible" title="选择图标" @ok="()=>{visible=false}" :width="1024" style="top: 20px">
      <div style="height:640px;overflow-y: scroll;padding:1em;margin:-24px">
        <div v-for="item in json.glyphs" class="gl-setting-icon-item" @click="onSelected(item)">
          <div style="font-size: 2em;">
            <GlIconfont :type="json.css_prefix_text+item.font_class"></GlIconfont>
          </div>
<!--          <div>{{ item.name }}</div>-->
          <div>{{ json.css_prefix_text + item.font_class }}</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {iconsJson} from "@geelato/gl-ui"
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlIconfontSetterForSlot",
  props: {
    modelValue: {
      type: Object,
      default() {
        return {
          handler: 'ComponentHandler',
          componentName: 'GlIconfont',
          props: {
            type: '',
            text: '',
            rotate: 0
          }
        }
      }
    }
  },
  created() {
    if (this.modelValue.handler !== 'ComponentHandler') {
      this.modelValue.handler = 'ComponentHandler'
      this.modelValue.componentName = 'GlIconfont'
      this.modelValue.props = {
        type: '',
        text: ''
      }
    }
  },
  data() {
    return {
      visible: false,
      json: iconsJson
    }
  },
  methods: {
    onChangeText(x:string) {
      console.log('onChangeText', x)
      this.emit()
    },
    onSelected(iconItem:any) {
      this.modelValue.props.type = this.json.css_prefix_text + iconItem.font_class
      this.emit()
      this.visible = false
    },
    emit() {
      this.$emit('update:modelValue', this.modelValue)
    }
  }
})
</script>

<style>

.gl-setting-icon-item {
  display: inline-block;
  padding: 0.5em;
  text-align: center;
  cursor: pointer;
  min-width: 9em;
  max-width: 9em;
  height: 9em;
  vertical-align: top;
}

.gl-setting-icon-item:hover {
  box-shadow: 0px 0px 4px #1890FF;
}
</style>
