<template>
  <div class="gl-component-setter">
    <a-tabs size="small" v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="属性" title="属性">
        <!--        <GlComponentPropertiesSetter :componentMeta="componentMeta" v-model:componentInstance="componentInstance"-->
        <!--                                     @update="(val:any)=>{setInstance(val,'props')}" />-->
        <GlComponentPropertiesSetter :componentMeta="componentMeta" :componentInstance="componentModel"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="样式" title="样式" force-render>
        <GlComponentStyleSetter :componentMeta="componentMeta" :componentInstance="componentInstance"
                                @update="(val:any)=>{setInstance(val,'style')}"/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="动作" title="动作">
        <GlComponentActionsSetter :componentMeta="componentMeta" :componentInstance="componentInstance"
                                  @update="(val:any)=>{setInstance(val,'actions')}"/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import {EntityMeta, utils} from "@geelato/gl-ui";
import {ComponentInstance, ComponentMeta} from "@geelato/gl-ui-schema";
import {PropType, provide, ref} from "vue";

const entityMeta = new EntityMeta()
const ds = ref({entityMeta})
provide('$entityDS', ds)
console.log('provide ds:', ds)
const emits = defineEmits(['update']);
const props = defineProps({
  componentMeta: {
    type: Object as PropType<ComponentMeta>,
    required: true
  },
  componentInstance: {
    type: Object as PropType<ComponentInstance>
  }
})
/**
 *  每次创建不同的key,确保对应的组件每次能重新渲染，避免单列下的变量污染,但这会导致输入一个字符即失去焦点 TODO
 */
const genKey = () => {
  return utils.gid('', 16)
}
// 组件实例值
const componentModel = ref(props.componentInstance)
const activeKey = ref("1")
const setInstance = (instance: ComponentInstance, form: String) => {
  // console.log('GlComponentSetter > set instance:', instance,'form',form)
  // // Object.extend(this.componentInstance,instance)
  // componentModel.value = instance
  // if(form==='style'){
  //   // TODO
  // }
  // emits('update',instance)
}
</script>

<style scoped>
</style>
