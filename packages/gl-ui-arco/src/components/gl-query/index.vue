<script setup lang="ts">
// @ts-nocheck
import { computed, inject, onMounted, type PropType, ref, toRaw } from 'vue'
import {
  EntityReaderParam,
  jsScriptExecutor,
  PageProvideKey,
  type PageProvideProxy, selectComponent,
  utils
} from '@geelato/gl-ui'
import { ConvertUtil } from '@geelato/gl-ui'
import QueryItem, { getQueryParams, type QueryItemKv } from './query'
import { GlIconfont } from '@geelato/gl-ui'
import { useDebounceFn } from '@vueuse/core'

const emits = defineEmits(['search'])
const props = defineProps({
  items: {
    type: Array as PropType<QueryItem[]>,
    default() {
      return []
    }
  },
  /**
   *  是否在初始化之后触发查询
   *  默认为true
   */
  triggerByInit: {
    type: Boolean,
    default() {
      return true
    }
  },
  /**
   *  触发查询，查询条件值改变之后触发查询
   *  默认为true
   */
  triggerByValueChange: {
    type: Boolean,
    default() {
      return true
    }
  },
  /**
   *  阻断查询表达式
   *  表达式执行结果为true时，触发的查询操作在发出查询事件(emits search)之前会被中断
   *  表达式执行结果为false或undefined时，不中断
   *  表达式为空时不中断
   */
  interdictExpression: String,
  /**
   *  隐藏重置按钮
   *  场景如：查询条件的值是动态添加的，不是初始值，且查询条件不可修改，若重置，查询条件值会被清空
   *  默认为false
   */
  hideReset: Boolean,
  disabled: {
    type: Boolean,
    default() {
      return false
    }
  },
  glIsRuntime:Boolean
})

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const pageQueryParams = getQueryParams(pageProvideProxy)
/**
 *  基于组件参数及页面参数，创建查询表单值
 *  若有同名值，页面参数值优先
 */
const generateFormModel = () => {
  const fModel: any = {}
  // 组件值
  props.items?.forEach((item: QueryItem) => {
    // console.log('generateFormModel',item.component?.props.label,item.component!.value)
    // 以字段名，或id从页面参数中获取值，一般地页面可以通过字段名传值
    // 但有时查询条件中多个组件都绑定了多个同名的字段时，有可能只是希望某个组件参接收到参数
    // 此时就可以通过组件的id，作为参数名进行传值如query.a234567890123456789=1，即值传了id为a234567890123456789的参数，值为1
    // 字段名
    const fieldName = item.component?.props?.bindField?.fieldName
    let paramValue

    // 如果页面参数有传值
    if (fieldName && pageProvideProxy?.hasPageParam(`query.${fieldName}`)) {
      paramValue = pageQueryParams[fieldName]
      // console.log(`将参数：${fieldName}的值：${paramValue}，绑定到查询条件中。`)
    } else if (item.id && pageProvideProxy?.hasPageParam(item.id)) {
      paramValue = pageQueryParams[item.id]
    } else {
      // 首次加载时，需要依据表达式的值进行计算
      paramValue = item.component?.value
    }
    if (item.component) {
      item.component.value = paramValue
    }
    fModel[item.id] = paramValue
  })
  // console.log('GlQuery > generateFormModel() > fModel:', fModel)
  return fModel
}
const defaultValue = JSON.parse(JSON.stringify(generateFormModel()))

const formModel = ref(generateFormModel())

/**
 *  创建查询参数
 *  基于页面的组件，设置form表单的值，并构建查询参数
 */
const createEntityReaderParams = ():Array<EntityReaderParam> => {
  formModel.value = generateFormModel()

  const entityReaderParams: Array<EntityReaderParam> = []
  props.items?.forEach((item: QueryItem) => {
    if (
      formModel.value[item.id] !== undefined &&
      ConvertUtil.trim(`${formModel.value[item.id]}`).length > 0
    ) {
      entityReaderParams.push(
        new EntityReaderParam(
          item.component?.props?.bindField?.fieldName || '',
          item.cop,
          formModel.value[item.id],
          item.groupName
        )
      )
    }
  })
  return entityReaderParams
}

/**
 *  获取当前查询项的键值对，键为id
 *  可用于保存成过滤器
 */
const getQueryItemKvs = () => {
  if (props.items) {
    const items: QueryItemKv[] = []
    props.items.forEach((item: QueryItem) => {
      items.push({
        key: item.id,
        value: item.component?.value
      })
    })
    return items
  }
  return []
}
/**
 * 基于当前的查询项键值对参数
 * 设置重置当前查询
 * 隐藏的查询字段不进行重置
 * 只计的字段也不进行重置
 * @param queryItemKvs
 */
const resetByQueryItemKvs = (queryItemKvs: Array<QueryItemKv>) => {
  if (!queryItemKvs) return
  console.table(queryItemKvs)
  // const defaultValueCopy = JSON.parse(JSON.stringify(defaultValue))
  const queryItemKvsCopy = JSON.parse(JSON.stringify(queryItemKvs))
  props.items?.forEach((item: QueryItem) => {
    // 注！！不重置默认值，因为隐藏的字段有可能会被外部用脚本控制了值变成A，在保存过滤器之后存为A；原有的默认值有可能为B，这时设置为默认值时，会切换为B
    // item.component!.value = defaultValueCopy[item.id]
    // 再基于传入的值设置
    queryItemKvsCopy.forEach((kv: QueryItemKv) => {
      if (item.id === kv.key) {
        // 隐藏的查询字段不进行重置
        if (
          item.component &&
          (item.component.props._hidden !== true || item.component.props.readonly === true)
        ) {
          // console.log(item.component?.props.label,item.component.value,'=>',toRaw(kv.value),utils.isEmpty(toRaw(kv.value)))
          item.component.value = utils.isEmpty(toRaw(kv.value)) ? undefined : toRaw(kv.value)
        }
      }
    })
  })
  onSearch()
}

/**
 *  基于页面的组件，设置form表单的值，并构建查询参数
 *  增加100ms的防抖动，解决短时间内连续多次触发查询的问题
 */
const onSearch = useDebounceFn(() => {

  const entityReaderParams = createEntityReaderParams()
  let stop = false

  if (props.interdictExpression) {
    stop = jsScriptExecutor.evalExpression(props.interdictExpression, {
      pageProxy: pageProvideProxy
    })
  }
  // console.log(`是否阻断查询表达式：${props.interdictExpression}，执行结果为：`,stop,'，当前查询参数为：entityReaderParams:',entityReaderParams)
  if (!stop) {
    emits('search', entityReaderParams)
  }
}, 100)
/**
 *  隐藏的查询字段不进行重置
 *  只读的字段不进行重置
 */
const reset = () => {
  console.table(defaultValue)
  const defaultValueCopy = JSON.parse(JSON.stringify(defaultValue))
  props.items?.forEach((item: QueryItem) => {
    if (item.component?.value) {
      if (item.component.props._hidden !== true || item.component.props.readonly === true) {
        item.component.value = defaultValueCopy[item.id]
      }
    }
  })
  onSearch()
}

const changeValue = () => {
  if (props.triggerByValueChange) {
    onSearch()
  }
}
const showItems = computed(() => {
  return props.items.filter((item: QueryItem) => {
    return !item.component?.props._hidden
  })
})

const hideItems = computed(() => {
  return props.items.filter((item: QueryItem) => {
    return item.component?.props._hidden
  })
})

// 计算出所有组件占用的行数
const rowCount = computed(() => {
  let colCount = 0
  showItems.value.forEach((item: QueryItem) => {
    colCount = colCount + (item.colspan === undefined ? 24 : item.colspan)
  })
  return Math.ceil(colCount / 24)
})
const t = (value: any) => {
  return value
}
onMounted(() => {
  if (props.triggerByInit !== false) {
    onSearch()
  }
})
const form = ref({})
const glQuery = ref()
const gid = utils.gid('id')
const showTitle = computed(() => {
  // 宽度大于600时会显示按钮标题
  return glQuery.value?.$el.offsetWidth > 600
})

defineExpose({
  createEntityReaderParams,
  reset,
  search: onSearch,
  getQueryItemKvs,
  resetByQueryItemKvs
})
</script>

<template>
  <a-row class="gl-query" ref="glQuery">
    <a-col :flex="1">
      <a-form
        :model="form"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        label-align="left"
        :auto-label-width="true"
      >
        <!--  显示的区域  -->
        <a-row :gutter="16">
          <a-col v-for="(item, index) in showItems" :key="index" :span="item.colspan">
            <a-form-item :field="item.id" :label="t(item.component?.props.label)">
              <GlComponent
                v-if="item.component"
                :glComponentInst="item.component"
                @update="changeValue"
                :glIsRuntime="glIsRuntime"
                @click="selectComponent($event,item.component)"
              ></GlComponent>
              <template #help>
                {{ item.component?.props.description }}
              </template>
            </a-form-item>
          </a-col>
        </a-row>
        <!--  隐藏的区域  -->
        <a-row :gutter="16" style="display: none">
          <a-col v-for="(item, index) in hideItems" :key="index" :span="item.colspan">
            <a-form-item :field="item.id" :label="t(item.component?.props.label)">
              <GlComponent
                v-if="item.component"
                :glComponentInst="item.component"
                @update="changeValue"
                :glIsRuntime="glIsRuntime"
                @click="selectComponent($event,item.component)"
              ></GlComponent>
              <template #help>
                {{ item.component?.props.description }}
              </template>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider :style="{ height: `${42 * rowCount}px` }" direction="vertical" />
    <a-col :flex="'86px'" style="text-align: right">
      <a-space :direction="rowCount > 1 ? 'vertical' : 'horizontal'" :size="18">
        <a-button type="primary" @click="onSearch">
          <template #icon>
            <GlIconfont type="gl-search"></GlIconfont>
          </template>
          <span v-if="showTitle">查询</span>
        </a-button>
        <a-button v-if="!hideReset" @click="reset">
          <template #icon>
            <GlIconfont type="gl-reset"></GlIconfont>
          </template>
          <span v-if="showTitle">重置</span>
        </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<style scoped></style>
