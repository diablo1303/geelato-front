<template>
  <div class="gl-page-container">
    <Breadcrumb :items="breadcrumb"/>
    <a-card class="gl-page-general-card" :title="pageTitle?$t(pageTitle):pageTitle" @click="showSlot">
      <slot @openDrawer="openDrawer"></slot>
    </a-card>
  </div>
</template>

<script lang="ts" setup>

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
  /**
   *  自定义编码
   */
  script: {
    type: String,
    default() {
      return ''
    }
  }
})
const fnManager = {}

const showSlot = ()=>{
  console.log('showSlot')
}


</script>


<style lang="less">
.gl-page-container {
  padding: 0 20px 20px 20px;
}

.gl-page-general-card > .arco-card-header {
  border-bottom: 0;
}
</style>
