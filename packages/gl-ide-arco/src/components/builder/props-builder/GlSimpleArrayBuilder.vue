<template>
  <table class="gl-table">
    <tr>
      <td class="gl-table-cell gl-label" style="width: 6em" title="">
        数组类型</td>
      <td class="gl-table-cell">
        <a-select v-model="mv.mode" style="width: 100%">
          <a-option value='String'>字符串数组</a-option>
          <a-option value="Number">数字数组</a-option>
          <a-option value="Boolean">布尔数组</a-option>
          <a-option value="Component">组件数组</a-option>
        </a-select>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlSimpleArrayBuilder",
  props: {
    modelValue: {
      type: Object,
      default() {
        return {
          /**
           *  String | Number | Boolean
           */
          mode: 'String'
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
