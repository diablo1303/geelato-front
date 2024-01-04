<template>
  <a-card class="gl-card" :class="{ 'gl-hidden': isHidden, 'gl-hide-header': !isShowLabel }">
    <template #extra>
      <a-space>
        <component
          :is="'GlInsts' + glRuntimeFlag"
          :glComponentInst="glComponentInst?.extra"
          :glIsRuntime="glIsRuntime"
          :glRuntimeFlag="glRuntimeFlag"
        />
      </a-space>
    </template>
    <template #title v-if="isShowLabel">
      <span @click="switchHide" style="cursor: pointer">
        <GlIconfont v-if="isHidden" type="gl-down-circle"></GlIconfont>
        <GlIconfont v-else type="gl-right-circle"></GlIconfont>
      </span>
      <span>{{ label }}</span>
    </template>
    <component
      :is="'GlInsts' + glRuntimeFlag"
      :glComponentInst="glComponentInst"
      :glIsRuntime="glIsRuntime"
      :glLoopItem="glLoopItem"
      :glLoopIndex="glLoopIndex"
      :glRuntimeFlag="glRuntimeFlag"
    />
  </a-card>
</template>
<script lang="ts">
export default {
  name: 'GlCard'
}
</script>
<script lang="ts" setup>
import { mixins } from '@geelato/gl-ui'
import { ref } from 'vue'

const props = defineProps({
  label: String,
  // 默认显示标题
  showLabel: Boolean,
  ...mixins.props
})

// 是否隐藏卡片的内容，即折叠
const isHidden = ref(false)
const isShowLabel = props.showLabel !== false

const switchHide = () => {
  isHidden.value = !isHidden.value
}
</script>

<style>
.gl-card {
  width: 100%;
}

.gl-card.gl-hidden .arco-card-body {
  display: none;
}

.gl-card.gl-hide-header .arco-card-header {
  display: none;
}
</style>
