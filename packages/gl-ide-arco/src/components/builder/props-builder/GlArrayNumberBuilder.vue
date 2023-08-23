<template>
  <table class="gl-table">
    <tr>
      <td class="gl-table-cell gl-label" style="width: 7em" title="">
        最大值
      </td>
      <td class="gl-table-cell">
        <a-input-number v-model="mv.max" />
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" style="width: 7em" title="">
        最小值
      </td>
      <td class="gl-table-cell">
        <a-input-number v-model="mv.min" />
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlArrayNumberBuilder",
  props: {
    modelValue: {
      type: Object,
      default() {
        return {
          max: 99999999,
          min: 0
        }
      }
    }
  },
  beforeUpdate() {
    this.mv = this.modelValue
  },
  data() {
    return {
      mv: this.modelValue
    }
  },
  watch: {
    'mv': {
      handler: function (val) {
        this.$emit('update', val)
      },
      deep: true
    }
  }
})
</script>

<style scoped>

</style>
