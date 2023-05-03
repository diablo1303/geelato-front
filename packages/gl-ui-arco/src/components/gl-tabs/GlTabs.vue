<script lang="ts">
export default {
  name: 'GlTabs'
}
</script>
<script setup lang="ts">

import {mixins, utils} from "@geelato/gl-ui";
import {nextTick, onMounted, onUpdated, ref, watch} from "vue";

const emits = defineEmits(['update:items'])
const props = defineProps({
  items: {
    type: Array
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

const activeKey = ref(props.defaultActiveKey || 0)
const onTabClick = (key: any) => {
  console.log(typeof key, key)
  activeKey.value = key
}
onMounted(() => {
  onTabClick(0)
})
</script>
<template>
  <a-tabs :active-key="activeKey">
    <a-tab-pane v-for="(item,index) in tabItems" :key="index">
      <template #title>
      <span @click="onTabClick(index)">
        <GlIconfont v-if="item.iconType" :type="item.iconType"/>
      {{ item.title }}
      </span>
      </template>
      <GlInsts :glComponentInst="glComponentInst.children[index]"/>
    </a-tab-pane>

    <!--    <GlInsts v-for="(item,index) in tabItems" :key="index" :glComponentInst="glComponentInst.children[index]"/>-->

    <!--    <GlTab v-for="(item,index) in tabItems" :key="index" :title="item.title" :iconType="item.iconType"-->
    <!--           :glComponentInst="glComponentInst.children[index]" @tabClick="onTabClick(index)">-->
    <!--    </GlTab>-->
  </a-tabs>
</template>

<style scoped>

</style>
