<script setup lang="ts">
// @ts-nocheck
import { computed, onMounted, type PropType, ref } from 'vue'
import { EntityReaderParam } from '@geelato/gl-ui'
import { ConvertUtil } from '@geelato/gl-ui'
import QueryItem from './query'
import { GlIconfont } from '@geelato/gl-ui'

const emits = defineEmits(['search'])
const props = defineProps({
  items: {
    type: Array as PropType<QueryItem[]>,
    default() {
      return []
    }
  }
})

/**
 *  基于组件参数及页面参数，创建查询表单值
 *  若有同名值，页面参数值优先
 */
const generateFormModel = () => {
  const fModel: any = {}
  // 组件值
  props.items?.forEach((item: QueryItem) => {
    // 首次加载时，需要依据表达式的值进行计算
    fModel[item.id] = item.component?.value
  })
  // console.log('GlQuery > generateFormModel() > fModel:', fModel)
  return fModel
}
const defaultValue = generateFormModel()

const formModel = ref(defaultValue)

/**
 *  创建查询参数
 */
const createEntityReaderParams = () => {
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
 *  基于页面的组件，设置form表单的值
 */

const onSearch = () => {
  formModel.value = generateFormModel()
  const entityReaderParams = createEntityReaderParams()
  emits('search', entityReaderParams)
}
/**
 *  隐藏的查询字段不进行重置
 */
const reset = () => {
  props.items?.forEach((item: QueryItem) => {
    if (item.component?.value) {
      if (item.component.props._hidden !== true) {
        item.component.value = defaultValue[item.id]
      }
    }
  })
  onSearch()
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
  onSearch()
})
const form = ref({})
defineExpose({ createEntityReaderParams, reset })
</script>

<template>
  <a-row class="gl-query">
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
                @update="onSearch"
              ></GlComponent>
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
                @update="onSearch"
              ></GlComponent>
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
          查询
        </a-button>
        <a-button @click="reset">
          <template #icon>
            <GlIconfont type="gl-reset"></GlIconfont>
          </template>
          重置
        </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<style scoped></style>
