<template>
  <div class="gl-page" :style="style">
    <Breadcrumb :items="breadcrumb"/>
    <template v-if="glIsRuntime">
      <slot></slot>
    </template>
    <template v-else>
      <GlInsts :glComponentInst="glComponentInst"></GlInsts>
    </template>
    <!--        <a-card class="gl-page-general-card" :title="pageTitle?$t(pageTitle):pageTitle" @click="showSlot">-->
    <!--        </a-card>-->
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlPage'
}
</script>
<script lang="ts" setup>

import {mixins} from "@geelato/gl-ui";

const props = defineProps({
  breadcrumb: {
    type: Array,
    default() {
      return []
    }
  },
  pageTitle: {
    type: String,
    default() {
      return ''
    }
  },
  pageMargin: {
    type: String,
    default() {
      return ''
    }
  },
  pagePadding: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  自定义JS编码
   */
  script: {
    type: String,
    default() {
      return ''
    }
  },
  ...mixins.props
})

const style = {
  margin: props.pageMargin || '12px',
  padding: props.pagePadding || '12px'
}
const fnManager = {}

const showSlot = () => {
  console.log('showSlot')
}

const openDrawer = () => {

}

</script>


<style lang="less">
.gl-page {
  width: 100%;
  //padding: 0 20px 20px 20px;
}

.gl-page-general-card > .arco-card-header {
  border-bottom: 0;
}
</style>
