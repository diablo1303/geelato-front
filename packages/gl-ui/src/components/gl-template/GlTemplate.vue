<script lang="ts" setup>
// @ts-nocheck
import { computed, ref, watch } from 'vue'
import mixins from '../mixins'
import utils from '../../m/utils/Utils'

defineOptions({ name: 'GlTemplate' })
const emits = defineEmits(['update:content', 'clickTemplate'])
const props = defineProps({
  /**
   *  vue模板内容
   */
  content: String,
  /**
   *  参数
   */
  params: {
    type: Object,
    default() {
      return {}
    }
  },
  ...mixins.props
})

const mv = ref(props.content)
const refreshKey = ref(utils.gid('id'))
watch(
  () => {
    return props.content
  },
  () => {
    mv.value = props.content
    refreshKey.value = utils.gid('id')
  }
)

// const isUseLoopItem = computed(() => {
//   return mv.value?.includes('glLoopItem')
// })

// 基于配置的模板内容content，生成动态组件
const MyComponent = computed(() => {
  return {
    name: 'MyComponent',
    props: {
      params: {
        type: Object
      },
      ...mixins.props
    },
    template: mv.value
  }
})

const onClick = () => {
  emits('clickTemplate', {
    loopItem: props.glLoopItem,
    loopIndex: props.glLoopIndex,
    params: props.params
  })
}
</script>

<template>
  <div class="gl-template" :key="refreshKey" @click="onClick">
    <template v-if="!mv">
      <a-empty> 模板内容为空</a-empty>
    </template>
    <template v-else>
      <component
        :is="MyComponent"
        :glLoopItem="glLoopItem"
        :glLoopIndex="glLoopIndex"
        :params="params"
      />
    </template>
  </div>
</template>
<style scoped>
.gl-template {
  min-height: 1em;
}
</style>
