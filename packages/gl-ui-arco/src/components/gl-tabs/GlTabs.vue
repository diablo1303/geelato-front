<script lang="ts">
export default {
  name: 'GlTabs'
}
</script>
<script setup lang="ts">

import {mixins, utils} from "@geelato/gl-ui";
import {nextTick, onMounted, onUpdated, type PropType, ref} from "vue";

const emits = defineEmits(['update:items'])

class TabItem {
  title: string = ''
  iconType: string = ''
}

const props = defineProps({
  items: {
    type: Array as PropType<Array<TabItem>>
  },
  defaultActiveKey: {
    type: Number,
    default() {
      return 0
    }
  },
  ...mixins.props
})

console.log('props.items:', props.items)
const tabItems = ref(props.items || [])
if (tabItems.value.length === 0) {
  tabItems.value.push(...[{
    title: '标题1', iconType: ''
  }, {
    title: '标题2', iconType: ''
  }])
}

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

// if (!props.glIsRuntime) {
//   props.glComponentInst.slots = props.glComponentInst.slots || {}
//   props.glComponentInst.slots.extra = props.glComponentInst.slots.extra || JSON.parse(JSON.stringify(placeholderTemplate()))
// }
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

const activeKey = ref(props.defaultActiveKey || 0)
const onTabClick = (key: any) => {
  activeKey.value = key
}
onMounted(() => {
  onTabClick(0)
})
const xx = false
</script>
<template>
  <a-tabs :active-key="activeKey">
    <template #extra>
      <div>
        <slot name="extra"></slot>
      </div>
    </template>
    <a-tab-pane v-for="(item,index) in tabItems" :key="index">
      <template #title>
      <span @click="onTabClick(index)">
        <GlIconfont v-if="item.iconType" :type="item.iconType"/>
      {{ item.title }}
      </span>
      </template>
      <component v-if="glComponentInst.children[index]" :is="'GlInsts'+glRuntimeFlag" :glComponentInst="glComponentInst.children[index]"
                 :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag"></component>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped>

</style>