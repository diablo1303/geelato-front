<script lang="ts">
export default {
  name: 'GlExpressionVarsTree'
}
</script>
<script lang="ts" setup>
import { computed, type PropType, ref } from 'vue'
import type { TreeNodeData } from '@arco-design/web-vue'

const emits = defineEmits(['update:select'])
const props = defineProps({
  data: {
    type: Object as PropType<TreeNodeData[]>,
    default() {
      return []
    }
  }
})

const searchKey = ref('')
const originTreeData = props.data
const treeData = computed(() => {
  if (!searchKey.value) return originTreeData
  return searchData(searchKey.value)
})

const searchData = (keyword: string) => {
  const loop = (data: any) => {
    const result: any[] = []
    data.forEach((item: any) => {
      if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
        result.push({ ...item })
      } else if (item.children) {
        const filterData = loop(item.children)
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result
  }

  return loop(originTreeData)
}

const getMatchIndex = (title: string) => {
  if (!searchKey.value) return -1
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase())
}

const onSelect = (selectedKeys: any[], data: any) => {
  emits('update:select', selectedKeys, data)
}
</script>

<template>
  <!--    <a-input-search size="small" style="margin-bottom: 8px;" v-model="searchKey" />-->
  <a-tree :default-expanded-keys="[]" size="small" blockNode :data="data" @select="onSelect">
    <template #title="{ _code, title, _value, _description }">
      <a-tooltip v-if="_description" background-color="#165DFF" position="right">
        <template #content>
          {{ _description }}
        </template>
        <span
          >{{ _code }}
          <!--  title和_code相同，则只显示_code -->
          <span class="gl-title" style="margin-left: 0 !important">{{
            title === _code ? '' : title
          }}</span>
        </span>
      </a-tooltip>
      <template v-else>
        <span
          >{{ _code }}
          <!--  title和_code相同，则只显示_code -->
          <span class="gl-title" style="margin-left: 0 !important">{{
            title === _code ? '' : title
          }}</span>
        </span>
      </template>
    </template>
    <template #extra="{ _type }">
      <slot name="extra"></slot>
      <span class="gl-extra">{{ _type }}</span>
    </template>
  </a-tree>
</template>

<style scoped></style>
