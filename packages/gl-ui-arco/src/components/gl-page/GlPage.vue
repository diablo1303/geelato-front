<template>
  <div class="gl-page-container" :style="style">
    <Breadcrumb :items="breadcrumb"/>
<!--    <slot></slot>-->
<!--    <a-card class="gl-page-general-card" :title="pageTitle?$t(pageTitle):pageTitle" @click="showSlot">-->
<!--    </a-card>-->
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlPage'
}
</script>
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
  }
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
.gl-page-container {
  padding: 0 20px 20px 20px;
}

.gl-page-general-card > .arco-card-header {
  border-bottom: 0;
}
</style>
