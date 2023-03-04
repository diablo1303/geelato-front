<template>
  <div>设置器面板</div>
  <div>
    <GlComponentPropertiesSetter :componentMeta="componentMeta" :componentInstance="componentInstance"
                       @update="(val)=>{setInstance(val)}">

    </GlComponentPropertiesSetter>
  </div>
  <h4>设置结果预览</h4>
  <div>
    <h6>组件的props信息如下</h6>
    {{ componentInstance }}
  </div>
  <div v-if="refreshFlag">
    <h6>组件渲染结果（基于通用组件）</h6>
    <GlComponent :glComponentInst="componentInstance">按钮</GlComponent>

  </div>
</template>

<script lang="ts">

import {defineComponent, nextTick, ref} from 'vue'
import {componentMeta, componentInstance} from "./ComponentSetterStepsData.ts";
import {LooseObject} from "gl-runtime";

export default defineComponent({
  name: "ComponentSetterSteps",
  data() {
    return {
      componentMeta: componentMeta,
      componentInstance: componentInstance,
      refreshFlag: true
    }
  },
  methods: {
    getInstance(propertyName) {
      for (let key in this.demoProps as LooseObject) {
        if (key === propertyName) {
          let kv = {}
          kv[propertyName] = this.demoProps[key]
          return kv
        }
      }
    },
    setInstance(instance) {
      let that = this
      console.log('set instance:', instance)
      this.componentInstance = instance
      that.refreshFlag = false
      nextTick(() => {
        that.refreshFlag = true
      })
    }
  }
})
</script>

<style scoped>

</style>
