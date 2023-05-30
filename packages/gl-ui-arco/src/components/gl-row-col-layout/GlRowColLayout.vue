<script lang="ts">
export default {
  name: "GlRowColLayout"
}
</script>
<script setup lang="ts">
import {nextTick, onUpdated, type PropType} from "vue";
import {mixins, utils} from "@geelato/gl-ui";
import {I18nItem} from "@geelato/gl-ui-schema";

const props = defineProps({
  spans: {
    type: Array as PropType<Array<number>>,
    default() {
      return [8, 8, 8];
    },
  },
  offsets: {
    type: Array as PropType<Array<number>>,
    default() {
      return [0, 0, 0];
    },
  },
  gutter: {
    type: Number,
    default() {
      return 16;
    },
  },
  /**
   * 通过 justify 来进行水平布局。
   */
  justify: {
    type: String
  },
  /**
   * 通过 align 来进行垂直布局
   */
  align: {
    type: String
  },
  /**
   * Col 是否支持换行
   */
  wrap: {
    type: String
  },
  ...mixins.props
});

console.log('props.glIsRuntime,props.glRuntimeFlag',props.glIsRuntime,props.glRuntimeFlag)

const colTemplate = () => {
  return {
    "id": utils.gid('virtual'),
    "componentName": "GlVirtual",
    "title": "项",
    "props": {},
    "slots": {},
    "children": [
      {
        "id": utils.gid('ph'),
        "componentName": "GlDndPlaceholder",
        "title": "占位符",
        "props": {},
        "slots": {},
        "children": []
      }
    ]
  }
}

const updateInst = () => {
  if (props.glComponentInst.children && props.glComponentInst.children.length != props.spans.length) {
    // console.log('colSpans:', colSpans)
    while (props.glComponentInst.children.length < props.spans.length) {
      props.glComponentInst.children.push(JSON.parse(JSON.stringify(colTemplate())))
    }
    props.glComponentInst.children.length = props.spans.length
    nextTick(() => {
    })
  }
}
onUpdated(() => {
  updateInst()
})

updateInst()

const defaultLocal = 'zh-CN'
const i18nConvert = (value: string, i18n: I18nItem) => {
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
  <a-row :gutter="gutter" v-if="glIsRuntime">
    <a-col
        v-for="(span, index) in spans"
        :key="index"
        :span="span"
    >
      <template v-for="childComponentInst in glComponentInst.children[index].children">
        <a-form-item v-if="childComponentInst&&(childComponentInst.props.unRender!==true)" class="gl-form-item"
                     :field="childComponentInst.props?.bindField?.fieldName"
                     :tooltip="i18nConvert(childComponentInst.props?.tooltip,childComponentInst.i18n)"
                     :label="i18nConvert(childComponentInst.props?.label,childComponentInst.i18n)"
                     :rules="childComponentInst.props?.rules"
                     :validate-trigger="[]">
          <GlComponent v-if="childComponentInst" :glComponentInst="childComponentInst" :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag"></GlComponent>
          <template v-if="childComponentInst.props?.extra" #extra>
            <div>{{
                i18nConvert(childComponentInst.props?.extra, childComponentInst.i18n)
              }}
            </div>
          </template>
          <template v-if="childComponentInst.props?.help" #help>
            <div>{{
                i18nConvert(childComponentInst.props?.help, childComponentInst.i18n)
              }}
            </div>
          </template>
        </a-form-item>
      </template>
    </a-col>
  </a-row>
  <a-row :gutter="gutter" v-else>
    <a-col
        v-for="(span, index) in spans"
        :key="index"
        :span="span"
    >
      <component :is="'GlInsts'+glRuntimeFlag" :glComponentInst="glComponentInst.children[index]" :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag"/>
    </a-col>
  </a-row>

</template>

<style scoped></style>
