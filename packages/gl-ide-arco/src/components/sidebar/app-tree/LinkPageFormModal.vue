<script lang="ts">
export default {
  name: 'LinkPage'
}
</script>
<script lang="ts" setup>
import { ref, watch,defineProps, defineEmits } from 'vue'
import { entityApi, EntitySaver } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue', 'update:visible', 'saveNode'])
const props = defineProps({
  modelValue: {
    type: Object,
    default() {
      return { id: '', pid: '', title: '', url: '' }
    }
  },
  visible: Boolean,
  treeId: String
})
const formRef = ref()
const visibleMv = ref(props.visible)
watch(
  () => props.visible,
  () => {
    visibleMv.value = props.visible
  }
)
watch(visibleMv, () => {
  console.log('visibleMv', visibleMv.value)
  emits('update:visible', visibleMv.value)
})

const mv = ref(props.modelValue)
watch(
  mv,
  () => {
    emits('update:modelValue', mv.value)
  },
  { deep: true }
)

const onBeforeOk = () => {
  return formRef.value?.validate().then((values: any) => {
    console.log('onBeforeOk', values)
    // values为空，表示验证成功
    if (!values) {

      const nodeSaver: EntitySaver = new EntitySaver()
      nodeSaver.entity = 'platform_tree_node'
      nodeSaver.record = {
        id: mv.value.id,
        flag: 'menuItem',
        iconType: 'gl-link',
        type: 'link',
        treeId: props.treeId,
        text: mv.value.title,
        pid: mv.value.pid,
        url: mv.value.url
      }

      return entityApi.saveEntity(nodeSaver).then(
        (res) => {
          const node = {
            title: nodeSaver.record.title,
            iconType: nodeSaver.record.iconType,
            treeId: nodeSaver.record.treeId,
            key:  nodeSaver.record.id,
            _nodeType:'link',
            url: mv.value.url
          }
          emits('saveNode', node)
          return true
        }
      )
    } else {
      return false
    }
  })
}

const handleCancel = () => {
  visibleMv.value = false
}
</script>

<template>
  <a-modal
    width="800px"
    v-model:visible="visibleMv"
    :onBeforeOk="onBeforeOk"
    @cancel="handleCancel"
  >
    <template #title>编辑页面链接</template>
    <a-form ref="formRef" :model="mv">
      <a-form-item
        field="title"
        tooltip="菜单节点名称"
        label="页面名称"
        :rules="[{ required: true, message: '必填' }]"
      >
        <a-input v-model="mv.title" placeholder="" />
      </a-form-item>
      <a-form-item
        field="url"
        tooltip="打开的链接地址"
        label="页面地址"
        :rules="[{ required: true, message: '必填' }]"
      >
        <a-input v-model="mv.url" placeholder="如：https://www.geelato.cn" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
