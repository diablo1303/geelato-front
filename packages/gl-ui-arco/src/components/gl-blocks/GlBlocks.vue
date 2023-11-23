<script lang="ts">
export default {
  name: 'GlBlocks'
}
</script>
<script lang="ts" setup>
import {type PropType, type Ref, ref, watch} from 'vue'
import { entityApi, EntityReader } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue', 'click'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   * 数据实体
   */
  entityReader: {
    type: Object as PropType<EntityReader>,
    required: true
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const items: Ref<Record<string, any>[]> = ref([])
const loadData = () => {
  if (props.entityReader) {
    entityApi.queryByEntityReader(props.entityReader).then((res: any) => {
      items.value = res.data
    })
  }
}

const onClick = (item: any) => {
  emits('click', item)
}

loadData()
</script>

<template>
  <div class="gl-blocks">
    <a-card
      v-for="item in items"
      hoverable
      style="display: inline-block; margin-left: 8px"
      :style="{ width: '240px', marginBottom: '20px' }"
      @click="onClick(item)"
    >
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }"
      >
        <span :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
          <a-avatar :style="{ backgroundColor: '#168CFF' }">
            <gl-iconfont :type="item.icon"></gl-iconfont>
          </a-avatar>
          <a-typography-text style="margin-left: 12px">{{ item.name }}</a-typography-text>
        </span>
        <!--        <a-link>More</a-link>-->
      </div>
    </a-card>
  </div>
</template>

<style scoped></style>
