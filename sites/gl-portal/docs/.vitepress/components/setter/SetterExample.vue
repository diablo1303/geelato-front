<template>
  <div class="gl-setter-example">
    <h4>{{ titles.result }}</h4>
    <div v-if="refreshFlag">
      <!--        <GlComponent :glComponentInst="buttonComponentInstance">按钮</GlComponent>-->
    </div>
    <h4 :id="titles.setter" tabindex="-1">{{ titles.setter }}
      <a class="header-anchor" :href="'#'+titles.setter" aria-hidden="true">#</a>
    </h4>
    <div>
      <!--      <GlComponentPropertiesSetter :componentMeta="componentMeta" :componentInstance="componentInstance"-->
      <!--                         @update="(val)=>{setInstance(val)}">-->
      <!--      </GlComponentPropertiesSetter>-->
      <GlComponentSetter :componentMeta="componentMeta" :componentInstance="componentInstance"
                         @update="(val)=>{updateInstance(val)}"/>
    </div>
    <h4>{{ titles.instance }}</h4>
    <div v-if="refreshFlag">
      <VueJsonPretty :data="componentInstance"></VueJsonPretty>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "SetterExample"
}
</script>
<script setup lang="ts">

import {nextTick, ref} from 'vue'
import {LooseObject} from "@geelato/gl-ui";
import VueJsonPretty from "vue-json-pretty";
import 'vue-json-pretty/lib/styles.css';
import {ButtonMeta as buttonComponentMeta, useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
import buttonComponentInstance from "./button/instanceData";
import type {ComponentInstance} from "@geelato/gl-ui-schema";

const props = defineProps({
  instanceData: Object,
  metaData: Object
})

const componentMeta = ref(props.metaData)
const componentInstance = ref(props.instanceData)
const titles = {
  setter: '组件设置面板',
  instance: '组件实例信息',
  result: '组件展示',
  meta: '组件协议信息'
}
const refreshFlag = ref(true)

const getInstance = (propertyName: String) => {
  for (let key in this.demoProps as LooseObject) {
    if (key === propertyName) {
      let kv = {}
      kv[propertyName] = this.demoProps[key]
      return kv
    }
  }
}
const updateInstance = (instance: ComponentInstance) => {
  let that = this
  console.log('updateInstance > instance:', instance)
  that.refreshFlag = false
  nextTick(() => {
    that.refreshFlag = true
  })
}
</script>

<style scoped>

</style>
