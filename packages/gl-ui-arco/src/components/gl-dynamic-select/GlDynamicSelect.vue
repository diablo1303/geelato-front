<template>
  <div class="gl-dynamic-select">
    <template v-if="glIsRuntime && isRead && !multiple">{{ getLabel || '无' }}</template>
    <template v-else>
      <a-select
        v-if="enableVirtualList"
        v-model="mvItem"
        v-model:input-value="inputMv"
        :allow-clear="allowClear"
        :allow-search="allowSearch"
        :readonly="readonly"
        :size="size"
        :disabled="disabled"
        :multiple="multiple"
        :placeholder="placeholder"
        :loading="loading"
        @change="select"
        @search="handleSearch"
        @clear="onClear"
        :valueKey="valueFiledName"
        :field-names="{ label: '__label', value: '__record' }"
        :virtual-list-props="{ height: 200 }"
        :options="renderOptions"
      >
        <!--        <template #prefix>-->
        <!--          xx-->
        <!--        </template>-->
      </a-select>
      <a-select
        v-else
        v-model="mvItem"
        v-model:input-value="inputMv"
        :allow-clear="allowClear"
        :allow-search="allowSearch"
        :readonly="readonly"
        :size="size"
        :disabled="disabled"
        :multiple="multiple"
        :placeholder="placeholder"
        :loading="loading"
        @change="select"
        @search="handleSearch"
        @clear="onClear"
        :valueKey="valueFiledName"
      >
        <!--        <template #prefix>-->
        <!--          <gl-iconfont type="gl-refresh" @click="loadData"></gl-iconfont>-->
        <!--        </template>-->
        <a-option
          v-for="item in renderOptions"
          :value="item.__record"
          :label="item.__label"
          :title="item.__label"
          :class="{ 'gl-selected': mv === item[valueFiledName] }"
        ></a-option>
      </a-select>
    </template>
  </div>
</template>
<script lang="ts">
/**
 *  基于数据库实体的动态数据选择器
 */
export default {
  name: 'GlDynamicSelect'
}

const enum TriggerMode {
  onCreated = 'onCreated'
  // onInvoked = 'onInvoked',
  // onValueChanged = 'onValueChanged'
}

// 触发约束条件，以下条件必须同时满足
const enum TriggerConstraint {
  // 组件为空值时不触发
  DoNoFetchWhenEmpty = 'DoNoFetchWhenEmpty',
  // 第一个参数值为空时不触发
  Param1ValueEmpty = 'Param1ValueEmpty',
  // 第二个参数值为空时不触发
  Param2ValueEmpty = 'Param2ValueEmpty',
  // 第三个参数值为空时不触发
  Param3ValueEmpty = 'Param3ValueEmpty',
  // 第三个参数值为空时不触发
  Param4ValueEmpty = 'Param4ValueEmpty',
  // 第三个参数值为空时不触发
  Param5ValueEmpty = 'Param5ValueEmpty'

  // 组件值从空转为非空
  // ValueChangeToNotEmpty = 'ValueChangeToNotEmpty'
  // // 查询条件的值都不为空
  // QueryConditionAllNotEmpty = 'QueryConditionAllNotEmpty'
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
  jsScriptExecutor,
  mixins,
  PageProvideKey,
  PageProvideProxy,
  useGlobal,
  utils
} from '@geelato/gl-ui'
import { EntityReaderOrderEnum } from '@geelato/gl-ui'

const emits = defineEmits([
  'update:modelValue',
  // 查询成功
  'fetchSuccess',
  // 查询失败
  'fetchFail',
  // 阻断查询
  'fetchInterdict',
  // select
  'select'
])

const loading = ref(false)
const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const props = defineProps({
  id: String,
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
  /**
   * 触发约束条件，限制触发条件
   * 可以有多个触发约束条件，需要满足所有的条件，才会触发
   * 为空则不限制
   */
  triggerConstraint: {
    type: Array as PropType<Array<TriggerConstraint>>,
    default() {
      return []
    }
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
  size: String as PropType<'medium' | 'small' | 'mini' | 'large' | undefined>,
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
  /**
   *  是否可多选
   */
  multiple: {
    type: Boolean,
    default() {
      return false
    }
  },
  /**
   * 忽略搜索的词，不参与搜索
   * 比如：'公司,广州'，多个词用半角逗号“,”分隔
   * 输入这些词，不会触发查询
   * !!注意，如果启用了该属性，默认加载的数据不展示
   * 需要依据该输入的内容，进行查询过滤
   */
  ignoreSearchWords: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  是否启用服务器端查询过滤
   *  TODO 暂不支持
   *  目前只支持客户端查询过滤
   */
  isSearchFormServer: {
    type: Boolean,
    default() {
      return false
    }
  },
  ...mixins.props
})

// console.log('GlDynamicSelect props.triggerConstraint',props.triggerConstraint)
// if (props.triggerConstraint?.includes(TriggerConstraint.ValueChangeToNotEmpty)) {
//   props.triggerConstraint.push(TriggerConstraint)
// }

const global = useGlobal()
// 加载的选项
const loadedOptions: Ref<Record<string, any>[]> = ref([])
// 查询过滤后的选项
const renderOptions: Ref<Record<string, any>[]> = ref([])
// 当前选中的选项
const selectedOptions: Ref<Record<string, any>[]> = ref([])

/**
 * 加载完成，渲染数据后触发
 * 服务端模式，加载完成时触发
 * 客户端模式，加载完成时，看是否有设置忽略搜索词，有则不触发（考虑到数据保密性，如业务员知道一些客户的名称，才能查询出这个客户）
 */
const renderAfterLoad = () => {
  if (props.isSearchFormServer) {
    return true
  } else {
    return !(props.ignoreSearchWords?.length > 0)
  }
}
const isRead = !!(pageProvideProxy?.isPageStatusRead() || props.disabled || props.readonly)

/**
 * 基于初始化的值，获取列表的选项
 * @param keys
 */
const findCheckedOptions = (keys: string[]) => {
  const result: Record<string, any> = []
  keys.forEach((key: String) => {
    // 注意renderOptions是从后端加载完成，再经加工的数据 {__record:xx,__label,[props.valueFiledName]}
    const foundOption = renderOptions.value.find((option: Record<string, any>) => {
      return option[props.valueFiledName] === key
    })
    if (foundOption) {
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

/**
 * 获取label名称，适用于单选的场景
 * @param option
 */
const getLabel = computed(() => {
  if (props.multiple) {
    // 多选时，可能返回的label较多，保持原有的下拉展示风格，不展示成文本
    return '不支持多选只读时展示为文本'
  }
  // foundOption：{id,__label,__record}
  const foundOption = renderOptions.value.find((option: Record<string, any>) => {
    return option[props.valueFiledName] == mv.value
  })
  return foundOption?.__label
})

let theLabelFieldNames: string[] = props.labelFieldNames

const isMultiLabelFieldName = computed(() => {
  return theLabelFieldNames.length > 1
})
const enableVirtualList = ref(false)
const autoEnableVirtualListWhenRecordCount = 1500
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

// /**
//  * 依据选中的值，获取原始行记录值
//  * 如果是单选，则返回的数组为0到1项
//  * 如果是多选，则返回的数组为0到N项
//  * @param value string | string[]
//  */
// const getSelectedRecords = (value: any) => {
//   console.log('getSelectedRecords', value)
//   if (utils.isEmpty(value)) {
//     return []
//   }
//   return props.multiple ? findCheckedOptions(value) : findCheckedOptions([value])
// }

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

/**
 * 选择一项
 * @param value Record<string, any> | Array<Record<string, any>>
 */
const select = (value: any) => {
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
    utils.sleep(100).then(()=>{
      // console.log('emits select')
      emits('select', value)
    })
  } else {
    mv.value = value ? value[props.valueFiledName] : ''
    utils.sleep(100).then(()=>{
      // console.log('emits select')
      emits('select', [value])
    })
  }
}

/**
 *  组合需要侦听的属性
 */
const watchProps = computed(()=>{
  return {
    entityName: props.entityName,
    valueFiledName: props.valueFiledName,
    labelFieldNames: [...props.labelFieldNames], // 浅拷贝以触发依赖跟踪
    extraFieldAndBindIds: props.extraFieldAndBindIds
  };
})

/**
 * TriggerMode.onCreated 或未设置时，默认直接加载数据
 */
const triggerOnCreated = () => {
  if (TriggerMode.onCreated === props.triggerMode || props.triggerMode === undefined) {
    // console.log('GlDynamicSelect > triggerOnCreated() > props', props)
    watch(watchProps,
      () => {
        loadData('watch props entityName valueFiledName labelFieldNames extraFieldAndBindIds')
      },
      { immediate: true, deep: true }
    )
  }
}

const onClear = () => {}
/**
 * 搜索框内容变化时
 * 1、客户端过滤模式，直接过滤
 * 2、服务器端过滤模式，发送请求到服务端（TODO）
 */
const handleSearch = () => {
  // 启用了 忽略搜索词
  if (props.ignoreSearchWords?.length > 0) {
    if (!inputMv.value || String(inputMv.value).trim() === '') {
      return false
    }
    const searchText = String(inputMv.value).trim()
    if (props.ignoreSearchWords.indexOf(searchText) >= 0) {
      global.$message.warning(`该词“${inputMv.value}”不可以查询。`)
      return false
    }
    renderOptions.value.length = 0
    renderOptions.value = loadedOptions.value.filter((option: any) => {
      // __label：已合并了多个label字段内容，不用再从labelFieldNames中取
      return option.__label?.indexOf(searchText) > -1
    })
  } else {
    // 没有启用时展示所有
    renderOptions.value = loadedOptions.value
  }
}

/**
 * 是否需要阻断加载数据
 */
const isStopLoadData = () => {
  if (props.triggerConstraint?.length > 0) {
    // 1、当值为空时，阻断加载数据
    if (props.triggerConstraint.includes(TriggerConstraint.DoNoFetchWhenEmpty)) {
      if (utils.isEmpty(mv.value)) {
        return true
      }
    }
    // 其它待支持
  }
  return false
}
/**
 * 是否需要阻断加载数据，依据参数值条件
 */
const isStopLoadDataByParams = (params: EntityReaderParam[]) => {
  if (props.triggerConstraint.includes(TriggerConstraint.Param1ValueEmpty)) {
    // @ts-ignore
    if (params.length >= 1 && utils.isEmpty(params[0].value)) {
      return true
    }
  }
  if (props.triggerConstraint.includes(TriggerConstraint.Param2ValueEmpty)) {
    // @ts-ignore
    if (params.length >= 2 && utils.isEmpty(params[1].value)) {
      return true
    }
  }
  if (props.triggerConstraint.includes(TriggerConstraint.Param3ValueEmpty)) {
    // @ts-ignore
    if (params.length >= 3 && utils.isEmpty(params[2].value)) {
      return true
    }
  }
  if (props.triggerConstraint.includes(TriggerConstraint.Param4ValueEmpty)) {
    // @ts-ignore
    if (params.length >= 4 && utils.isEmpty(params[3].value)) {
      return true
    }
  }
  if (props.triggerConstraint.includes(TriggerConstraint.Param5ValueEmpty)) {
    // @ts-ignore
    if (params.length >= 5 && utils.isEmpty(params[4].value)) {
      return true
    }
  }
  return false
}

const loadData = (message?:string) => {
  // console.log('loadData',message)
  if (isStopLoadData()) {
    // const message =  '当值为空时，阻断加载数据'
    emits('fetchInterdict', '当值为空时，阻断加载数据')
    return
  }
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
    const parsedParams: EntityReaderParam[] = []
    JSON.parse(JSON.stringify(props.valueFilter)).forEach((param: EntityReaderParam) => {
      // 历史数据，存在_valueExpression中
      // @ts-ignore
      if (param._valueExpression?.value !== undefined) {
        // @ts-ignore
        param.valueExpression = param._valueExpression.value
        // @ts-ignore
        delete param._valueExpression
      }
      if (param.valueExpression) {
        if (typeof param.valueExpression === 'string') {
          param.value = jsScriptExecutor.evalExpression(param.valueExpression, {
            pageProxy: pageProvideProxy
          })
        } else {
          // 不需要解析
          param.value = param.valueExpression
        }
      }
      parsedParams.push(param)
    })
    // 依据参数值是否为空，决定是否加载数据
    if (isStopLoadDataByParams(parsedParams)) {
      emits('fetchInterdict', '参数为空，阻断加载数据')
      return
    }

    loading.value = true

    const entityReaderParams: EntityReaderParam[] = []
    parsedParams.forEach((param: EntityReaderParam) => {
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
    return entityApi.queryByEntityReader(entityReader, false, props.id).then(
      (resp: any) => {
        const items = resp.data || []
        // console.log('loadedOptions.value', loadedOptions.value, loadedOptions.value.length)
        if (items.length === 0) {
          inputMv.value = undefined
          if (props.multiple) {
            mv.value.slice(0)
          } else {
            mv.value = ''
          }
          loadedOptions.value = []
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
          loadedOptions.value = newItems
        }
        // 加载完成数据之后，如果需要马上展示，则执行客户端过滤查询
        if (renderAfterLoad()) {
          handleSearch()
        }
        loading.value = false
        // data 从服务端加载的数据
        // loadedOptions 加载的
        emits('fetchSuccess', resp.data, loadedOptions.value)
      },
      (err) => {
        loading.value = false
        emits('fetchFail', '加载失败')
      }
    )
  }
}

watch(
  mv,
  (val: any, oval: any) => {
    // console.log('watch mv',toRaw(mv.value))
    emits('update:modelValue', val)
    loadData('watch mv')
  },
  { deep: true, immediate: true }
)

triggerOnCreated()
defineExpose({ fetchData: loadData })
</script>

<style>
.gl-dynamic-select {
  width: 100%;
}
</style>
