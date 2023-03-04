<template>
  <table class="gl-table">
    <tr>
      <td class="gl-table-cell gl-label" style="width: 6em" title="">
        类型</td>
      <td class="gl-table-cell">
        <a-radio-group size="small" v-model="mv.type">
          <a-radio value='radio'>默认</a-radio>
          <a-radio value="button">按钮</a-radio>
        </a-radio-group>
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
  name: "GlRadioGroupSetter",
  components:{GlOptions},
  props: {
    modelValue: {
      type: Object,
      default() {
        return {
          /**
           *  default | button
           */
          optionType: '',
          options: [],
          /**
           * outline | solid
           */
          buttonStyle: ''
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
