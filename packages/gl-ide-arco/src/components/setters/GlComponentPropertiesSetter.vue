<template>
  <div :class="{'gl-table-as-tree':false}" class="gl-component-properties-setter gl-flex-columns">
    <!--需保障currentSelectedComponentMeta有且有正确的数据，否则该属性值会马上影响舞台上的组件展示-->
    <template v-if="componentMeta">
      <template v-for="(propertySetterMeta,index) in componentMeta.properties">
        <GlPropertySetter
            v-if="propertySetterMeta.type&&propertySetterMeta.name&&componentModel[propertySetterMeta.type]"
            :displayMode="componentMeta.displayMode"
            :displayValueExpress="componentModel[propertySetterMeta.type + 'Expressions']?componentModel[propertySetterMeta.type + 'Expressions'][propertySetterMeta.name]:undefined"
            :propertySetterMeta="propertySetterMeta"
            :propertyValue="componentModel[propertySetterMeta.type][propertySetterMeta.name]"
            @set:propertyValue="newValue=>componentModel[propertySetterMeta.type][propertySetterMeta.name]=newValue"
            @change:propertyValue="changePropertyValue(propertySetterMeta.type,propertySetterMeta.name,$event)"
        >
          <div v-if="propertySetterMeta.enableValueExpress">
            <template
                v-if="componentModel[propertySetterMeta.type + 'Expressions']?true:componentModel[propertySetterMeta.type + 'Expressions']={}"></template>
            <GlExpressionSetter
                v-model="componentModel[propertySetterMeta.type + 'Expressions'][propertySetterMeta.name]"></GlExpressionSetter>
          </div>
        </GlPropertySetter>

      </template>
    </template>
    <template v-else>
      <a-alert type="warning">
        组件元数据（componentMeta）为空。组件实例信息（componentInstance）为：
        <br/>
        {{ componentInstance }}
      </a-alert>
    </template>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import {defineComponent, type PropType, ref} from 'vue'
import {utils, LooseObject} from "@geelato/gl-ui";
import {ComponentInstance, ComponentMeta, type IPropertySetterMeta} from "@geelato/gl-ui-schema";

export default defineComponent({
  name: "GlComponentPropertiesSetter",
  props: {
    componentMeta: {
      type: Object as PropType<ComponentMeta>,
      required: true
    },
    componentInstance: {
      type: Object as PropType<ComponentInstance>,
      required: true
    }
  },
  data() {
    return {
      // 组件实例值
      componentModel: new ComponentInstance(),
      valueExpressModalVisible: false,
      valueExpression: '',
      // 由于a-modal中的on*事件，在componentMeta.properties的遍历中取的是最后一个propertySetterMeta的值
      // 这里增加这个变量，来记录当前打开的属性元数据
      // currentOpenModalPropertySetterMeta: {}
    }
  },
  created() {
    this.setComponentModel()
  },
  updated() {
    this.setComponentModel()
  },
  watch: {},
  methods: {
    setComponentModel() {
      if (utils.isNullOrEmpty(this.componentInstance)) {
        const defaultComponentModel: LooseObject = new LooseObject()
        // @ts-ignore
        defaultComponentModel[this.componentMeta.name] = undefined
        // @ts-ignore
        this.componentModel = ref(defaultComponentModel)
        // @ts-ignore
        this.componentModel.value.propsExpressions = this.componentModel.value.propsExpressions || {}
        // @ts-ignore
        this.componentModel.value.slotsExpressions = this.componentModel.value.slotsExpressions || {}
      } else {
        // @ts-ignore
        this.componentModel = this.componentInstance
        this.componentModel.propsExpressions = this.componentModel.propsExpressions || {}
        this.componentModel.slotsExpressions = this.componentModel.slotsExpressions || {}
      }
    },
    // /**
    //  * 打开值表达式设置窗口
    //  * @param propertySetterMeta
    //  */
    // openValueExpressModal(propertySetterMeta: IPropertySetterMeta) {
    //   console.log('propertySetterMeta', propertySetterMeta)
    //   this.currentOpenModalPropertySetterMeta = propertySetterMeta
    //   this.valueExpressModalVisible = true
    //   // @ts-ignore
    //   this.valueExpression = this.componentModel[propertySetterMeta.type + 'Expressions'][propertySetterMeta.name] || ''
    // },
    // clearValueExpress() {
    //   const propertySetterMeta = this.currentOpenModalPropertySetterMeta
    //   this.valueExpression = ''
    //   // @ts-ignore
    //   this.componentModel[propertySetterMeta.type + 'Expressions'][propertySetterMeta.name] = ''
    //   this.valueExpressModalVisible = false
    // },
    // handleOk() {
    //   const propertySetterMeta = this.currentOpenModalPropertySetterMeta
    //   // @ts-ignore
    //   this.componentModel[propertySetterMeta.type + 'Expressions'][propertySetterMeta.name] = this.valueExpression
    // },
    // handleCancel() {
    //
    // },
    changePropertyValue(type: string, name: string, value: any) {
      this.$emit('change:propertyValue', {type, name, value})
    }
  }
})
</script>

<style scoped>
/*.bax{*/
/*  background-color: rgba(231, 231, 231, 0.50);*/
/*}*/
</style>
