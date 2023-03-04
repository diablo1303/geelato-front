<template>
  <div class="gl-designer-setter">
    <component v-if="componentStare.currentSelectedComponentMeta" is="GlComponentSetter"
               :componentMeta="componentStare.currentSelectedComponentMeta"
               :componentInstance="componentStare.currentSelectedComponentInstance" @update="(val:any)=>{updateInstance(val)}"></component>
    <template v-else>
      <div style="text-align: center;line-height: 3;height: 3em;background-color: #e7e7e7;margin: 12px 12px 0px">
        请先选择组件
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent, nextTick} from 'vue'
import {useThemeStore} from "../stores/UseThemeStore";
import {useComponentStore} from "../stores/UseComponentStore";

export default defineComponent({
  name: "GlIdeSetter",
  setup(props, context) {
    const componentStare = useComponentStore()
    const themeStore = useThemeStore()
    const btnStyle = {background: themeStore.theme.background}
    const componentMeta = {}
    const componentInstance = {}
    return {
      componentStare,
      btnStyle,
      componentMeta,
      componentInstance
    }
  },
  methods:{
    updateInstance(instance:any){
      console.log('updateInstance:',instance)
      this.$emit('update',instance)
    }
  }
})
</script>

<style>
/*.ant-tabs-bar {*/
/*margin: 0;*/
/*}*/

.gl-designer-properties .ant-tabs-nav .ant-tabs-tab {
  margin: 0;
}
</style>
