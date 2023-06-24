<script lang="ts">
export default {
  name: 'GlTabs'
}
</script>
<script setup lang="ts">

import {mixins, utils} from "@geelato/gl-ui";
import {nextTick, onMounted, onUpdated, type PropType, ref, watch} from "vue";

const emits = defineEmits(['update:modelValue','update:items'])

class TabItem {
  title: string = ''
  iconType: string = ''
}

const props = defineProps({
  modelValue: [String, Number],
  items: {
    type: Array as PropType<Array<TabItem>>
  },
  // defaultActiveKey: {
  //   type: Number,
  //   default() {
  //     return 0
  //   }
  // },
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

const mv = ref(props.modelValue)
const onTabClick = (key: any) => {
  mv.value = key
}
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
onMounted(() => {
  onTabClick(0)
})

</script>
<template>
  <div>
    <a-tabs :active-key="mv">
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
        <component v-if="glComponentInst.children[index]" :is="'GlInsts'+glRuntimeFlag"
                   :glComponentInst="glComponentInst.children[index]"
                   :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag"></component>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped>

</style>
