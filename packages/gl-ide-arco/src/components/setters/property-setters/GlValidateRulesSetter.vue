<script lang="ts">
export default {
  name: 'GlValidateRulesSetter'
}
</script>
<script setup lang="ts">
import {ref} from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default() {
      return []
    }
  }
})

const mv = ref(props.modelValue)
if (mv.value.length === 0) {
  mv.value.push({required: true, message: '必填'})
}
</script>

<template>
  <div class="gl-table">
    <template v-for="item in mv">
      <div class="gl-table-row" v-if="item.required!==undefined">
        <div class="gl-table-cell gl-label" style="width: 4em">必填</div>
        <div class="gl-table-cell">
          <a-switch v-model="item.required"></a-switch>
          <a-input v-model="item.message"/>
        </div>
      </div>
      <div class="gl-table-row" v-else>
        <div class="gl-table-cell gl-label" style="width: 4em">xx</div>
        <div class="gl-table-cell">
          xx
        </div>
      </div>
    </template>

  </div>
</template>

<style scoped>

</style>
