<template>
  <a-select
    v-if="enableVirtualList"
    class="gl-dynamic-select"
    v-model="mvItem"
    v-model:input-value="inputMv"
    :allow-clear="allowClear"
    :allow-search="allowSearch"
    :readonly="readonly"
    :size="size"
    :disabled="disabled"
    :placeholder="placeholder"
    @change="selectOne"
    @search="handleSearch"
    :valueKey="valueFiledName"
    :field-names="{ label: labelFieldName, value: 'record' }"
    :virtual-list-props="{ height: 200 }"
    :options="selectOptions"
  >
  </a-select>
  <a-select
    v-else
    class="gl-dynamic-select"
    v-model="mvItem"
    v-model:input-value="inputMv"
    :allow-clear="allowClear"
    :allow-search="allowSearch"
    :readonly="readonly"
    :size="size"
    :disabled="disabled"
    :placeholder="placeholder"
    @change="selectOne"
    @search="handleSearch"
    :valueKey="valueFiledName"
  >
    <a-option
      v-for="item in selectOptions"
      :value="item"
      :label="item[labelFieldName]"
      :title="item[labelFieldName]"
      :class="{ 'gl-selected': mv === item[valueFiledName] }"
    ></a-option>
  </a-select>
</template>
<script lang="ts">
/**
 *  基于数据库实体的动态数据选择器
 */
export default {
  name: 'GlDynamicSelect'
}
</script>
<script lang="ts" setup>
import { inject, type PropType, type Ref, ref, watch } from 'vue'
import {
  entityApi,
  EntityReader,
  EntityReaderOrder,
  EntityReaderParam,
  executeObjectPropsExpressions,
  PageProvideKey,
  PageProvideProxy,
  utils
} from '@geelato/gl-ui'
import { EntityReaderOrderEnum } from '@geelato/gl-ui'

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const enum TriggerMode {
  onCreated = 'onCreated',
  onInvoked = 'onInvoked'
}

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
  /**
   *  查询过滤条件
   */
  valueFilter: {
    type: Array as PropType<Array<EntityReaderParam>>,
    default() {
      return []
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
    type: Array as PropType<Array<{ fieldName: string; bindId: string }>>,
    default() {
      return []
    }
  },
  /**
   * asc or desc
   */
  ascOrDesc: {
    type: String as PropType<EntityReaderOrderEnum>,
    default() {
      return EntityReaderOrderEnum.ASE
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
  size: String as PropType<'medium' | 'small' | 'mini' | 'large' | undefined>,
  placeholder: String,
  disabled: Boolean
})

const enableVirtualList = ref(false)
const autoEnableVirtualListWhenRecordCount = 1500
// console.log('props:', props)
const initValue = props.modelValue || ''
const emits = defineEmits(['update:modelValue'])
const mv = ref(initValue)
const inputMv = ref('')
const mvItem = ref({ [props.valueFiledName]: initValue })
watch(
  () => {
    return props.modelValue
  },
  (val: any) => {
    mvItem.value = { [props.valueFiledName]: props.modelValue || '' }
  }
)
watch(
  mv,
  (val: any) => {
    emits('update:modelValue', val)
  },
  { deep: true }
)
const selectOptions: Ref<Record<string, any>[]> = ref([])
const loadData = () => {
  if (props.entityName && props.valueFiledName && props.labelFieldName) {
    // console.log('GlDynamicSelect > loadData() > entityName:', props.entityName, 'params:', params, 'extraFieldAndBindIds:', props.extraFieldAndBindIds)
    let fields =
      props.valueFiledName === props.labelFieldName
        ? `${props.valueFiledName}`
        : `${props.valueFiledName},${props.labelFieldName}`
    if (props.extraFieldAndBindIds?.length > 0) {
      const extraFieldNames: string[] = []
      props.extraFieldAndBindIds.forEach((item) => {
        extraFieldNames.push(item.fieldName)
      })
      fields = fields + ',' + extraFieldNames.join(',')
    }
    // valueFilter
    const entityReaderParams: EntityReaderParam[] = JSON.parse(JSON.stringify(props.valueFilter))
    entityReaderParams.forEach((entityReaderParam) => {
      // entityReaderParam = {
      //   name:'xxx',
      //   cop:'eq',
      //   "_propsExpressions": {
      //     "value": "$gl.inst.dict_bPMhDTpsMg95YZc.value||'-1'"
      //   },
      //   value:yyy
      // }
      executeObjectPropsExpressions(entityReaderParam, {})
    })
    entityReaderParams.push(new EntityReaderParam('delStatus', 'eq', '0'))

    const entityReader = new EntityReader()
    entityReader.entity = props.entityName
    entityReader.setFields(fields)
    entityReader.params = entityReaderParams
    entityReader.pageSize = 5000
    if (props.orderFiledName) {
      entityReader.order.push(new EntityReaderOrder(props.orderFiledName, props.ascOrDesc))
    }
    return entityApi.queryByEntityReader(entityReader).then((resp: any) => {
      const items = resp.data || []
      // console.log('selectOptions.value', selectOptions.value, selectOptions.value.length)
      if (items.length === 0) {
        inputMv.value = ''
        mv.value = ''
        selectOptions.value = []
      } else {
        enableVirtualList.value = items.length > autoEnableVirtualListWhenRecordCount
        // 数据加工
        const newItems: Record<string, any>[] = []
        items.forEach((item: Record<string, any>) => {
          newItems.push({
            [props.labelFieldName]: item[props.labelFieldName],
            [props.valueFiledName]: item[props.valueFiledName],
            record: item
          })
        })
        selectOptions.value = newItems
      }
    })
  }
}

// console.log('GlDynamicSelect > create', props.entityName, useAttrs().id)

const selectOne = (value: any) => {
  // 将值设置到对应的组件中
  console.log('selectOne', value)
  if (value && props.extraFieldAndBindIds.length > 0) {
    props.extraFieldAndBindIds.forEach((extraFieldAndBindId) => {
      pageProvideProxy.setComponentValue(
        extraFieldAndBindId.bindId,
        value[extraFieldAndBindId.fieldName]
      )
    })
  }
  mv.value = value ? value[props.valueFiledName] : ''
}

if (props.triggerMode !== TriggerMode.onInvoked) {
  // console.log('props.triggerMode !== TriggerMode.onInvoked', props.triggerMode)
  watch(
    () => {
      return (
        props.entityName + props.valueFiledName + props.labelFieldName + props.extraFieldAndBindIds
      )
    },
    () => {
      loadData()
    },
    { immediate: true, deep: true }
  )
}

const handleSearch = () => {}

defineExpose({ fetchData: loadData })
</script>

<style scoped>
.gl-dynamic-select {
  width: 100%;
}
</style>
