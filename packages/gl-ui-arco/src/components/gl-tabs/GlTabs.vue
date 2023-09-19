<script lang="ts">
export default {
  name: 'GlTabs'
}
</script>
<script setup lang="ts">

import {mixins, utils} from "@geelato/gl-ui";
import {nextTick, onMounted, onUpdated, type PropType, type Ref, ref, watch} from "vue";
import type {ComponentInstance} from "@geelato/gl-ui-schema";

const emits = defineEmits(['update:modelValue', 'update:items'])

class TabItem {
  title: string = ''
  iconType: string = ''
  value: string = ''
  disabled?: boolean = false
}

const props = defineProps({
  modelValue: [String, Number],
  items: {
    type: Array as PropType<Array<TabItem>>
  },
  // position: String,
  // type: String,
  // direction: String,
  ...mixins.props
})

// console.log('props.items:', props.items)
const tabItems: Ref<TabItem[]> = ref(props.items || [])
if (tabItems.value.length === 0) {
  tabItems.value.push(...[{
    title: '标题1', iconType: '', value: '0'
  }, {
    title: '标题2', iconType: '', value: '1'
  }])
}

const mv = ref(props.modelValue)
// 初始化选中第一个
if (!mv.value && tabItems.value.length > 0) {
  mv.value = tabItems.value[0].value
}
// 移动tabItem之后，当前mv对应的tabPane是否有变化，有的话，需要刷新页面
const currentTabPaneChanged = ref(false)

const lastTabIndexMap: Record<string, number> = {}
const snapshot = () => {
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

// 先snapshot
snapshot()

watch(() => {
  return props.items
}, (val, oldValue) => {
  console.log('props.items', val, oldValue)
  tabItems.value = props.items || []
  tabItems.value.forEach((item: TabItem, index: number) => {
    item.value = item.value || (index + '')
  })
  if (!mv.value && tabItems.value.length > 0) {
    mv.value = tabItems.value[0].value
  }
  // 检查items数组的变化
  if (tabItems.value.length !== Object.keys(lastTabIndexMap).length) {
    // 长度变化
    // 不做处理
  } else {
    // 位置比较
    checkItemTabPositionAndSyncTabPane()
  }
  snapshot()
}, {deep: true})

// console.log('mv.value', mv.value)

const placeholderTemplate = () => {
  return {
    "id": utils.gid('ph'),
    "componentName": "GlDndPlaceholder",
    "title": "占位符",
    "props": {},
    "slots": {},
    "children": []
  }
}
const itemTemplate = () => {
  return {
    "id": utils.gid('virtual'),
    "componentName": "GlVirtual",
    "title": "项",
    "props": {},
    "slots": {},
    "children": [
      {
        "id": utils.gid('ph'),
        "componentName": "GlDndPlaceholder",
        "title": "占位符",
        "props": {},
        "slots": {},
        "children": []
      }
    ]
  }
}

onUpdated(() => {
  updateInst()
})


const updateInst = () => {
  if (props.glComponentInst.children && props.glComponentInst.children.length != tabItems.value.length) {
    while (props.glComponentInst.children.length < tabItems.value.length) {
      props.glComponentInst.children.push(JSON.parse(JSON.stringify(itemTemplate())))
    }
    props.glComponentInst.children.length = tabItems.value.length
    nextTick(() => {
    })
  }
}

updateInst()


const onTabClick = (key: string | number) => {
  const foundItem = tabItems.value.find((item: TabItem) => {
    return item.value == key
  })
  if (foundItem && !foundItem.disabled) {
    mv.value = key
  }
}

watch(()=>{
  return props.glComponentInst.value
}, (value) => {
  // @ts-ignore
  mv.value = value
})
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

// 默认选中第一项
onMounted(() => {
  if (tabItems.value.length > 0) {
    mv.value = tabItems.value[0].value
  }
})

</script>
<template>
  <a-tabs class="gl-tabs" v-if="!currentTabPaneChanged" :active-key="mv" @tabClick="onTabClick"
          style="background-color:white">
    <template #extra>
      <div>
        <slot name="extra"></slot>
      </div>
    </template>
    <a-tab-pane v-for="(item,index) in tabItems" :key="item.value" :disabled="item.disabled">
      <template #title>
        <GlIconfont v-if="item.iconType" :type="item.iconType"/>
        {{ item.title }}
      </template>
      <component v-if="glComponentInst.children[index]" :is="'GlInsts'+glRuntimeFlag"
                 :glComponentInst="glComponentInst.children[index]"
                 :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag"></component>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped>

</style>
