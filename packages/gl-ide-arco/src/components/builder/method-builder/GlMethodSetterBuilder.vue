<template>
  <table class="gl-table gl-method-setter-builder">
    <tr>
      <td class="gl-table-cell gl-label" style="width: 8em" title="显示名称，用于配置调用组件方法时显示。">
        <GlIconfont type="gl-info-circle"></GlIconfont>
        方法标题
      </td>
      <td class="gl-table-cell">
        <a-input v-model="mv.title"></a-input>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" title="">
        方法描述
      </td>
      <td class="gl-table-cell">
        <a-input v-model="mv.description" placeholder="description"></a-input>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" title="">
        方法参数
      </td>
      <td class="gl-table-cell">
        <GlArrayBaseSetter v-slot:default="slotProps" v-model="mv.params"
                           :defaultItemForAdd="defaultItemForAdd"
                           :wrapperStyle="{'border-top': '#dedede 4px solid'}"
                           @addItem="update"
                           @removeItem="update">
          <a-card title="" :bordered="false" size="small">
            <table class="gl-table">
              <tr>
                <td class="gl-table-cell gl-label" style="width: 8em" title="">
                  参数名
                </td>
                <td class="gl-table-cell">
                  <a-input v-model="slotProps.item.name"></a-input>
                </td>
              </tr>
              <tr>
                <td class="gl-table-cell gl-label">
                  参数标题
                </td>
                <td class="gl-table-cell">
                  <a-input v-model="slotProps.item.title"></a-input>
                </td>
              </tr>
              <tr>
                <td class="gl-table-cell gl-label">
                  参数类型
                </td>
                <td class="gl-table-cell">
                  <a-select v-model="slotProps.item.type" :options="options">
                  </a-select>
                </td>
              </tr>
              <tr>
                <td class="gl-table-cell gl-label">
                  参数默认值
                </td>
                <td class="gl-table-cell">
                  <a-input v-model="slotProps.item.defaultValue"></a-input>
                </td>
              </tr>
              <tr>
                <td class="gl-table-cell gl-label">
                  参数说明
                </td>
                <td class="gl-table-cell">
                  <a-input v-model="slotProps.item.description"></a-input>
                </td>
              </tr>
            </table>
          </a-card>
        </GlArrayBaseSetter>
      </td>
    </tr>

  </table>
</template>

<script lang="ts">
export default {
  name: 'GlMethodSetterBuilder'
}
</script>
<script lang="ts" setup>
// @ts-nocheck
import {type PropType, ref, watch} from 'vue'
import {MethodSetterMeta, useValueTypeOptions} from "@geelato/gl-ui-schema";


const props = defineProps({
  modelValue: {
    type: Object as PropType<MethodSetterMeta>,
    default() {
      return new MethodSetterMeta()
    }
  }
})
const emits = defineEmits(['updateSetter'])

const mv = ref(props.modelValue)

watch(mv, (val, oval) => {
  emits('updateSetter', mv.value)
}, {immediate: true, deep: true})
const options = useValueTypeOptions()
const defaultItemForAdd = () => {
  return {
    name: '',
    type: 'String'
  }
}

const update = () => {

}
</script>

<style>
.gl-method-setter-builder .arco-card-body {
  padding: 0 !important;
}

.gl-method-setter-builder .arco-card-header {
  height: 30px;
  padding: 0 8px;
}
</style>
