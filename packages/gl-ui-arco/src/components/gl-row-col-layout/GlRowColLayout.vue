<script lang="ts">
export default {
  name: "GlRowColLayout"
}
</script>
<script setup lang="ts">
import {computed, nextTick, onUpdated, PropType, ref} from "vue";
import {mixins, utils} from "@geelato/gl-ui";


const props = defineProps({
  spans: {
    type: Array as PropType<Array<Number>>,
    default() {
      return [8, 8, 8];
    },
  },
  offsets: {
    type: Array as PropType<Array<Number>>,
    default() {
      return [0, 0, 0];
    },
  },
  gutter: {
    type: String,
    default() {
      return "16";
    },
  },
  /**
   * 通过 justify 来进行水平布局。
   */
  justify: {
    type: String
  },
  /**
   * 通过 align 来进行垂直布局
   */
  align: {
    type: String
  },
  /**
   * Col 是否支持换行
   */
  wrap: {
    type: String
  },
  ...mixins.props
});


const colTemplate = () => {
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

const updateInst = () => {
  if (props.glComponentInst.children && props.glComponentInst.children.length != props.spans.length) {
    // console.log('colSpans:', colSpans)
    while (props.glComponentInst.children.length < props.spans.length) {
      props.glComponentInst.children.push(JSON.parse(JSON.stringify(colTemplate())))
    }
    props.glComponentInst.children.length = props.spans.length
    nextTick(() => {
    })
  }
}
onUpdated(() => {
  updateInst()
})

updateInst()


</script>

<template>
  <a-row :gutter="gutter">
    <a-col
        v-for="(span, index) in spans"
        :key="index"
        :span="span"
    >
      <GlInsts :glComponentInst="glComponentInst.children[index]"/>
    </a-col>
  </a-row>
</template>

<style scoped></style>
