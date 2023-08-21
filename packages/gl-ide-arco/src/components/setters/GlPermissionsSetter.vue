<script lang="ts">
export default {
  name: 'GlPermissionsSetter'
}
</script>
<script lang="ts" setup>

import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const permissionInvisibleRoles: any[] = []
</script>

<template>
  <div>
    <a-collapse :default-active-key="['1']" :bordered="false">
      <a-collapse-item header="设置无权看到本组件的角色" :key="'1'">
        <template #extra>
          <a-tag size="small" color="blue">1个</a-tag>
        </template>
        <div v-for="(action,actionIndex) in permissionInvisibleRoles" class="gl-action-item">
          <div class="gl-title">
            {{ action.title }}：{{ action.name }}
          </div>
          <div style="flex: 0 0 2em;text-align: center;line-height: 2em">
            <GlIconfont type="gl-thunderbolt" class="gl-active" style="cursor: pointer"/>
          </div>
        </div>
      </a-collapse-item>
      <a-collapse-item header="设置无权编辑该组件的角色" :key="'2'">
        <template #extra>
          <a-tag size="small" color="blue">0个</a-tag>
        </template>
        <div v-for="(action,actionIndex) in permissionInvisibleRoles" class="gl-action-item">
          <div class="gl-title">
            {{ action.title }}：{{ action.name }}
          </div>
          <div style="flex: 0 0 2em;text-align: center;line-height: 2em">
            <GlIconfont type="gl-thunderbolt" class="gl-active" style="cursor: pointer"/>
          </div>
        </div>
      </a-collapse-item>
    </a-collapse>
  </div>
</template>

<style scoped>
</style>
