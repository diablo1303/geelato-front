<template>
  <div class="gl-app-tree">
    <GlEntityTree></GlEntityTree>
  </div>
</template>
<script lang="ts">
export default {
  name: "AppTree",
};
</script>
<script setup lang="ts">
import {useIdeStore, Page} from "@geelato/gl-ide";
import {ref} from "vue";

// treeId，即project表中的id
const treeId = ref('1976169388038462609')
const ideStore = useIdeStore()


const onSelect = (selectedKeys: Array<string | number>, data: any) => {
  console.log('selectedKeys,data:', selectedKeys, data)
  const dataRef = data.node
  ideStore.openPage(<Page>{
    type: dataRef.nodeType,
    id: dataRef.key,
    title: dataRef.title,
    iconType: dataRef.iconType
  })
}

const onIconClick = (nodeData: any) => {
  console.log('onIconClick:', nodeData)
  ideStore.openPage(<Page>{
    type: nodeData.nodeType,
    id: nodeData.key,
    title: nodeData.title,
    iconType: nodeData.iconType
  })
}

</script>
<style>
.gl-app-tree {
  margin: 8px 0 0 8px;
}
</style>
