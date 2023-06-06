<template>
  <a-tree-select :data="treeData"
                 v-model="selected"
                 placeholder="请选择"
                 :allow-search="true"
                 :allow-clear="true"
                 :filter-tree-node="filterTreeNode"
  ></a-tree-select>
</template>

<script lang="ts">
export default {
  name: 'GlPageSelect'
}
</script>
<script lang="ts" setup>
import {inject, ref, watch} from "vue";
import {entityApi, Utils} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  /**
   *  应用页面节点id
   */
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})

const selected = ref(typeof props.modelValue === 'string' ? props.modelValue : '')

watch(selected, () => {
  console.log('update:modelValue:', selected.value)
  emits('update:modelValue', selected.value)
}, {immediate: true})
const treeData = ref<any>([])

const filterTreeNode = (searchValue: string, nodeData: any) => {
  return nodeData.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
}

// inject('appId')
// TODO 需改成基于上下文获取
const appId = '1976169388038462609'
entityApi.query('platform_tree_node', 'treeId,id key,text title,pid,iconType,type nodeType,flag,seqNo', {treeId: appId}, false).then((res: any) => {
  // console.log('platform_tree_node:', res)
  treeData.value = []
  treeData.value.push(...Utils.ConvertUtil.listToTree({
    data: res.data.result || res.data.data,
    pid: appId,
    renameId: 'key',
    compareFn: (a: any, b: any) => {
      const aSeq = a.seqNo || 0
      const bSeq = b.seqNo || 0
      return aSeq - bSeq
    }
  }))
})
</script>

<style scoped>

</style>
