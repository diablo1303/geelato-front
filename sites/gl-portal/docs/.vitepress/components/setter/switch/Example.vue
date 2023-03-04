<template>
  <div class="gl-setter-example">
    <h4>{{ titles.result }}</h4>
    <div v-if="refreshFlag">
      <GlComponent :glComponentInst="componentInstance">按钮</GlComponent>
    </div>
    <h4 :id="titles.setter" tabindex="-1">{{ titles.setter }}
      <a class="header-anchor" :href="'#'+titles.setter" aria-hidden="true">#</a>
    </h4>
    <div>
      <GlComponentPropertiesSetter :componentMeta="componentMeta" :componentInstance="componentInstance"
                         @update="(val)=>{setInstance(val)}">

      </GlComponentPropertiesSetter>
    </div>
    <h4>{{ titles.instance }}</h4>
    <div v-if="refreshFlag">
      <VueJsonPretty :data="componentInstance"></VueJsonPretty>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue'
import exampleMixins from "../exampleMixins";
import {SwitchMeta as meta} from "@geelato/gl-ui-schema-arco";
import componentInstance from "./instanceData";
import VueJsonPretty from "vue-json-pretty";

export default defineComponent({
  name: "ComponentSetterExample",
  components:{VueJsonPretty},
  mixins: [exampleMixins],
  data() {
    return {
    }
  },
  beforeMount() {
    this.componentMeta = meta
    this.componentInstance = componentInstance
  },
  methods: {}
})
</script>

<style>
.gl-setter-example > h4 {
  margin: 1em 0 ;
}
</style>
