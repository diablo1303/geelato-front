<template>
  <div>
    <a-alert>当前页操作记录-最多{{pageStore.currentPageHistory.maxSteps}}步</a-alert>
    <div class="gl-history-item" v-for="(item,index) in reverseItems">
      <span>{{ reverseItems.length - index }}.</span>
      <span :title="`【${item.createAt}】${item.description}`">{{ item.title }}</span>
      <!--      <span style="float: right">{{ item.createAt }}</span>-->
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, ref} from "vue";
import {usePageStore} from "@geelato/gl-ide";

function reverseArray(arr: Array<any>) {
  const newArr = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    newArr.push(arr[i]);
  }
  return newArr;
}

const pageStore = usePageStore()
const reverseItems = computed(() => {
  return reverseArray(pageStore.currentPageHistory.stack)
})

</script>
<script lang="ts">
export default {
  name: "GlIdePluginCoreHistory"
}
</script>

<style>
.gl-history-item {
  padding: 0.2em;
}

.gl-history-item:hover {
  cursor: pointer;
  background-color: #e6e6e6;
}
</style>
