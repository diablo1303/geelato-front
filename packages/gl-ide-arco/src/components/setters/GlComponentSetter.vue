<template>
  <div class="gl-component-setter">
    <a-tabs size="small" v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="属性" title="属性">
        <GlComponentPropertiesSetter :componentMeta="componentMeta" :componentInstance="componentInstance"
                                     @update="(val)=>{setInstance(val,'props')}" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="样式" title="样式" force-render>
        <GlComponentStyleSetter :componentMeta="componentMeta" :componentInstance="componentInstance"
                                @update="(val)=>{setInstance(val,'style')}" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="动作" title="动作">
        <GlComponentActionsSetter :componentMeta="componentMeta" :componentInstance="componentInstance"
                                  @update="(val)=>{setInstance(val,'actions')}" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import {EntityMeta, LooseObject} from "@geelato/gl-ui";
import {ComponentMeta} from "@geelato/gl-ui-schema";
import {provide, ref} from "vue";

const entityMeta = new EntityMeta()
const ds = ref({entityMeta})
// provide('$entityDS',ds)
// console.log('provide ds:',ds)
const emits = defineEmits(['update']);
const props = defineProps({
  /**
   *  属性的配置展示模式
   */
  displayMode: String,
  componentMeta: {
    type: [ComponentMeta],
    required: true
  },
  componentInstance: {
    type: LooseObject
  }
})
// 组件实例值
const componentModel = ref({})
const activeKey = ref("1")
const setInstance = (instance:Object,form:String)  => {
  console.log('GlComponentSetter > set instance:', instance,'form',form)
  // Object.extend(this.componentInstance,instance)
  componentModel.value = instance
  if(form==='style'){
    // TODO 
  }
  emits('update',instance)
}
</script>

<style scoped>
</style>
