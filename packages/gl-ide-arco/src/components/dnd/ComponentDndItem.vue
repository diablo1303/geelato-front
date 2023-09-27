<script lang="ts">
export default {
  name: "ComponentDndItem"
}
</script>
<script lang="ts" setup>
import {computed, type PropType} from "vue";
import {useDrag} from 'vue3-dnd'
import {ItemTypes} from "./DndItemTypes";
import {SizeType} from "../setters/Types";

const props = defineProps({
  element: {
    type: Object,
    required: true
  },
  templateInst: Object,
  size: {
    type: String as PropType<SizeType>,
    default() {
      return SizeType.small
    }
  },
})

const fontSize = computed(() => {
  switch (props.size) {
    case SizeType.normal:
      return '3em'
    case SizeType.small:
      return '2em'
    case SizeType.mini:
      return '1em'
    default:
      return '2em'
  }
})

const [, drag] = useDrag(() => ({
  type: ItemTypes.Item,
  item: () => ({
    ...props.templateInst,
  }),
}))
</script>

<template>
  <div :ref="drag" class="gl-card"
       :class="{'gl-dnd-item-template-handle':element.meta.properties?.length>0}"
       :style="{'cursor':element.meta.properties?.length>0?'move':''}">
    <div class="gl-image">
      <GlIconfont :type="element.iconType"
                  :iconStyle="{fontSize,color:(element.meta.properties?.length>0?'#1890ff':'#e7e7e7')}"></GlIconfont>
    </div>
    <div class="gl-title">{{ element.title }}</div>
  </div>
</template>
