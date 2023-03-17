<script lang="ts">
export default {
  name: "GlRow"
}
</script>
<script setup lang="ts">
import {mixins, utils} from "@geelato/gl-ui";
import {computed, getCurrentInstance, nextTick, onUpdated, PropType, ref, watch} from "vue";

const props = defineProps({
  spans: {
    type: Array as PropType<Array<Number>>,
    default() {
      return [8, 8, 8];
    },
  },
  gutter: {
    type: String,
    default() {
      return "16px";
    },
  },
  ...mixins.props
});
const colSpans = ref(props.spans)
onUpdated(() => {
  if (props.glComponentInst.children && props.glComponentInst.children.length != colSpans.value.length) {
    console.log('colSpans:', colSpans)

    while (props.glComponentInst.children.length < colSpans.value.length) {
      props.glComponentInst.children.push(JSON.parse(JSON.stringify(colTemplate)))
    }
  }
})

const colTemplate = {
  "id":utils.gid('16'),
  "componentName": "GlCol",
  "title": "列",
  "props": {},
  "slots": {},
  "children": [
    {
      "componentName": "GlDndPlaceholder",
      "title": "占位符",
      "props": {},
      "slots": {},
      "children": []
    }
  ]
}

// defineExpose();
</script>

<template>
  <!--  通过:key="colSpans.length"的变化来刷新-->
  <a-row :gutter="gutter" :key="colSpans.length">
    <GlComponent v-for="(colSpan,index) in colSpans" class="gl-dnd-item gl-x-item"
                 :glComponentInst="glComponentInst.children[index]" :span="colSpan">
    </GlComponent>
  </a-row>
</template>

<style scoped></style>
