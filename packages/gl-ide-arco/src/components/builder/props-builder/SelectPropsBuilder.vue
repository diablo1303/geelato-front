<template>
  <div>
    <span>模式：</span>
    <a-radio-group size="small" v-model="mode">
      <a-radio value='SECRET_COMBOBOX_MODE_DO_NOT_USE'>单选</a-radio>
      <a-radio value="multiple">多选</a-radio>
      <a-radio value="tags">标签</a-radio>
    </a-radio-group>
    <span>&nbsp;&nbsp;可选项：</span>
    <!--    <GlOptions v-model="options"-->
    <!--               :columns="[{dataIndex: 'label'},{dataIndex: 'value'}]"></GlOptions>-->
    <GlArrayBaseSetter v-slot:default="slotProps" v-model="items" :defaultItemForAdd="{label:'',value:''}"
                       @addItem="update"
                       @removeItem="update">
      <span>
        <span><a-input v-model="items[slotProps.index].label" @change="update"></a-input></span>
        <span><a-input v-model="items[slotProps.index].value" @change="update"></a-input></span>
      </span>

    </GlArrayBaseSetter>
  </div>
</template>

<script lang="ts">
export default {name: "SelectPropsSetter"}
</script>
<script setup lang="ts">
// @ts-nocheck
import {ref} from "vue";

const emits = defineEmits(['update:options'])
const props = defineProps({
  mode: String,
  options: {
    type: Array,
    default() {
      return []
    }
  }
})
const items = ref(props.options)
const update = () => {
  console.log('items.value', items.value)
  emits('update:options', items.value)
}
</script>

<style scoped>

</style>