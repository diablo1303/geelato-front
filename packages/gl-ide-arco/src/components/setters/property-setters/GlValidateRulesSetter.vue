<script lang="ts">
export default {
  name: 'GlValidateRulesSetter'
}
</script>
<script setup lang="ts">
import {computed, PropType, ref, watch} from "vue";
import GlIconfontSetter from "@/components/setters/property-setters/GlIconfontSetter.vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  /**
   * fieldRules
   */
  modelValue: {
    type: Array,
    default() {
      return []
    }
  }
})

const mv = ref(props.modelValue)
if (mv.value.length === 0) {
  mv.value.push({required: false, message: '必填'})
}

const items = computed(() => {
  return mv.value.filter((rule: any) => {
    return rule.required === undefined
  })
})

watch(mv, (val) => {
  emits('update:modelValue', val)
}, {deep: true})


const update = () => {

}

const rules = [
  {label: '验证长度', name: 'length', setter: 'ANumber'},
  {label: '最大长度', name: 'maxLength', setter: 'ANumber'}
]
const getRuleSetter = (ruleName: string) => {
  return rules.find((rule: any) => {
    return rule.name === ruleName
  })!.setter
}
const addRule = (newRule: any) => {
  const foundRule = mv.value.find((rule: any) => {
    return rule[newRule.name] !== undefined
  })
  // 避免重复加同一规则
  if (!foundRule) {
    mv.value.push({

    })
  }
}
</script>

<template>
  <div>
    <div class="gl-table">
      <template v-for="item in mv">
        <div class="gl-table-row" v-if="item.required!==undefined">
          <div class="gl-table-cell gl-label" style="width: 4em">必填</div>
          <div class="gl-table-cell">
            <a-switch v-model="item.required"></a-switch>
            <a-input v-model="item.message"/>
          </div>
        </div>
        <div class="gl-table-row" v-if="item.length!==undefined">
          <div class="gl-table-cell gl-label">长度</div>
          <div class="gl-table-cell">
            <a-input-number v-model="item.length"></a-input-number>
            <a-input v-model="item.message"/>
          </div>
        </div>
      </template>
      <!--      <div class="gl-table-row">-->
      <!--        <div class="gl-table-cell gl-label" style="width: 4em">自定义</div>-->
      <!--        <div class="gl-table-cell">-->
      <!--          -->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="gl-table-row">-->
      <!--        <div style="line-height: 2.4em;width: 100%">-->
      <!--          <GlIconfont type="gl-plus-circle" text="添加xxxxx" @click="selectRule"></GlIconfont>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <div>
      <GlArrayBaseSetter v-slot:default="slotProps" v-model="items" :defaultItemForAdd="0" @addItem="update"
                         @removeItem="update">
        <div> {{items[slotProps.index].name}}
<!--          <component :is="getRuleSetter(items[slotProps.index].name)"/>-->
        </div>
      </GlArrayBaseSetter>
      <a-select placeholder="选择添加规则" @change="addRule">
        <a-option v-for="rule of rules" :value="rule" :label="rule.label"/>
      </a-select>
    </div>
  </div>
</template>

<style scoped>

</style>
