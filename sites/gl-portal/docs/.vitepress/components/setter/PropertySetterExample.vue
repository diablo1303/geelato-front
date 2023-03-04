<template>
  <div>设置器面板</div>
  <div class="gl-table" :class="{'gl-table-as-tree':false}">
    <template v-for="propertySetterMeta in demoMeta.propertySetterMetas">
      <GlPropertySetter :propertySetterMeta="propertySetterMeta"
                             :propertyValue="getPropertyValue(propertySetterMeta.name)"
                             @update="(val)=>{setPropertyValue(propertySetterMeta.name,val)}"></GlPropertySetter>
    </template>
  </div>
  <h4>设置结果预览</h4>
  <div>
    <h6>组件的props信息如下</h6>
    {{ demoProps }}
  </div>
  <div>
    <h6>组件渲染结果</h6>
    <AButton v-bind="demoProps">按钮</AButton>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue'
import {propertySetterMetasData} from "./propertySetterMetasData";
import {LooseObject} from "gl-runtime";

export default defineComponent({
  name: "Example",
  data() {
    return {
      demoMeta: {propertySetterMetas: propertySetterMetasData},
      demoProps: {}
    }
  },
  methods: {
    getPropertyValue(propertyName: string) {
      for (let key in this.demoProps) {
        if (key === propertyName) {
          return this.demoProps[key]
        }
      }
    },
    setPropertyValue(propertyName: string, value: any) {
      this.demoProps[propertyName] = value
    }
  }
})
</script>

<style scoped>

</style>
