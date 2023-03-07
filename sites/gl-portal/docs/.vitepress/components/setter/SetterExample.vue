<template>
  <div class="gl-setter-example">
    <h4>{{ titles.result }}</h4>
    <div v-if="refreshFlag">
<!--      <GlComponent :glComponentInst="componentInstance">按钮</GlComponent>-->
    </div>
    <h4 :id="titles.setter" tabindex="-1">{{ titles.setter }}
      <a class="header-anchor" :href="'#'+titles.setter" aria-hidden="true">#</a>
    </h4>
    <div>
<!--      <GlComponentPropertiesSetter :componentMeta="componentMeta" :componentInstance="componentInstance"-->
<!--                         @update="(val)=>{setInstance(val)}">-->
<!--      </GlComponentPropertiesSetter>-->
      <GlComponentSetter :componentMeta="componentMeta" :componentInstance="componentInstance" @update="(val)=>{updateInstance(val)}"/>
    </div>
    <h4>{{ titles.instance }}</h4>
    <div v-if="refreshFlag">
      <VueJsonPretty :data="componentInstance"></VueJsonPretty>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent,nextTick} from 'vue'
import {LooseObject} from "@geelato/gl-ui";
import VueJsonPretty from "vue-json-pretty";
import 'vue-json-pretty/lib/styles.css';
import {ButtonMeta as componentMeta} from "@geelato/gl-ui-schema-arco";
import componentInstance from "./button/instanceData";

export default defineComponent({
  name: "SetterExample",
  components:{VueJsonPretty},
  mixins: [],
  props:{
    instanceData:Object,
    metaData:Object
  },
  data() {
    return {
      componentMeta: this.metaData,
      componentInstance: this.instanceData,
      titles: {
        setter: '组件设置面板',
        instance: '组件实例信息',
        result: '组件展示',
        meta: '组件协议信息'
      },
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
    updateInstance(instance) {
      let that = this
      console.log('updateInstance > instance:', instance)
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
