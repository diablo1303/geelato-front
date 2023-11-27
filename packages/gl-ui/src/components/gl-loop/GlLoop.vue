<script lang="ts" setup>
import { computed, onMounted, type PropType, type Ref, ref, watch } from 'vue'
import type { EntityReader } from '../../m/datasource/EntityDataSource'
import { entityApi } from '../../m/datasource/EntityApi'
import mixins from '../mixins'

defineOptions({ name: 'GlLoop' })
type SpaceSize = number | 'mini' | 'small' | 'medium' | 'large'
const emits = defineEmits(['update:modelValue', 'clickLoopItem'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  模板数据源类型
   *  staticArray：静态数组数据源
   *  dynamicArray：动态的实体数据源(entityReader)
   */
  dataSourceType: {
    type: String,
    default() {
      return 'staticArray'
    }
  },
  /**
   *  静态的数据源
   */
  staticArray: {
    type: Array as PropType<Array<Record<string, any>>>
  },
  /**
   * 数据实体
   */
  entityReader: {
    type: Object as PropType<EntityReader>,
    required: true
  },
  /**
   *  对齐方式
   *  'start' | 'end' | 'center' | 'baseline'
   */
  align: String  as PropType<'start' | 'end' | 'center' | 'baseline'>,
  /**
   *  间距方向
   *  'vertical' | 'horizontal'
   *  默认为'horizontal'
   */
  direction: String as PropType< "horizontal" | "vertical">,
  /**
   *  间距大小，支持分别制定横向和竖向的间距
   *  number | 'mini' | 'small' | 'medium' | 'large' | [SpaceSize, SpaceSize]
   *  默认为'small'
   */
  size: [String, Number],
  /**
   *  是否可折行
   *  环绕类型的间距，用于折行的场景。
   *  默认为false
   */
  wrap: Boolean,
  /**
   *  充满整行
   *  默认为false
   */
  fill: Boolean,
  /**
   *  分隔
   *  默认为false
   */
  divider: Boolean,
  ...mixins.props
})

const computedSize = computed(():number | 'mini' | 'small' | 'medium' | 'large' => {
  if (props.size === 'none') {
    return 0
  }
  // @ts-ignore
  return props.size
})

const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

watch(
  () => {
    return props.dataSourceType
  },
  () => {
    updateData()
  },
  { deep: true }
)

watch(
  () => {
    return props.staticArray
  },
  () => {
    updateData()
  },
  { deep: true }
)

watch(
  () => {
    return props.entityReader
  },
  () => {
    loadData()
  },
  { deep: true }
)

const items: Ref<Record<string, any>[]> = ref([])
const loadData = () => {
  if (props.entityReader) {
    entityApi.queryByEntityReader(props.entityReader).then((res: any) => {
      items.value = res.data
    })
  }
}

const updateData = () => {
  if (props.dataSourceType === 'staticArray') {
    // @ts-ignore
    items.value = props.staticArray
  } else {
    loadData()
  }
}

onMounted(() => {
  updateData()
})

const onClick = (glLoopItem: any, glLoopIndex: number) => {
  emits('clickLoopItem', { glLoopItem, glLoopIndex })
}
</script>

<template>
  <div class="gl-template">
    <template v-if="items && items.length > 0">
      <a-space :align="align" :direction="direction" :size="computedSize" :wrap="wrap" :fill="fill">
        <template #split>
          <a-divider
            v-if="divider"
            :direction="direction === 'vertical' ? 'horizontal' : 'vertical'"
          />
        </template>
        <template v-for="(glLoopItem, glLoopIndex) in items" :key="glLoopIndex">
          <component
              @click="onClick(glLoopItem, glLoopIndex)"
              :is="'GlInsts' + glRuntimeFlag"
              :glComponentInst="glComponentInst"
              :glIsRuntime="glIsRuntime"
              :glRuntimeFlag="glRuntimeFlag"
              :glLoopItem="glLoopItem"
              :glLoopIndex="glLoopIndex"
          />
        </template>
      </a-space>
    </template>
    <div class="gl-loop-item" v-else>
      <!-- 初始状态 -->
      <component
        :is="'GlInsts' + glRuntimeFlag"
        :glComponentInst="glComponentInst"
        :glIsRuntime="glIsRuntime"
        :glRuntimeFlag="glRuntimeFlag"
      />
    </div>
  </div>
</template>
