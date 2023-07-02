<script lang="ts">
export default {
  name: 'GlInstRuntime'
}
</script>
<script lang="ts" setup>
import {computed, inject, type PropType, ref} from 'vue'
import {type PageProvideProxy,PageProvideKey,mixins} from "@geelato/gl-ui";

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const props = defineProps({
  id: [String],
  text: String,
  index: Number,
  moveCard: Function as PropType<(dragIndex: number, hoverIndex: number, dragItemId: string, dropItemId: string) => void>,
  addItem: Function,
  ...mixins.props,
  // 页面组件需要该属性，便于页面传值
  pageProps: {
    type: Object,
    default() {
      return {}
    }
  }
})


/**
 *  数据输入组件作为表单项，除了表单组件本身
 */
const isFormItem = computed(() => {
  // 排除特定的组件，如表单组件
  if (props.glComponentInst.componentName === 'GlEntityForm') {
    return false
  }
  return props.glComponentInst.group === 'dataEntry'
})
// const style = ref({
//   display: function () {
//     if (props.glComponentInst.group === 'dataEntry') {
//       return 'inline-block'
//     }
//     return false
//   }()
// })

const displayStyle = ref(function () {
  if (props.glComponentInst.group === 'dataEntry') {
    return 'inline-block'
  }
  // false
  return ''
}())


// 示例
// "i18n":
// [
//   {
//     "zh-CN":
//         "公司全称",
//     "en-US":
//         "FullName"
//   }
// ]
const defaultLocal = 'zh-CN'
const i18n = props.glComponentInst.i18n
const i18nConvert = (value?: string) => {
  const currentLocaleValue = localStorage.getItem('gl-locale') || defaultLocal
  // 如果是默认语言（zh-CN），则直接返回
  if (currentLocaleValue === defaultLocal) {
    return value
  }
  if (i18n) {
    for (let i18nKey in i18n) {
      if (i18n[i18nKey]['zh-CN'] === value) {
        return i18n[i18nKey][currentLocaleValue]
      }
    }
  }
  // 如果没有匹配的字典信息，则直接返回
  return value
}
</script>

<template>
  <div class="gl-dnd-wrapper" :style="{display:displayStyle}">
    <div class="gl-component-wrapper">
      <template v-if="isFormItem">
        <a-form-item v-show="glComponentInst.props.unRender!==true" class="gl-form-item"
                     :field="glComponentInst?.props?.bindField?.fieldName"
                     :tooltip="i18nConvert(glComponentInst?.props?.tooltip)"
                     :label="i18nConvert(glComponentInst?.props?.label)"
                     :rules="glComponentInst?.props?.rules"
                     :validate-trigger="[]">
          <GlComponent v-if="glComponentInst"
                       class="gl-dnd-item gl-x-item"
                       :glComponentInst="glComponentInst"
                       :componentStoreId="componentStoreId"
                       :glRuntimeFlag="glRuntimeFlag"
                       :glIsRuntime="glIsRuntime"
                       v-bind="pageProps"
          >
          </GlComponent>
          <template v-if="glComponentInst?.props?.extra" #extra>
            <div>{{ i18nConvert(glComponentInst?.props?.extra) }}</div>
          </template>
          <template v-if="glComponentInst?.props?.help" #help>
            <div>{{ i18nConvert(glComponentInst?.props?.help) }}</div>
          </template>
        </a-form-item>
      </template>
      <template v-else>
        <GlComponent v-if="glComponentInst"
                     class="gl-dnd-item gl-x-item"
                     :glComponentInst="glComponentInst"
                     :componentStoreId="componentStoreId"
                     :glRuntimeFlag="glRuntimeFlag"
                     :glIsRuntime="glIsRuntime"
                     v-bind="pageProps"
        >
        </GlComponent>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.gl-dnd-wrapper {
  width: 100%;
  position: relative;
  vertical-align: top;
  //padding: .5rem 0;
}

.indicator {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: #cc3636;

  &.first {
    top: 0;
    bottom: unset;
  }
}

.gl-component-wrapper {
  //width: 100%;
  padding: 1px;
  //background-color: white;
  //border: 1px dashed gray;
  //cursor: move;
}

.gl-dnd-placeholder {
  //width: 100%;
}
</style>