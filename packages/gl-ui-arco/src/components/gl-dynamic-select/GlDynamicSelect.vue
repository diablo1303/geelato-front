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
    :multiple="multiple"
    :placeholder="placeholder"
    @change="selectOne"
    @search="handleSearch"
    @clear="onClear"
    :valueKey="valueFiledName"
    :field-names="{ label: '__label', value: '__record' }"
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
    :multiple="multiple"
    :placeholder="placeholder"
    @change="selectOne"
    @search="handleSearch"
    @clear="onClear"
    :valueKey="valueFiledName"
  >
    <a-option
      v-for="item in selectOptions"
      :value="item.__record"
      :label="item.__label"
      :title="item.__label"
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
import { computed, inject, type PropType, type Ref, ref, toRaw, watch } from 'vue'
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

const emits = defineEmits(['update:modelValue'])

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const enum TriggerMode {
  onCreated = 'onCreated',
  onInvoked = 'onInvoked'
}

const props = defineProps({
  modelValue: {
    type: [String, Array]
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
  labelFieldNames: {
    type: Array as PropType<string[]>,
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
  maxRecordCount: {
    type: Number,
    default() {
      return 2000
    }
  },
  readonly: Boolean,
  size: String as PropType<'medium' | 'small' | 'mini' | 'large' | undefined>,
  placeholder: String,
  disabled: Boolean,
  /**
   *  是否可多选
   */
  multiple: {
    type: Boolean,
    default() {
      return false
    }
  }
})

const selectOptions: Ref<Record<string, any>[]> = ref([])

/**
 * 基于初始化的值，获取列表的选项
 * @param keys
 */
const findCheckedOptions = (keys: string[]) => {
  const result: Record<string, any> = []
  keys.forEach((key: String) => {
    // 注意selectOptions是从后端加载完成，再经加工的数据 {__record:xx,__label,[props.valueFiledName]}
    const foundOption = selectOptions.value.find((option: Record<string, any>) => {
      return option[props.valueFiledName] === key
    })
    if (foundOption) {
      console.log('foundOption', foundOption)
      result.push(foundOption.__record)
    }
  })
  return result
}

const getPropValue = (val?: string | Array<any>) => {
  return props.multiple ? (typeof val === 'string' ? [] : val) : val
}
const getDefaultValue = () => {
  return props.multiple ? [] : ''
}
let theLabelFieldNames: string[] = props.labelFieldNames

const isMultiLabelFieldName = computed(() => {
  return theLabelFieldNames.length > 1
})
const enableVirtualList = ref(false)
const autoEnableVirtualListWhenRecordCount = 1500
// console.log('props:', props)
const initValue = getPropValue(props.modelValue) || getDefaultValue()
const mv: Ref<string | Array<string>> = ref(initValue)
const inputMv = ref(undefined)
/**
 * multiple为多选时，mvItem为数组，示例格式为：
 * [ { "enName": "BALTIMORE,MD", "name": "巴尔的摩" }, { "enName": "BANGKOK,THAILAND", "name": "泰国曼谷" } ]
 * multiple为单选时，mvItem为keyValue对象，示例格式为：
 * { "enName": "TANJUNG PELEPAS,JOHOR,MALAYSIA" }
 */
const getMvItem = (value: any) => {
  if (props.multiple) {
    return utils.isEmpty(value) ? [] : findCheckedOptions(value)
  } else {
    return { [props.valueFiledName]: utils.isEmpty(value) ? '' : value }
  }
}
const mvItem = ref(getMvItem(initValue))
watch(
  () => {
    return props.modelValue
  },
  () => {
    // @ts-ignore
    mv.value = getPropValue(props.modelValue)
    mvItem.value = getMvItem(props.modelValue) || getDefaultValue()
  },
  { deep: true }
)
watch(
  mv,
  (val: any) => {
    // console.log('update:modelValue', val)
    emits('update:modelValue', val)
  },
  { deep: true }
)

const loadData = () => {
  // console.log('GlDynamicSelect > loadData() > entityName:', props.entityName, 'extraFieldAndBindIds:', props.extraFieldAndBindIds,'props',props)
  if (props.entityName && props.valueFiledName && theLabelFieldNames) {
    const fieldSet = new Set<string>().add(props.valueFiledName)

    theLabelFieldNames.forEach((name) => {
      if (name) {
        fieldSet.add(name)
      }
    })
    if (props.extraFieldAndBindIds?.length > 0) {
      props.extraFieldAndBindIds.forEach((item) => {
        fieldSet.add(item.fieldName)
      })
    }

    let fieldAry: string[] = []
    fieldSet.forEach((val: string) => {
      fieldAry.push(val)
    })
    let fields = fieldAry.join(',')

    // valueFilter
    const entityReaderParams: EntityReaderParam[] = []
    JSON.parse(JSON.stringify(props.valueFilter)).forEach((param: EntityReaderParam) => {
      executeObjectPropsExpressions(param, {})
      const newEntityReaderParam = new EntityReaderParam(
        param.name,
        param.cop,
        param.value,
        param.groupName,
        param.valueExpression
      )
      entityReaderParams.push(newEntityReaderParam)
    })
    entityReaderParams.push(new EntityReaderParam('delStatus', 'eq', '0'))

    const entityReader = new EntityReader()
    entityReader.entity = props.entityName
    entityReader.setFields(fields)
    entityReader.params = entityReaderParams
    entityReader.pageSize = props.maxRecordCount
    if (props.orderFiledName) {
      entityReader.order.push(new EntityReaderOrder(props.orderFiledName, props.ascOrDesc))
    }
    return entityApi.queryByEntityReader(entityReader).then((resp: any) => {
      const items = resp.data || []
      // console.log('selectOptions.value', selectOptions.value, selectOptions.value.length)
      if (items.length === 0) {
        inputMv.value = undefined
        if (props.multiple) {
          mv.value.slice(0)
        } else {
          mv.value = ''
        }
        selectOptions.value = []
        enableVirtualList.value = false
      } else {
        enableVirtualList.value = items.length > autoEnableVirtualListWhenRecordCount
        // 数据加工
        const newItems: Record<string, any>[] = []
        if (isMultiLabelFieldName.value) {
          items.forEach((item: Record<string, any>) => {
            const labels: string[] = []
            theLabelFieldNames.forEach((fieldName) => {
              // @ts-ignore
              labels.push(item[fieldName])
            })
            newItems.push({
              __label: labels.join(' '),
              [props.valueFiledName]: item[props.valueFiledName],
              __record: item
            })
          })
        } else {
          items.forEach((item: Record<string, any>) => {
            newItems.push({
              // @ts-ignore
              __label: item[theLabelFieldNames[0]],
              [props.valueFiledName]: item[props.valueFiledName],
              __record: item
            })
          })
        }
        selectOptions.value = newItems
      }
    })
  }
}

// console.log('GlDynamicSelect > create', props.entityName, useAttrs().id)
const selectOne = (value: any) => {
  // 将值设置到对应的组件中

  if (value && props.extraFieldAndBindIds.length > 0) {
    props.extraFieldAndBindIds.forEach((extraFieldAndBindId) => {
      pageProvideProxy.setComponentValue(
        extraFieldAndBindId.bindId,
        value[extraFieldAndBindId.fieldName]
      )
    })
  }
  // 如果值为数组对象
  if (props.multiple) {
    // @ts-ignore
    mv.value.splice(0)
    value.forEach((vItem: any) => {
      // @ts-ignore
      mv.value.push(vItem[props.valueFiledName])
    })
  } else {
    mv.value = value ? value[props.valueFiledName] : ''
  }
}

const onClear = () => {}

if (props.triggerMode !== TriggerMode.onInvoked) {
  // console.log('props.triggerMode !== TriggerMode.onInvoked', props.triggerMode)
  watch(
    () => {
      return (
        props.entityName +
        props.valueFiledName +
        props.labelFieldNames?.join(' ') +
        props.extraFieldAndBindIds
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
