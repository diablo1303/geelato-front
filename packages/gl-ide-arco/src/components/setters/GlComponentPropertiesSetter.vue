<template>
  <div class="gl-table" :class="{'gl-table-as-tree':false}">
    <!--需保障currentSelectedComponentMeta有且有正确的数据，否则该属性值会马上影响舞台上的组件展示-->
    <template v-if="componentMeta">
      <template v-for="(propertySetterMeta,index) in componentMeta.properties">

        <GlPropertySetter
            v-if="propertySetterMeta.type&&propertySetterMeta.name&&componentModel[propertySetterMeta.type]"
            :displayMode="componentMeta.displayMode"
            :propertySetterMeta="propertySetterMeta"
            v-model:propertyValue="componentModel[propertySetterMeta.type][propertySetterMeta.name]"
        >
          <div v-if="propertySetterMeta.enableValueExpress">
            <a-button size="mini" @click="openValueExpressModal(propertySetterMeta)"
                      :type="componentModel[propertySetterMeta.type+'Express'][propertySetterMeta.name]?'primary':''"
                      style="padding: 0 0.1em;height: 2.6em;font-weight: 700">{ / }
            </a-button>
            <a-modal :key="index" title="变量绑定" v-model:visible="valueExpressModalVisible"
                     @ok="handleOk"
                     @cancel="handleCancel">
              <a-textarea v-model="valueExpress" placeholder="在此输入..."></a-textarea>
              <a-button style="float: right" type="outline" size="mini"
                        @click="clearValueExpress">清除绑定
              </a-button>
              <div>
                <h4 style="font-weight: 600">该属性的值</h4>
                如果设置了该变量绑定，则以该变量绑定计算的结果为优先。
                <h4 style="font-weight: 600">用法</h4>
                输入框内默认支持变量，写法和 JS 写法完全一致。
                <li>变量: state.xxx</li>
                <li>字符串: "string"</li>
                <li>数字: 123</li>
                <li>布尔值: true / false</li>
                <li>对象: {`{ name: "张三" }`}</li>
                <li>数组: ["1", "2"]</li>
                <li>空值: null</li>
              </div>
            </a-modal>
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
import {defineComponent, type PropType, ref, unref} from 'vue'
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
      type: ComponentInstance
    }
  },
  data() {
    return {
      // 组件实例值
      componentModel: new ComponentInstance(),
      valueExpressModalVisible: false,
      valueExpress: '',
      // 由于a-modal中的on*事件，在componentMeta.properties的遍历中取的是最后一个propertySetterMeta的值
      // 这里增加这个变量，来记录当前打开的属性元数据
      currentOpenModalPropertySetterMeta: {}
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
        this.componentModel.value.propsExpress = this.componentModel.value.propsExpress || {}
        // @ts-ignore
        this.componentModel.value.slotsExpress = this.componentModel.value.slotsExpress || {}
      } else {
        // @ts-ignore
        this.componentModel = this.componentInstance
        this.componentModel.propsExpress = this.componentModel.propsExpress || {}
        this.componentModel.slotsExpress = this.componentModel.slotsExpress || {}
      }
    },
    openValueExpressModal(propertySetterMeta: IPropertySetterMeta) {
      this.currentOpenModalPropertySetterMeta = propertySetterMeta
      this.valueExpressModalVisible = true
      // @ts-ignore
      this.valueExpress = this.componentModel[propertySetterMeta.type + 'Express'][propertySetterMeta.name] || ''
    },
    clearValueExpress() {
      const propertySetterMeta = this.currentOpenModalPropertySetterMeta
      this.valueExpress = ''
      // @ts-ignore
      this.componentModel[propertySetterMeta.type + 'Express'][propertySetterMeta.name] = ''
      this.valueExpressModalVisible = false
    },
    handleOk() {
      const propertySetterMeta = this.currentOpenModalPropertySetterMeta
      // @ts-ignore
      this.componentModel[propertySetterMeta.type + 'Express'][propertySetterMeta.name] = this.valueExpress
    },
    handleCancel() {

    },
    // getComponentModel(){
    //   this.componentModel
    // }
    /**
     * 从组件实例值componentModel（componentInstance）中获取指定类型的属性值
     * @param propertyName
     * @param type 如props、slots...
     */
    // getPropertyValue(propertyName: string, type: string) {
    //   let properties = Object.getOwnPropertyDescriptor(this.componentModel, type)?.value
    //   if (!this.componentModel || !properties) {
    //     console.log('getPropertyValue > type is', type, 'and propertyName is', propertyName, ',return:undefined')
    //     return undefined
    //   }
    //   for (let key in properties) {
    //     if (key === propertyName) {
    //       console.log('getPropertyValue > type is', type, 'and propertyName is', propertyName, ',return:', properties[key], 'form properties:', properties)
    //       return properties[key]
    //     }
    //   }
    // },
    // setPropertyValue(propertyName: string, value: any, type: string) {
    //   console.log('setPropertyValue > propertyName:', propertyName, ', value:', value, ', type:', type)
    //   let properties = Object.getOwnPropertyDescriptor(this.componentModel, type)?.value
    //   // console.log('setPropertyValue before> properties:', properties)
    //   let rawProperties = unref(properties)
    //   if (properties) {
    //     let isExistProperty = false
    //     for (let key in rawProperties) {
    //       // console.log('key:', key, 'propertyName:', propertyName, key === propertyName)
    //       if (key === propertyName) {
    //         rawProperties[key] = value
    //         isExistProperty = true
    //         break
    //       }
    //     }
    //     // 如果properties存在，但properties中不存在该propertyName
    //     if (!isExistProperty) {
    //       rawProperties[propertyName] = value
    //     }
    //   } else {
    //     // 如果properties不存在，初始该类型(如props、slots...)的properties
    //     properties = ref({[propertyName]: value})
    //   }
    //   // @ts-ignore
    //   this.componentModel[type] = properties
    //   console.log('setPropertyValue  after> properties:', properties)
    //   console.log('setPropertyValue update componentModel:', this.componentModel)
    //   this.$emit("update:componentInstance", this.componentModel)
    // },
    // getPropertyArrayValue(type: string) {
    //   console.log('getPropertyArrayValue', type, Object.getOwnPropertyDescriptor(this.componentModel, type)?.value)
    //   return Object.getOwnPropertyDescriptor(this.componentModel, type)?.value || []
    // },
    // setPropertyArrayValue(propertyName: string, value: any, type: string) {
    //   let properties = Object.getOwnPropertyDescriptor(this.componentModel, type)?.value
    //   console.log('setPropertyArrayValue > properties:', properties)
    //   // @ts-ignore
    //   this.componentModel[type] = properties
    //   this.$emit("update:componentInstance", this.componentModel)
    // },
  }
})
</script>

<style scoped>
</style>
