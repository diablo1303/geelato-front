<!--
  组件的属性配置器
-->
<template>
  <div class="gl-property-setter gl-table-row"
       v-if="propertySetterMeta.setterComponentName!=='GlEmptySetter'&&propertySetterMeta.show!==false">
    <div :class="cellDisplayModeClass" class="gl-label" style="position: relative;" :style="{width: isCollapseDisplayMode?'100%':'7em'}"
         @dblclick.ctrl="tryClearProp(propertySetterMeta.name)" title="按住Ctrl，双击清除该属性，恢复初始状态">
      <template v-if="isCollapseDisplayMode">
        <GlIconfont type="gl-left-circle" style="cursor: pointer;margin-left: 0.5em"
                    v-if="propertySetterMeta.expanded!==false"
                    @click="propertySetterMeta.expanded=false"></GlIconfont>
        <GlIconfont type="gl-down-circle" style="cursor: pointer;margin-left: 0.5em"
                    v-if="propertySetterMeta.expanded===false"
                    @click="propertySetterMeta.expanded=true"></GlIconfont>
        <span v-if="propertySetterMeta.description">
          <GlIconfont type="gl-info-circle" :title="propertySetterMeta.description"></GlIconfont>
        </span>
        <span style="cursor:pointer;font-weight: 580"
              @click="propertySetterMeta.expanded=!propertySetterMeta.expanded">&nbsp;{{ propertySetterMeta.title }}</span>
      </template>
      <template v-if="!isCollapseDisplayMode">
         <span v-if="propertySetterMeta.description">
          <GlIconfont type="gl-info-circle" :title="propertySetterMeta.description"></GlIconfont>
        </span>
        <span>&nbsp;{{ propertySetterMeta.title }}</span>
      </template>
    </div>
    <div :class="cellDisplayModeClass" v-if="propertySetterMeta.expanded!==false">
      <!-- 1 ========================type为props或默认为空========================-->
      <template v-if="propertySetterMeta.type==='props'||!propertySetterMeta.type">
        <!-- 1.1 ========================GlObjectArraySetter========================-->
        <template v-if="propertySetterMeta.setterComponentName==='GlObjectArraySetter'">
          <!--  若有子属性properties，则迭代子属性 -->
          <GlPropertySetterCard v-slot:default="slotProps" v-model="propertyModel"
                                :maxCount="propertySetterMeta.setterComponentProps.maxCount"
                                :titleField="propertySetterMeta.titleField"
                                :autoAddWhenEmpty="false"
                                :elementTemplate="createChildObjectTemplate()"
                                @selectedElement="selectChildElement"
          >
            <!-- 通过属性元数据，定义每张卡片的内容  -->
            <div class="gl-table" :class="{'gl-table-as-tree':false}">
              <template v-for="property in propertySetterMeta.properties">
                <GlPropertySetter v-if="propertyModel" :propertySetterMeta="property"
                                  v-model:propertyValue="slotProps.item[property.name]"
                                  @update="($event:any)=>{slotProps.item[property.name]=$event}"></GlPropertySetter>
              </template>
            </div>
          </GlPropertySetterCard>

          <!--          <template v-if="propertySetterMeta.properties&&propertySetterMeta.properties.length>0">-->
          <!--            <div class="gl-table" :class="{'gl-table-as-tree':false}" style="margin: 1px;border: 1px solid #e4e4e4">-->
          <!--              <template v-for="property in propertySetterMeta.properties">-->
          <!--                <GlPropertySetter v-if="propertyModel" :propertySetterMeta="property"-->
          <!--                                  :propertyValue="propertyModel[property.name]"-->
          <!--                                  @update="onSubPropertyUpdate(property.name,$event)"></GlPropertySetter>-->
          <!--              </template>-->
          <!--            </div>-->
          <!--          </template>-->
        </template>
        <!-- 1.2 ========================GlJsonObjectSetter========================-->
        <template v-else-if="propertySetterMeta.setterComponentName==='GlSimpleObjectSetter'">
          <template v-if="propertySetterMeta.properties&&propertySetterMeta.properties.length>0">
            <div class="gl-table" :class="{'gl-table-as-tree':false}" style="margin: 1px;border: 1px solid #e4e4e4">
              <template v-for="subPropertySetterMeta in propertySetterMeta.properties">
                <GlPropertySetter v-if="propertyModel" :propertySetterMeta="subPropertySetterMeta"
                                  v-model:propertyValue="propertyModel[subPropertySetterMeta.name]"
                                  @update="onSubPropertyUpdate(subPropertySetterMeta.name,$event)"></GlPropertySetter>
              </template>
            </div>
          </template>
        </template>
        <!-- 1.3 ========================其它Setter,大部分的为该类========================-->
        <!--        v-model:[propertySetterMeta.setterComponentVModelName]-->
        <template v-else>
          <component :is="propertySetterMeta.setterComponentName"
                     v-model:[propertySetterMeta.setterComponentVModelName]="propertyModel"
                     v-bind="propertySetterMeta.setterComponentProps"
                     :style="propertySetterMeta.style"
                     :placeholder="propertySetterMeta.placeholder"
          >
          </component>
        </template>
      </template>
      <!-- 2 ========================type为slots========================-->
      <template v-else-if="propertySetterMeta.type==='slots'">
        <component v-if="propertyModel" :is="propertySetterMeta.setterComponentName"
                   v-model:[propertySetterMeta.setterComponentVModelName]="propertyModel.props"
                   v-bind="propertySetterMeta.setterComponentProps"
                   :style="propertySetterMeta.style"
                   :placeholder="propertySetterMeta.placeholder"
        ></component>
      </template>
      <!-- 3 ========================type为children========================-->
      <template v-else-if="propertySetterMeta.type==='children'">
        <GlPropertySetterCard v-slot:default="slotProps" v-model="propertyModel"
                              :maxCount="propertySetterMeta.setterComponentProps.maxCount"
                              :titleField="propertySetterMeta.titleField"
                              :elementTemplate="createChildElementTemplate(propertySetterMeta.name,propertySetterMeta.setterComponentProps.ChildComponentName)"
                              @selectedElement="selectChildElement"
        >
          <!-- 通过属性元数据，定义每张卡片的内容  -->
          <div class="gl-table" :class="{'gl-table-as-tree':false}">
            <template v-for="property in propertySetterMeta.properties">
              {{ slotProps.item.props }}{{ propertyModel }}
              <GlPropertySetter v-if="propertyModel" :propertySetterMeta="property"
                                v-model:propertyValue="slotProps.item.props[property.name]"
                                @update="($event:any)=>{slotProps.item.props[property.name]=$event}"></GlPropertySetter>
            </template>
          </div>
        </GlPropertySetterCard>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "GlPropertySetter"
}
</script>
<script setup lang="ts">
import {computed, onMounted, onUpdated, type PropType, reactive, ref, watch} from 'vue'
import type {PropertySetterMetaImpl} from "@geelato/gl-ui-schema";
import {utils} from "@geelato/gl-ui";

const emits = defineEmits(['update', 'update:propertyValue'])
const props = defineProps({
  /**
   *  属性的配置展示模式
   */
  displayMode: String,
  propertySetterMeta: {
    type: Object as PropType<PropertySetterMetaImpl>,
    required: true
  },
  propertyValue: [String, Number, Boolean, Array, Object, Date, Function, Symbol]
})

const propertyModel = ref(props.propertyValue)
const isCollapseDisplayMode = props.displayMode === 'collapse'
const displayModeClass = computed(() => {
  return {["gl-display-mode-" + props.displayMode || 'default']: true}
})
const cellDisplayModeClass = computed(() => {
  return isCollapseDisplayMode ? {"gl-table-cell-collapse": true} : {"gl-table-cell": true}
})


onUpdated(() => {
  setPropertyModel()
})

watch(() => {
  return propertyModel
}, (val, oval) => {
  console.log('update property', props.propertySetterMeta?.name, ' and set value as ', val)
  emits("update:propertyValue", val)
  // emits("update", val)
}, {deep: true})

const setPropertyModel = () => {
  // @ts-ignore
  propertyModel.value = props.propertyValue
  if (!propertyModel.value) {
    if (props.propertySetterMeta.type === 'slots') {
      // @ts-ignore
      propertyModel.value = {
        componentName: props.propertySetterMeta.slotComponentName,
        props: undefined,
        propsTarget: props.propertySetterMeta.slotComponentBindTarget
      }
    } else {
      if (props.propertySetterMeta.properties && props.propertySetterMeta.properties.length > 0) {
        if (props.propertySetterMeta.type === 'children' || props.propertySetterMeta.setterComponentName === 'GlObjectArraySetter') {
          // @ts-ignore
          propertyModel.value = []
        } else {
          // @ts-ignore
          propertyModel.value = {}
        }
      }
    }
  }
  console.log('setPropertyModel>', props.propertySetterMeta, props.propertyValue, propertyModel.value)
}
setPropertyModel()


/**
 * 属性设置之后会影响原组件的默认值设置，可以该将改属性删除，需要时再添加
 * @param propertyName
 */
const tryClearProp = (propertyName: String) => {
  // delete props.propertyModel[propertyName]
}
const onSubPropertyUpdate = (name: String, value: any) => {
  console.log('onSubPropertyUpdate>', name, value)
  // TODO
  // @ts-ignore
  propertyModel.value[name] = value
}
/**
 * 用于创建子对象
 */
const createChildObjectTemplate = () => {
  return reactive({})
}
/**
 * 用于创建子组件
 * @param childName
 * @param childComponentName
 */
const createChildElementTemplate = (childName: String, childComponentName: String) => {
  return reactive({
    id: '',
    groupName: childName,
    componentName: childComponentName,
    props: {},
    slots: {},
    children: []
  })
}
const selectChildElement = () => {

}
</script>

<style>

.gl-property-setter .gl-label {
  height: 40px;
  line-height: 40px;
  font-weight: 500;
  border-bottom: solid 1px #e7e7e7;
}

.gl-property-setter .gl-table.gl-table-as-tree > .gl-table-row > .gl-table-cell.gl-label {
  padding-left: 1em;
  height: 32px;
  line-height: 32px;
  width: 100% !important;
  background-color: #FFF;
}

.gl-property-setter .gl-table.gl-table-as-tree > .gl-table-row > .gl-table-cell {
  height: auto;
  text-align: left;
  display: block;
}


.gl-property-setter .triangle-top-left {
  /*position: absolute;*/
  /*top: -8px;*/
  /*left: 10px;*/
  width: 0;
  height: 0;
  border-top: 100px solid red;
  border-right: 100px solid transparent;
}
</style>
