<template>
  <div class="gl-entity-form">
    <a-form ref="formRef" :model="formData" :title="title" :layout="layout"
            :autoLabelWidth="autoLabelWidth">
      <template v-if="glIsRuntime">
        <slot></slot>
      </template>
      <template v-else>
        <GlInsts :glComponentInst="glComponentInst"></GlInsts>
      </template>
    </a-form>
    <a-button @click="onSubmitClick">提交</a-button>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlEntityForm"
}
</script>
<script lang="ts" setup>
import {type PropType, ref} from 'vue';
import type {FormInstance} from '@arco-design/web-vue/es/form';
import useLoading from '../../hooks/loading';
import {mixins} from "@geelato/gl-ui";
import {isDataEntry} from "@geelato/gl-ui-schema-arco";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import {useGlobal} from "@geelato/gl-ui";

const global = useGlobal()

type LayoutType = "inline" | "horizontal" | "vertical"
const form = ref({})
const props = defineProps({
  title: String,
  bindEntity: {
    type: Object
  },
  layout: {
    type: String as PropType<LayoutType>,
    default() {
      return 'horizontal'
    }
  },
  autoLabelWidth: {
    type: Boolean,
    default() {
      return false
    }
  },
  ...mixins.props
})

const formData = ref({});
const formItems = ref<Array<any>>([]);
const formRef = ref<FormInstance>();
/**
 * 遍历取得所有表单项的值
 */
const buildFieldItems = () => {
  formItems.value.length = 0
  function buildFieldItem(inst: ComponentInstance) {
    for (let index in inst.children) {
      // @ts-ignore
      let subInst = inst.children[index]
      console.log('isDataEntry:', subInst.componentName, isDataEntry(subInst.componentName), ' subInst:', subInst)
      if (isDataEntry(subInst.componentName)) {
        let formItem = {
          fieldName: subInst.props.bindField.fieldName,
          value: subInst._value
        }
        formItems.value.push({formItem})
        // @ts-ignore
        formData.value[subInst.props.bindField.fieldName] = subInst._value
      }
      if (subInst.children && subInst.children.length > 0) {
        buildFieldItem(subInst)
      }
    }
  }

  buildFieldItem(props.glComponentInst)
  console.log('buildFieldItems formItems:', formItems.value, 'formData:', formData.value)
}

const {loading, setLoading} = useLoading();
const onSubmitClick = async () => {
  // checkConfig()
  // 构建表单数据项，设置值
  buildFieldItems()
  // 再进一步进行表单数据项值校验
  const res = await formRef.value?.validate();
  console.log('onSubmitClick() validate form:', formRef.value, ' result:', res)
  if (!res) {
    setLoading(true);
  } else {

  }
  setTimeout(() => {
    setLoading(false);
  }, 1000);
};

/**
 *  检查配置是否正常
 *  用于设计时
 */
const checkConfig = () => {
  function checkFieldItem(inst: ComponentInstance) {
    for (let index in inst.children) {
      let subInst = inst.children[index]
      if (isDataEntry(subInst.componentName)) {
        if(!subInst.props.bindField){
          global.$notification.error(`组件[${subInst.componentName}],标题：${subInst.props.label},未绑定模型字段。`)
        }
      }
      if (subInst.children && subInst.children.length > 0) {
        checkFieldItem(subInst)
      }
    }
  }
  checkFieldItem(props.glComponentInst)
}
</script>

<style>
.gl-entity-form {
  width: 100%;
}

.gl-entity-form-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  padding: 14px 20px 14px 0;
  background: var(--color-bg-2);
  text-align: right;
}
</style>
