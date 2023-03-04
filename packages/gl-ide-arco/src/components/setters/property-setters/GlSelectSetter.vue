<template>
  <table class="gl-table">
    <tr>
      <td class="gl-table-cell gl-label" style="width: 6em" title="">
        模式</td>
      <td class="gl-table-cell">
        <a-switch  v-model="mv.multiple">
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
        清除</td>
      <td class="gl-table-cell">
        <a-switch  v-model="mv.allowClear">
          <template #checked>
            可以
          </template>
          <template #unchecked>
            不可以
          </template>
        </a-switch>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label">选项</td>
      <td class="gl-table-cell">
        <GlOptions v-model="mv.options"
                            :columns="[{dataIndex: 'label'},{dataIndex: 'value'}]"></GlOptions>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import GlOptions from "../GlOptions.vue";

export default defineComponent({
  name: "GlSelectSetter",
  components:{GlOptions},
  props: {
    modelValue: {
      type: Object,
      default() {
        return {
          multiple: false,
          allowClear:true,
          options:[]
        }
      }
    }
  },
  beforeUpdate() {
    this.mv = this.modelValue
  },
  data() {
    return {
      mv:this.modelValue
    }
  },
  watch:{
    'mv':{
      handler:function (val){
        this.$emit('update',val)
      },
      deep:true
    }
  }
})
</script>

<style scoped>

</style>
