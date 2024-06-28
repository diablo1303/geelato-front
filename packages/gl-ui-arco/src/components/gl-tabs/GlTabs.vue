<script lang="ts">
export default {
  name: 'GlTabs'
}
</script>
<script setup lang="ts">
import { mixins, useGlobal, utils } from '@geelato/gl-ui'
import { computed, nextTick, onMounted, onUpdated, type PropType, type Ref, ref, watch } from 'vue'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import type { TabsPosition } from '@arco-design/web-vue/es/tabs/interface'

const emits = defineEmits(['update:modelValue', 'update:items'])

class TabItem {
  title: string = ''
  iconType: string = ''
  value: string = ''
  disabled?: boolean = false
  // 懒加载，为true时，让面板在首次激活时渲染，注意这个的懒加载是针对单个面板
  lazyLoad?: boolean
  // 默认为false，面板选激活之后为true
  hasBeenLoad?: boolean
  // 选中该标签时，是否隐藏右上插槽，应用场景如：在页面详细查看时，哪有一个Tab可以通过右上的编辑按钮（插槽内的组件）启用编辑
  hideRightTopSlot?: boolean
}

const props = defineProps({
  modelValue: [String, Number],
  items: {
    type: Array as PropType<Array<TabItem>>
  },
  /**
   *  固定标题
   *  如可用于在打开详情页面时，tab标题固定，tab面板可以上下可以滚动
   *  默认为false
   */
  enableFixedTitle: {
    type:Boolean,
    default(){
      return true
    }
  },
  // /**
  //  *  默认值，用于在初始时，选中对应面板
  //  */
  // defaultValue:[String, Number],
  position: String as PropType<TabsPosition>,
  // type: String,
  // direction: String,
  ...mixins.props
})

const itemTemplate = () => {
  return {
    id: utils.gid('virtual'),
    componentName: 'GlVirtual',
    title: '项',
    props: {},
    slots: {},
    children: [
      {
        id: utils.gid('ph'),
        componentName: 'GlDndPlaceholder',
        title: '占位符',
        props: {},
        slots: {},
        children: [],
        actions: []
      }
    ],
    actions: []
  }
}

// console.log('props.items:', props.items)
// 当前选中的标签项
const itemMv: Ref<TabItem | { hideRightTopSlot: false; [Key: string]: any }> = ref({
  hideRightTopSlot: false
})
const tabItems: Ref<TabItem[]> = ref(props.items || [])
// 初始时，设置为未加载
tabItems.value.forEach((item: any) => {
  item.hasBeenLoad = false
})
if (tabItems.value.length === 0) {
  tabItems.value.push(
    ...[
      {
        title: '标题1',
        iconType: '',
        value: '1'
      },
      {
        title: '标题2',
        iconType: '',
        value: '2'
      }
    ]
  )
  props.glComponentInst.children = props.glComponentInst.children || []
  props.glComponentInst.children.push(itemTemplate())
  props.glComponentInst.children.push(itemTemplate())
}

const mv = ref(props.modelValue)
// 处理空值（历史数据问题）
const clearNullChild = () => {
  let subInstIndex = 0
  props.glComponentInst.children?.forEach((subInst) => {
    if (!subInst) {
      props.glComponentInst.children.splice(subInstIndex, 1, itemTemplate())
      console.error('Tabs面板出现空的组件值，已自动处理，替换为Placeholder组件。')
    }
    subInstIndex++
  })
}
clearNullChild()

const setHasBeenLoad = (tabItem: TabItem) => {
  // console.log('GlTabs > setHasBeenLoad() > tabItem:', tabItem)
  if(tabItem){
    tabItem.hasBeenLoad = true
  }
}
/**
 *  设置当前tabs的默认值，是选中哪一个
 *  若无选中值，初始化选中第一个
 */
const setSelectTab = () => {
  const foundTabItem = tabItems.value.find((tabItem: TabItem) => {
    return tabItem.value === mv.value
  })
  // console.log('setSelectTab() > val:', mv.value, 'foundTabItem:', foundTabItem)

  if (foundTabItem) {
    setHasBeenLoad(foundTabItem)
    itemMv.value = foundTabItem
  } else {
    // 若无选中值，初始化选中第一个
    if (tabItems.value.length > 0) {
      // (mv.value == undefined || mv.value == '') &&
      setHasBeenLoad(tabItems.value[0])
      mv.value = tabItems.value[0].value
      itemMv.value = tabItems.value[0]
      console.log('GlTabs > setSelectTab() :无选中值，或值无效，初始化选中第一个，第一个值为：', mv.value)
    } else {
      itemMv.value = { hideRightTopSlot: false }
    }
  }
}

// 移动tabItem之后，当前mv对应的tabPane是否有变化，有的话，需要刷新页面
const currentTabPaneChanged = ref(false)

let lastTabIndexMap: Record<string, number> = {}
const snapshot = () => {
  lastTabIndexMap = {}
  tabItems.value.forEach((tabItem: TabItem, index: number) => {
    lastTabIndexMap[tabItem.title + '_' + tabItem.value] = index
  })
}

const checkItemTabPositionAndSyncTabPane = () => {
  // 分析是否有效的位置变化，所有的key都存在，没有新的key（即修改值和名称时不记入位置调整）
  for (const tabItem of tabItems.value) {
    if (!Object.keys(lastTabIndexMap).includes(tabItem.title + '_' + tabItem.value)) {
      console.log('出现新的tabItemKey(title+"_"+value),不是tabs位置变化，不进行tabPane同步移动。')
      return
    }
  }

  // 同步移动tabPane
  const sortedInsts: ComponentInstance[] = []
  tabItems.value.forEach((tabItem: TabItem, index: number) => {
    const lastIndex = lastTabIndexMap[tabItem.title + '_' + tabItem.value]
    sortedInsts.push(props.glComponentInst.children[lastIndex])
    if (lastIndex != index && mv.value == lastIndex) {
      currentTabPaneChanged.value = true
    }
  })
  props.glComponentInst.children.length = 0
  props.glComponentInst.children.push(...sortedInsts)
  // 刷新
  if (currentTabPaneChanged.value) {
    nextTick(() => {
      currentTabPaneChanged.value = false
    })
  }
}

watch(
  () => {
    return props.items
  },
  (val, oldValue) => {
    // console.log('props.items', val, oldValue)
    tabItems.value = props.items || []
    tabItems.value.forEach((item: TabItem, index: number) => {
      item.value = item.value || index + 1 + ''
    })
    setSelectTab()
    // 检查items数组的变化
    if (tabItems.value.length !== Object.keys(lastTabIndexMap).length) {
      // 长度变化
      if (Object.keys(lastTabIndexMap).length < tabItems.value.length) {
        // 变长了，添加tabPane
        props.glComponentInst.children.push(itemTemplate())
      } else {
        // 变短了，是第几个删除了，同步删除对应的tabPane
        Object.keys(lastTabIndexMap)?.forEach((key: string) => {
          const existItem = tabItems.value.find((tabItem) => {
            return key === tabItem.title + '_' + tabItem.value
          })
          // 找出哪个不存在的，删除了
          if (!existItem) {
            const deleteIndex = lastTabIndexMap[key]
            props.glComponentInst.children.splice(deleteIndex, 1)
            delete lastTabIndexMap[key]
            // console.log('删除tab', deleteIndex,props.glComponentInst.children,lastTabIndexMap)
          }
        })
      }
    } else {
      // 位置比较
      checkItemTabPositionAndSyncTabPane()
    }
    snapshot()
  },
  { deep: true }
)

const onTabClick = (key: string | number) => {
  const foundItem = tabItems.value.find((item: TabItem) => {
    return item.value == key
  })
  if (foundItem && !foundItem.disabled) {
    setHasBeenLoad(foundItem)
    mv.value = key
    setSelectTab()
  }
}

watch(
  () => {
    return props.glComponentInst.value
  },
  (value) => {
    // @ts-ignore
    mv.value = value
  }
)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const getValue = () => {
  return mv.value
}
const selectByValue = (params: { value?: string | number }) => {
  const found = tabItems.value.find((tabItem: TabItem) => {
    return tabItem.value === params.value
  })
  if (found) {
    mv.value = params?.value
  } else {
    useGlobal().$notification.error({
      content: `标签页中无该值(${params?.value})，选择切换标签页无效。`
    })
  }
  return true
}
const selectByIndex = (params: { index: number }) => {
  if (tabItems.value.length > 0) {
    if (params?.index > tabItems.value.length - 1) {
      useGlobal().$notification.error({
        content: `选择的标签页索引(${params?.index})超出了范围，选择切换标签页无效。`
      })
    }
    mv.value = tabItems.value[params?.index].value
  }
  return true
}

const fixedClass = computed(() => {
  if(props.glIsRuntime){
    const className = `gl-fixed-${props.position || 'top'}`
    if (props.enableFixedTitle && ['left', 'top'].includes(props.position || '')) {
      return { 'gl-fixed': true, [className]: true }
    }
  }
  return {}
})

// 先snapshot
snapshot()
onMounted(() => {
  setSelectTab()
})

defineExpose({ getValue, selectByValue, selectByIndex })
</script>
<template>
  <a-tabs
    class="gl-tabs"
    :class="fixedClass"
    v-if="!currentTabPaneChanged"
    :position="position"
    :active-key="mv"
    @tabClick="onTabClick"
  >
    <template #extra>
      <div v-show="!(itemMv.hideRightTopSlot === true)">
        <slot name="extra"></slot>
      </div>
    </template>
    <a-tab-pane class="gl-tab-pane" v-for="(item, index) in tabItems" :key="item.value" :disabled="item.disabled">
      <template #title>
        <GlIconfont v-if="item.iconType" :type="item.iconType" />
        {{ item.title }}
      </template>
      <div v-if="!item.lazyLoad || (item.lazyLoad === true && item.hasBeenLoad)">
        <component
          v-if="glComponentInst?.children[index]"
          :is="'GlInsts' + glRuntimeFlag"
          :glComponentInst="glComponentInst?.children[index]"
          :glIsRuntime="glIsRuntime"
          :glRuntimeFlag="glRuntimeFlag"
        ></component>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>
<style>
.gl-tabs {
  background-color: white;
}

body[arco-theme='dark'] .gl-tabs {
  background-color: var(--color-bg-3);
}

.gl-tabs.gl-fixed > .arco-tabs-nav {
  position:fixed;
  z-index: 20;
}
.gl-tabs.gl-fixed-top > .arco-tabs-nav {
  width: 100%;
}

.gl-tabs.gl-fixed-top > .arco-tabs-content {
  margin-top: 40px;
}

.gl-tabs.gl-fixed-left > .arco-tabs-content {
  margin-left: 75px;
}
.gl-tabs.gl-fixed-left > .arco-tabs-nav > .arco-tabs-nav-tab {
  flex:inherit;
  height: auto;
}

.gl-tab-pane{
  padding: 0 14px;
}

</style>
