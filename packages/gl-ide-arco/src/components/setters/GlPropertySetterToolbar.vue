<script lang="ts">
export default {
  name: 'GlPropertySetterToolbar'
}
</script>
<script lang="ts" setup>

import {componentStoreFactory} from "@geelato/gl-ide";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({

  componentStoreId: {
    type: String,
    required: true
  }
})
const componentStore = componentStoreFactory.useComponentStore(props.componentStoreId)
</script>

<template>
  <div style="border-bottom: 1px solid #F2F2F2;padding: 0.5em;">
          <span style="font-weight: 600">
            {{ componentStore.currentSelectedComponentMeta?.title }}
          </span>
    <a-button-group style="float: right" type="primary" size="mini" shape="round">
      <a-button @click="componentStore.switchCurrentSelectedComponentStatus()"
                title="点击启用或停用该指令块">
        {{ componentStore.currentSelectedComponentInstance?._disabled === true ? '点击启用' : '点击停用' }}
      </a-button>
      <a-button status="danger" @click="componentStore.deleteCurrentSelectedComponentInst">删除</a-button>
    </a-button-group>
  </div>
</template>

<style scoped>

</style>
