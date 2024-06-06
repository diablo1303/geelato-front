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
import type { LabelPositionType, ModeType } from '@arco-design/web-vue/es/timeline/interface'

const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  reverse: Boolean,
  direction: String as PropType<'horizontal' | 'vertical'>,
  mode: {
    type: String as PropType<ModeType>,
    default() {
      return 'top'
    }
  },
  pending: [Boolean, String],
  labelPosition: String as PropType<LabelPositionType>,
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
  dotColorRule: String as PropType<DotColorRuleEnum>,
  /**
   * 最大的label长度（字符数），超过该长度则隐藏
   * 默认为-1，表示不截断
   */
  labelMaxLen: {
    type: Number,
    default() {
      return -1
    }
  }
})

const emits = defineEmits(['update:modelValue', 'onItemClick'])
const { loading, setLoading } = useLoading()

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
// const mode = ref(props.mode || 'top')
// const onChange = (_mode: ModeType) => {
//   mode.value = _mode
// }

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
    .catch((err) => {
      console.error(err)
    })
    .finally(() => {
      setLoading(false)
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

const getContent = (content?: string) => {
  if (content && props.labelMaxLen > 0 && content.length > props.labelMaxLen) {
    return content.substring(0, props.labelMaxLen) + '...'
  }
  return content
}

defineExpose({ fetchData })
</script>

<template>
  <div class="gl-timeline">
    <a-spin :loading="loading" style="width: 100%">
      <a-timeline
        :reverse="reverse"
        :direction="direction"
        :mode="mode"
        :pending="pending"
        :labelPosition="labelPosition"
      >
        <template v-if="timelineItems && timelineItems.length > 0">
          <template v-for="(item, index) in timelineItems">
            <a-timeline-item
              v-if="!item.hide"
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
                :title="item.content"
              >
                <GlIconfont
                  :type="item.iconType"
                  style="margin: 0 16px 0 0"
                  :style="{ 'font-size': iconSize, color: item.dotColor }"
                />
                <div :style="{ marginBottom: '0' }">
                  <span class="gl-title">{{ item.title }}</span>
                  <div class="gl-content">
                    {{ getContent(item.content) }}
                  </div>
                </div>
              </div>
              <div v-else @click="onItemClick(item, index)">
                <div :style="{ marginBottom: '12px' }">
                  <span class="gl-title">{{ item.title }}</span>
                  <div class="gl-content" :title="item.content">
                    {{ getContent(item.content) }}
                  </div>
                </div>
              </div>
            </a-timeline-item>
          </template>
        </template>
        <template v-else>
          <a-timeline-item> 无数据</a-timeline-item>
        </template>
      </a-timeline>
    </a-spin>
  </div>
</template>

<style>
.gl-timeline .gl-title {
  font-weight: 600;
}
.gl-timeline .gl-content {
  font-size: 12px;
  color: #4e5969;
  /*width: 100px;  或者指定宽度 */
  /* white-space: nowrap; 内容不换行 */
  /* overflow: hidden; 超出部分不显示 */
  /* text-overflow: ellipsis; /* 超出部分显示省略号 */
}
</style>
