<template>
  <table class="gl-table">
    <tr>
      <td class="gl-table-cell gl-label" style="width: 3em" title="">选项</td>
      <td class="gl-table-cell">
                <GlOptions v-model="mv.options" :columns="[{dataIndex: 'label',title:'名'},{dataIndex: 'value',title:'值'}]"></GlOptions>
<!--        <GlArrayBaseSetter v-slot:default="slotProps" v-model="mv.options" :defaultItemForAdd="{label:'',value:''}" @addItem="update"-->
<!--                           @removeItem="update">-->
<!--            <span>-->
<!--              <span><a-input v-model="mv.options[slotProps.index].label" @change="update"></a-input></span>-->
<!--              <span><a-input v-model="mv.options[slotProps.index].value" @change="update"></a-input></span>-->
<!--            </span>-->
<!--        </GlArrayBaseSetter>-->
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" >
        模式
      </td>
      <td class="gl-table-cell">
        <a-switch v-model="mv.multiple">
          <template #checked>
            多选
          </template>
          <template #unchecked>
            单选
          </template>
        </a-switch>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label">
        清除
      </td>
      <td class="gl-table-cell">
        <a-switch v-model="mv.allowClear">
          <template #checked>
            可以
          </template>
          <template #unchecked>
            不可以
          </template>
        </a-switch>
      </td>
    </tr>
  </table>
</template>
<script lang="ts">
export default {
  name: "GlSelectSetter"
}
</script>
<script lang="ts" setup>
import {ref, watch} from 'vue'
import GlOptions from "../GlOptions.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default() {
      return {
        multiple: false,
        allowClear: true,
        options: []
      }
    }
  }
})
const emits = defineEmits(['update'])
const mv = ref(props.modelValue)
watch(
    () => mv,
    (val: any) => {
      emits('update', val)
    },
    {deep: true}
)

const items = ref(props.modelValue.options)
const update = () => {
}

</script>

<style scoped>

</style>
