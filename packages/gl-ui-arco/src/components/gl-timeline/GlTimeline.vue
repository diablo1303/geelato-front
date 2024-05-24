<script lang="ts">
export default {
  name: 'GlTimeline'
}

export enum DotColorRuleEnum {
  labelNotEmpty = 'labelNotEmpty',
  anyScene = 'anyScene'
}
</script>
<script lang="ts" setup>
import { inject, type PropType, type Ref, ref, watch } from 'vue'
import type { GlTimelineItem } from './type'
import type { EntityReader } from '@geelato/gl-ui'
import { entityApi, jsScriptExecutor, PageProvideKey, PageProvideProxy } from '@geelato/gl-ui'
import useLoading from '../../hooks/loading'

const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  // @ts-ignore
  reverse: Boolean,
  direction: ['horizontal', 'vertical', String],
  mode: String,
  pending: [Boolean, String],
  labelPosition: String,
  itemMode: {
    type: String as PropType<'static' | 'dynamic' | 'dynamicUpdateStatic'>,
    default() {
      return 'static'
    }
  },
  /**
   * items 比entityReader优先，若设置了该值，则entityReader无效
   */
  items: {
    type: Array as PropType<Array<GlTimelineItem>>,
    default() {
      return []
    }
  },
  entityReader: {
    type: Object as PropType<EntityReader>,
    required: true
  },
  iconSize: {
    type: String,
    default() {
      return '3em'
    }
  },
  dotColor: String,
  dotColorRule: String as PropType<DotColorRuleEnum>
})

const emits = defineEmits(['update:modelValue', 'onItemClick'])
const { loading, setLoading } = useLoading()

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
const mode = ref('top')
const onChange = (_mode: string) => {
  mode.value = _mode
}

const timelineItems: Ref<GlTimelineItem[]> = ref([])

/**
 *  依据配置的全局着色规则进行着色
 */
const tryToColor = (items: GlTimelineItem[]) => {
  if (!props.dotColor) return
  if (props.dotColorRule === DotColorRuleEnum.labelNotEmpty) {
    items.forEach((item) => {
      if (item.label) {
        item.dotColor = props.dotColor!
      }
    })
  } else if (props.dotColorRule === DotColorRuleEnum.anyScene) {
    items.forEach((item) => {
      item.dotColor = props.dotColor!
    })
  }
}

const setTimelineItems = (value: GlTimelineItem[]) => {
  tryToColor(value)
  timelineItems.value = value
}

const fetchData = () => {
  jsScriptExecutor.evalValueExpressions(props.entityReader.params, { pageProxy: pageProvideProxy })
  setLoading(true)
  return entityApi
    .queryByEntityReader(props.entityReader)
    .then((res: any) => {
      // console.log('timeline res ',res.data)
      if (props.itemMode === 'dynamic') {
        setTimelineItems(res.data)
      } else if (props.itemMode === 'dynamicUpdateStatic') {
        // 获取第个节点，从动态数据中匹配最新的数据
        const items = JSON.parse(JSON.stringify(props.items))
        items.forEach((item: any) => {
          // 将动态的数据合并到静态中，不增加项，只更新静态items的数据
          const foundDataItem = res.data.find((dataItem: Record<string, any>) => {
            // 基于code匹配
            return item.code == dataItem.code
          })
          // console.log('foundDataItem', foundDataItem, 'item', item)

          if (foundDataItem) {
            Object.assign(item, foundDataItem)
          } else {
            item.id = ''
          }
        })
        setTimelineItems(items)
      }
      return res
    })

}

if (props.itemMode === 'static') {
  setTimelineItems(props.items)
} else {
  if (props.itemMode === 'dynamicUpdateStatic') {
    setTimelineItems(props.items)
  }
  if (props.entityReader?.immediate) {
    fetchData()
  }
}

const editingItem = ref({})

const onItemClick = (item: GlTimelineItem, index: number) => {
  emits('onItemClick', item, index)
  editingItem.value = item
}

defineExpose({ fetchData })
</script>

<template>
  <div class="gl-timeline">
    <a-spin :loading="loading" style="width: 100%">
      <a-timeline
          class="gl-timeline"
          :reverse="reverse"
          :direction="direction"
          :mode="mode"
          :pending="pending"
          :labelPosition="labelPosition"
      >
        <template v-if="timelineItems && timelineItems.length > 0">
          <a-timeline-item
              v-for="(item, index) in timelineItems"
              :label="item.label"
              :dotColor="item.dotColor"
              :dotType="item.dotType"
              :lineType="item.lineType"
              :lineColor="item.lineColor"
              style="padding-bottom: -12px"
          >
            <div
                v-if="item.iconType"
                :style="{ display: 'inline-flex', alignItems: 'center' }"
                @click="onItemClick(item, index)"
            >
              <GlIconfont
                  :type="item.iconType"
                  style="margin: 0 16px 0 0"
                  :style="{ 'font-size': iconSize, color: item.dotColor }"
              />
              <div :style="{ marginBottom: '0' }">
                {{ item.title }}
                <div :style="{ fontSize: '12px', color: '#4E5969' }">
                  {{ item.content }}
                </div>
              </div>
            </div>
            <div v-else @click="onItemClick(item, index)">
              <div :style="{ marginBottom: '12px' }">
                {{ item.title }}
                <div :style="{ fontSize: '12px', color: '#4E5969' }">
                  {{ item.content }}
                </div>
              </div>
            </div>
          </a-timeline-item>
        </template>
        <template v-else>
          <a-timeline-item> 无数据</a-timeline-item>
        </template>
      </a-timeline>
    </a-spin>
  </div>
</template>

<style scoped></style>
