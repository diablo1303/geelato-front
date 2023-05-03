<script lang="ts">
export default {
  name: "ComponentDndItem"
}
</script>
<script lang="ts" setup>
import {useDrag} from 'vue3-dnd'
import {computed, PropType} from "vue";
import {ItemTypes} from "./DndItemTypes";

const props = defineProps({
  element: Object,
  templateInst: Object,
  size: {
    type: String as PropType<SizeType>,
    default() {
      return 'small'
    }
  },
})

const enum SizeType {
  normal = 'normal',
  small = 'small',
  mini = 'mini'
}

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

<style lang="less" scoped>

</style>