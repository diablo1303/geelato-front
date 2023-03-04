<template>
  <div class="gl-table" :class="{'gl-table-as-tree':false}">
    <!--需保障currentSelectedComponentMeta有且有正确的数据，否则该属性值会马上影响舞台上的组件展示-->
    <template v-for="propertySetterMeta in componentMeta.properties">
      <GlPropertySetter :propertySetterMeta="propertySetterMeta"
                        :propertyValue="getPropertyValue(propertySetterMeta.name,propertySetterMeta.type||'props')"
                        @update="(val)=>{setPropertyValue(propertySetterMeta.name,val,propertySetterMeta.type||'props')}">
      </GlPropertySetter>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, unref} from 'vue'
import {utils,LooseObject} from "@geelato/gl-ui";
import {ComponentSetterMetaImpl} from "@geelato/gl-ui-schema";

export default defineComponent({
  name: "GlComponentPropertiesSetter",
  components: {},
  props: {
    /**
     *  属性的配置展示模式
     */
    displayMode: String,
    componentMeta: {
      type: [ComponentSetterMetaImpl, Object],
      required: true
    },
    componentInstance: {
      type: LooseObject
    }
  },
  data() {
    return {
      // 组件实例值
      componentModel: new LooseObject()
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
        defaultComponentModel[this.componentMeta.name] = undefined
        this.componentModel = ref(defaultComponentModel)
      } else {
        this.componentModel = this.componentInstance
      }
    },
    /**
     * 从组件实例值componentModel（componentInstance）中获取指定类型的属性值
     * @param propertyName
     * @param type 如props、slots...
     */
    getPropertyValue(propertyName: string, type: string) {
      let properties = Object.getOwnPropertyDescriptor(this.componentModel, type)?.value
      if (!this.componentModel || !properties) {
        // console.log('getPropertyValue > type is', type, 'and propertyName is', propertyName, ',return:undefined')
        return undefined
      }
      for (let key in properties) {
        if (key === propertyName) {
          // console.log('getPropertyValue > type is', type, 'and propertyName is', propertyName, ',return:', properties[key], 'form properties:', properties)
          return properties[key]
        }
      }
    },
    setPropertyValue(propertyName: string, value: any, type: string) {
      console.log('setPropertyValue > propertyName:', propertyName, ', value:', value, ', type:', type)
      let properties = Object.getOwnPropertyDescriptor(this.componentModel, type)?.value
      // console.log('setPropertyValue before> properties:', properties)
      let rawProperties = unref(properties)
      if (properties) {
        let isExistProperty = false
        for (let key in rawProperties) {
          // console.log('key:', key, 'propertyName:', propertyName, key === propertyName)
          if (key === propertyName) {
            rawProperties[key] = value
            isExistProperty = true
            break
          }
        }
        // 如果properties存在，但properties中不存在该propertyName
        if (!isExistProperty) {
          rawProperties[propertyName] = value
        }
      } else {
        // 如果properties不存在，初始该类型(如props、slots...)的properties
        properties = ref({[propertyName]: value})
      }
      this.componentModel[type] = properties
      console.log('setPropertyValue  after> properties:', properties)
      console.log('setPropertyValue update componentModel:', this.componentModel)
      this.$emit("update", this.componentModel)
    },
    getPropertyArrayValue(type: string) {
      console.log('getPropertyArrayValue', type, Object.getOwnPropertyDescriptor(this.componentModel, type)?.value)
      return Object.getOwnPropertyDescriptor(this.componentModel, type)?.value || []
    },
    setPropertyArrayValue(propertyName: string, value: any, type: string) {
      let properties = Object.getOwnPropertyDescriptor(this.componentModel, type)?.value
      console.log('setPropertyArrayValue > properties:', properties)
      this.componentModel[type] = properties
      this.$emit("update", this.componentModel)
    },
  }
})
</script>

<style scoped>
</style>
