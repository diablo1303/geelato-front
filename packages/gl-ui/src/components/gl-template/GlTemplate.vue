<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import mixins from '../mixins'
import utils from '../../m/utils/Utils'

defineOptions({ name: 'GlTemplate' })
const emits = defineEmits(['update:modelValue', 'clickTemplate'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
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
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const refreshKey = ref(utils.gid())
watch(
  () => {
    return props.content
  },
  () => {
    refreshKey.value = utils.gid()
  }
)

// 基于配置的模板内容content，生成动态组件
const MyComponent = computed(() => {
  return {
    name: 'MyComponent',
    props: {
      loopItem: {
        type: Object,
        default() {
          return {}
        }
      },
      loopIndex: {
        type: Number,
        default() {
          return -1
        }
      },
      params: {
        type: Object
      }
    },
    template: props.content
  }
})

const onClick = () => {
  emits('clickTemplate', {
    loopItem: props.glLoopItem,
    loopIndex: props.glLoopIndex,
    params: props.params
  })
}
console.log('create template ...',props.glLoopIndex)
</script>

<template>
  <div class="gl-template" :key="refreshKey" @click="onClick">
    <template v-if="!content">
      <a-empty >
        模板内容为空
      </a-empty>
    </template>
    <component v-else :is="MyComponent" :loopItem="glLoopItem" :loopIndex="glLoopIndex" :params="params" />
  </div>
</template>
<style scoped>
  .gl-template{
    min-height: 1em
  }
</style>
