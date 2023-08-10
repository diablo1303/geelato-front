<template>
  <a-select v-model="mvItem"
            :allow-clear="allowClear"
            :allow-search="allowSearch"
            :readonly="readonly"
            :size="size"
            :disabled="disabled"
            :placeholder="placeholder"
            @change="selectOne"
            :valueKey="valueFiledName"
  >
    <a-option v-for="item in selectOptions" :value="item" :label="item[labelFieldName]"
              :title="item[labelFieldName]"
              :class="{'gl-selected':mv===item[valueFiledName]}"></a-option>
  </a-select>
</template>
<script lang="ts">
/**
 *  基于数据库实体的动态数据选择器
 */
export default {
  name: "GlDynamicSelect"
}
</script>
<script lang="ts" setup>
import {inject, onMounted, type PropType, ref, useAttrs, watch} from 'vue'
import {entityApi, PageProvideKey, PageProvideProxy} from "@geelato/gl-ui";

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const enum TriggerMode {onCreated = 'onCreated', onInvoked = 'onInvoked'}

const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  entityName: {
    type: String,
    required: true
  },
  /**
   *  加载数据的触发模式
   */
  triggerMode: {
    type: String as PropType<TriggerMode>
  },
  labelFieldName: {
    type: String,
    required: true
  },
  valueFiledName: {
    type: String,
    default() {
      return 'id'
    }
  },
  orderFiledName: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  额外查询出来的字段fieldName，并将结果设置到id中
   */
  extraFieldAndBindIds: {
    type: Array as PropType<Array<{ fieldName: string, bindId: string }>>,
    default() {
      return []
    }
  },
  /**
   * asc or desc
   */
  ascOrDesc: {
    type: String,
    default() {
      return '+'
    }
  },
  allowClear: {
    type: Boolean,
    default() {
      return false
    }
  },
  allowSearch: {
    type: Boolean,
    default() {
      return true
    }
  },
  readonly: Boolean,
  size: String as PropType<"medium" | "small" | "mini" | "large" | undefined>,
  placeholder: String,
  disabled: Boolean
})
const emits = defineEmits(['update:modelValue'])
const mv = ref(props.modelValue)
const mvItem = ref({[props.valueFiledName]: props.modelValue})
watch(mv,
    (val: any) => {
      emits('update:modelValue', val)
    },
    {deep: true}
)
const selectOptions = ref([])
const loadData = () => {
  if (props.entityName && props.valueFiledName && props.labelFieldName) {
    const params = props.orderFiledName ? {'@order': props.orderFiledName + '|' + props.ascOrDesc} : {}
    Object.assign(params, {'delStatus|eq': '0'})
    // console.log('GlDynamicSelect > loadData() > entityName:', props.entityName, 'params:', params, 'extraFieldAndBindIds:', props.extraFieldAndBindIds)
    let fields = props.valueFiledName === props.labelFieldName ? `${props.valueFiledName}` : `${props.valueFiledName},${props.labelFieldName}`
    if (props.extraFieldAndBindIds?.length > 0) {
      const extraFieldNames: string[] = []
      props.extraFieldAndBindIds.forEach((item) => {
        extraFieldNames.push(item.fieldName)
      })
      fields = fields + ',' + extraFieldNames.join(',')
    }
    entityApi.query(props.entityName, fields, params).then((resp: any) => {
      selectOptions.value = resp.data?.data || []
    })
  }
}

// console.log('GlDynamicSelect > create', props.entityName, useAttrs().id)


const selectOne = (value: any) => {
  // 将值设置到对应的组件中
  // console.log('selectOne', value)
  if (value && props.extraFieldAndBindIds.length > 0) {
    props.extraFieldAndBindIds.forEach((extraFieldAndBindId) => {
      pageProvideProxy.setComponentValue(extraFieldAndBindId.bindId, value[extraFieldAndBindId.fieldName])
    })
  }
  mv.value = value ? value[props.valueFiledName] : ''
}


if (props.triggerMode !== TriggerMode.onInvoked) {
  console.log('props.triggerMode !== TriggerMode.onInvoked', props.triggerMode)
  watch(() => {
    return props.entityName + props.valueFiledName + props.labelFieldName + props.extraFieldAndBindIds
  }, () => {
    loadData()
  }, {immediate: true, deep: true})
}

defineExpose({fetchData: loadData})

</script>

<style scoped>

</style>
