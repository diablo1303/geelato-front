<script lang="ts">
export default {
  name: "GlComponentTree"
}
</script>
<script setup lang="ts">
import {useIdeStore} from "@geelato/gl-ide";
import {computed, ref, watch} from "vue";

const componentStore = useIdeStore().componentStore
const componentTree = ref()

/**
 *  tree数据字段和组件树的字段进行转换
 */
const treeFieldNames = {
  key: 'id',
  title: 'componentName',
}
const selectedKeys = ref([])

/**
 *  选择一个节点，可能是点击选择，也可以是新增之后选择
 *  并触发selectNode事件，将当前的节点为作参数
 */
const selectNode = (node: any) => {
  console.log('selectNode', node)
  // 定位到新增的节点
  selectedKeys.value = []
  // @ts-ignore
  selectedKeys.value.push(node.id)
  console.log('selectedKeys', selectedKeys.value)
  componentStore.setCurrentSelectedComponentById(node.id)
  // emits('selectNode', {selectedNode:node})
}

const searchKey = ref('');
const treeData = computed(() => {
  if (!searchKey.value) return componentStore.currentComponentTree;
  return searchData(searchKey.value);
})

const searchData = (keyword: String) => {
  const loop = (data: Array<any>) => {
    const result: Array<any> = [];
    data.forEach(item => {
      if (item.componentName.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
        result.push({...item});
      } else if (item.children) {
        const filterData = loop(item.children);
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result;
  }

  return loop(componentStore.currentComponentTree);
}

function getMatchIndex(componentName: String) {
  if (!searchKey.value) return -1;
  return componentName?.toLowerCase().indexOf(searchKey.value.toLowerCase());
}
</script>


<template>
  <div>
    <a-input-search
        style="margin-bottom: 8px; max-width: 240px"
        v-model="searchKey"
    />
    <a-tree ref="componentTree" :data="treeData"
            :field-names="treeFieldNames"
            :selectedKeys="selectedKeys">
      <template #title="nodeData">
        <span @click="selectNode(nodeData)">
          <template v-if="index = getMatchIndex(nodeData?.componentName), index < 0">{{
              nodeData?.componentName
            }}
        </template>
        <span v-else>
          {{ nodeData?.componentName?.substr(0, index) }}
          <span style="color: var(--color-primary-light-4);">
            {{ nodeData?.componentName?.substr(index, searchKey.length) }}
          </span>{{ nodeData?.componentName?.substr(index + searchKey.length) }}
        </span>
        </span>
      </template>
    </a-tree>
  </div>
</template>

<style scoped>

</style>
