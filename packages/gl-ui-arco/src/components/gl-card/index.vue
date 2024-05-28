<template>
  <a-card class="gl-card" :class="{ 'gl-hidden': isHidden, 'gl-hide-header': !isShowLabel }">
    <template #extra>
      <div class="gl-card-extra-items">
        <slot name="extra"></slot>
      </div>
    </template>
    <template #actions>
      <div class="gl-card-extra-items">
        <slot name="actions"></slot>
      </div>
    </template>
    <template #cover>
      <slot name="cover"></slot>
    </template>
    <template #title v-if="isShowLabel">
      <span @click="switchHide" style="cursor: pointer">
        <span>
          <GlIconfont v-if="isHidden" type="gl-down-circle"></GlIconfont>
          <GlIconfont v-else type="gl-right-circle"></GlIconfont>
        </span>
        <span v-html="label">
        </span>
      </span>
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
import { computed, ref } from 'vue'
import { mixins } from '@geelato/gl-ui'

const props = defineProps({
  label: String,
  // 默认显示标题
  showLabel: Boolean,
  ...mixins.props
})

// 是否隐藏卡片的内容，即折叠
const isHidden = ref(false)
const isShowLabel = computed(() => {
  return props.showLabel !== false
})

const switchHide = () => {
  isHidden.value = !isHidden.value
}
</script>

<style>
.gl-card .arco-card-header .gl-icon-font {
  margin-right: 4px;
}

.gl-card > .arco-card-body {
  overflow-y: auto;
}

.gl-card.gl-hidden > .arco-card-body {
  display: none;
}

.gl-card.gl-hide-header .arco-card-header {
  display: none;
}

.gl-card-extra-items {
  display: flex;
}

.gl-card-extra-items > * {
  margin-left: 8px;
}
</style>
