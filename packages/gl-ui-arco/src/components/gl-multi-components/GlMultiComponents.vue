<script lang="ts">
export default {
  name: 'GlMultiComponents'
}
</script>
<script lang="ts" setup>

import {nextTick, onMounted, type PropType, ref, watch} from "vue";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import {mixins} from "@geelato/gl-ui";

type TagSize = "medium" | "large" | "small" | undefined
type ItemType = { inst: ComponentInstance, showInTag: boolean }
type ValueItemType = { label: string | undefined, value: string | undefined }
type ModelProps = Array<ValueItemType>

const emits = defineEmits(['update:modelValue'])
const props = defineProps({

  modelValue: {
    type: Array as PropType<Array<ModelProps>>,
    default() {
      return []
    }
  },
  _labelColFlex: String,
  /**
   *  每一组组件的配置项
   */
  items: {
    type: Array as PropType<Array<ItemType>>,
    default() {
      return []
    }
  },
  jointMark: {
    type: String,
    default() {
      return '-'
    }
  },
  tagColor: {
    type: String,
    default() {
      return 'blue'
    }
  },
  tagSize: {
    type: String as PropType<TagSize>,
    default() {
      return 'large'
    }
  },
  extraComponent: Object as PropType<ComponentInstance>,
  ...mixins.props
})

console.log('props',props,props.modelValue)
const mv = ref<Array<ModelProps>>([])
const isAdd = ref(false)
watch(()=>{
  return props.modelValue
},()=>{
  mv.value = props.modelValue || []
})

watch(mv, () => {
  emits('update:modelValue', mv.value)
}, {deep: true})

const visible = ref(false)

/**
 * 基于一组配置项内容，生成用于界面展示的文本，即把多个配置值合并在一起
 * @param modelProps
 * @param index
 */
const genText = (modelProps: ModelProps, index: number) => {
  const text: Array<string> = []
  modelProps.forEach((modelProp) => {
    const foundItem = props.items.find((item) => {
      return item.inst.props.label === modelProp.label
    })
    if (foundItem?.showInTag) {
      text.push(modelProp.value ? modelProp.value.toString() : '')
    }
  })
  return text.join(props.jointMark)
}

const currentModelProps = ref<ModelProps>([])
const refreshFlag = ref(true)
const refresh = () => {
  refreshFlag.value = false
  nextTick(() => {
    refreshFlag.value = true
  })
}
watch(() => {
  return visible
}, () => {
  if (!visible.value) {
    refresh()
  }
})
const clickTag = (modelProps: ModelProps, index: number) => {
  isAdd.value = false
  // 打开配置页面
  currentModelProps.value = modelProps
  props.items.forEach((item) => {
    const foundProp = modelProps.find((modelProp) => {
      return modelProp.label === item.inst.props.label
    })
    console.log('foundProp:', foundProp)
    if (foundProp) {
      // @ts-ignore
      item.inst.value = foundProp.value
    }
  })
  visible.value = true
}

const setCurrentModel = () => {
  currentModelProps.value.length = 0
  props.items.forEach((item) => {
    // @ts-ignore
    currentModelProps.value.push({label: item.inst.props.label, value: item.inst.value})
    item.inst.value = undefined
  })
}

const closeTag = (modelProps: ModelProps, index: number) => {
  mv.value.splice(index, 1)
  refresh()
}

const showAddTag = () => {
  isAdd.value = true
  props.items.forEach((item) => {
    item.inst.value = undefined
  })
  currentModelProps.value = <ModelProps>[]
  visible.value = true
}

/**
 *  弹出窗口点确认时，将窗口配置的数据加到mv中
 */
const addTag = () => {
  setCurrentModel()
  if (isAdd.value) {
    mv.value.push(currentModelProps.value)
  }
}

const form = ref({})
</script>

<template>
  <a-space class="gl-multi-components" v-if="refreshFlag">
    <template v-for="(modelProps,index) in mv">
      <a-tag :size="tagSize" :color="tagColor" @click="clickTag(modelProps,index)" @close="closeTag(modelProps,index)" bordered closable>{{
          genText(modelProps, index)
        }}
      </a-tag>
    </template>
    <GlComponent v-if="extraComponent" :glComponentInst="extraComponent" :glIsRuntime="glIsRuntime"
                 :glRuntimeFlag="glRuntimeFlag"></GlComponent>
    <a-button type="primary" :size="tagSize" title="添加" @click="showAddTag">
      <template #icon>
        <GlIconfont type="gl-plus-circle"></GlIconfont>
      </template>
    </a-button>
    <a-modal v-if="visible" v-model:visible="visible" title="编辑" @ok="addTag">
      <a-form :model="form">
        <template v-for="(item,index) in items" :key="index">
          <a-form-item :field="item.inst.props.label" :label="item.inst?.props.label">
            <GlComponent v-if="item.inst" :glComponentInst="item.inst" :glIsRuntime="glIsRuntime"
                         :glRuntimeFlag="glRuntimeFlag"></GlComponent>
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
  </a-space>
</template>

<style scoped>

</style>
