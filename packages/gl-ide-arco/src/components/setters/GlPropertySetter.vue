<!--
  组件的属性的通用配置器
-->
<template>
  <div class="gl-property-setter gl-table-row"
       v-if="propertySetterMeta.setterComponentName!=='GlEmptySetter'&&propertySetterMeta.show!==false">
    <div :class="cellDisplayModeClass" class="gl-label" style="position: relative;"
         :style="{width: isCollapseDisplayMode?'100%':'7em'}"
         @dblclick.ctrl="tryClearProp(propertySetterMeta.name)" title="">
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
              @click="propertySetterMeta.expanded=!propertySetterMeta.expanded">&nbsp;
          {{ propertySetterMeta.title }}
        </span>
      </template>
      <template v-if="!isCollapseDisplayMode">
         <span v-if="propertySetterMeta.description">
          <GlIconfont type="gl-info-circle" :title="propertySetterMeta.description"></GlIconfont>
        </span>
        <span>&nbsp;{{ propertySetterMeta.title }}</span>
      </template>
    </div>
    <!-- 这里需用 v-show，确保各属性都初始化，属性之间的数据依赖才能正常   -->
    <div :class="cellDisplayModeClass" v-show="propertySetterMeta.expanded!==false">
      <div style="display: flex">
        <div style="flex: auto">
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
                                      :propertyValue="slotProps.item[property.name]"
                                      @set:propertyValue="newValue=>slotProps.item[property.name]=newValue"
                                      @update="($event:any)=>{slotProps.item[property.name]=$event}">
                      <div v-if="property.enableValueExpress">
                        <!--设置属性表达式_propsExpression的初始值为：{}-->
                        <template v-if="typeof slotProps.item._propsExpressions==='object'?true:slotProps.item._propsExpressions={}"></template>
                        <GlExpressionSetter
                            v-model="slotProps.item._propsExpressions[property.name]"></GlExpressionSetter>
<!--                        <GlExpressionSetter-->
<!--                            v-model="slotProps.item[property.type + 'Expressions'][property.name]"></GlExpressionSetter>-->
                      </div>
                    </GlPropertySetter>
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
                                      :propertyValue="propertyModel[subPropertySetterMeta.name]"
                                      @set:propertyValue="newValue=>propertyModel[subPropertySetterMeta.name]=newValue"
                                      @update="onSubPropertyUpdate(subPropertySetterMeta.name,$event)">
                      <div v-if="subPropertySetterMeta.enableValueExpress">
                        <!--设置属性表达式_propsExpression的初始值为：{}-->
                        <template v-if="typeof propertyModel._propsExpressions==='object'?true:propertyModel._propsExpressions={}"></template>
                        <GlExpressionSetter
                            v-model="propertyModel._propsExpressions[subPropertySetterMeta.name]"></GlExpressionSetter>
                      </div>
                    </GlPropertySetter>
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
                  <GlPropertySetter v-if="propertyModel" :propertySetterMeta="property"
                                    :propertyValue="slotProps.item.props[property.name]"
                                    @set:propertyValue="newValue=>slotProps.item.props[property.name]=newValue"
                                    @update="($event:any)=>{slotProps.item.props[property.name]=$event}">
                    <div v-if="propertySetterMeta.enableValueExpress">
                      <GlExpressionSetter
                          v-model="slotProps.item[propertySetterMeta.type + 'Expressions'][propertySetterMeta.name]"></GlExpressionSetter>
                    </div>
                  </GlPropertySetter>
                </template>
              </div>
            </GlPropertySetterCard>
          </template>
        </div>
        <div v-if="propertySetterMeta.enableValueExpress" style="flex: 1;max-width: 2em;min-width: 2em">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "GlPropertySetter"
}
</script>
<script setup lang="ts">
// @ts-nocheck
import {computed, inject, onMounted, onUpdated, type PropType, reactive, ref, toRaw, watch} from 'vue'
import type {PropertySetterMetaImpl} from "@geelato/gl-ui-schema";
import ComponentSetterProvideProxy, {ComponentSetterProvideKey} from "./ComponentSetterProvideProxy";

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!
let initialized = false
// set:propertyValue 初始化或后续值改变时会触发该事件：
// change:propertyValue 初始化之后，值改变时触发，初始化时不触发
const emits = defineEmits(['update', 'set:propertyValue', 'change:propertyValue'])
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

const propertyModel = ref<any>(props.propertyValue)
const isCollapseDisplayMode = props.displayMode === 'collapse'
const displayModeClass = computed(() => {
  return {["gl-display-mode-" + props.displayMode || 'default']: true}
})
const cellDisplayModeClass = computed(() => {
  return isCollapseDisplayMode ? {"gl-table-cell-collapse": true} : {"gl-table-cell": true}
})

onUpdated(() => {
  setPropertyModel(false)
})

watch(() => {
  return propertyModel
}, (val, oval) => {
  // console.log('set property', props.propertySetterMeta?.name, ' and set value as ', val)
  emits("set:propertyValue", val)
  if (initialized) {
    // console.log(`change property "${props.propertySetterMeta?.name}"  val:`, val)
    // console.log(`change property "${props.propertySetterMeta?.name}" oval:`, oval)
    emits("change:propertyValue", val)
  }
  componentSetterProvideProxy.setPropValue(props.propertySetterMeta?.name, val?.value)
  // emits("update", val)
}, {deep: true, immediate: true})

const setPropertyModel = (isCreate: boolean) => {
  propertyModel.value = props.propertyValue
  if (!propertyModel.value) {
    if (props.propertySetterMeta.type === 'slots') {
      propertyModel.value = {
        componentName: props.propertySetterMeta.slotComponentName,
        props: undefined,
        propsTarget: props.propertySetterMeta.slotComponentBindTarget,
        propsName: props.propertySetterMeta.slotComponentBindName
      }
    } else {
      if (isCreate && props.propertySetterMeta.setterDefaultValue !== undefined) {
        // 若组件配置了默认值，则设置默认值
        propertyModel.value = props.propertySetterMeta.setterDefaultValue
      } else {
        // 若组件未配置默认值，则按类型进行设置值设置
        if (props.propertySetterMeta.properties && props.propertySetterMeta.properties.length > 0) {
          if (props.propertySetterMeta.type === 'children' || props.propertySetterMeta.setterComponentName === 'GlObjectArraySetter') {
            propertyModel.value = []
          } else {
            propertyModel.value = {}
          }
        }
      }
    }
  }
  // console.log('setPropertyModel>', props.propertySetterMeta, props.propertyValue, propertyModel.value)
}
setPropertyModel(true)


/**
 * 属性设置之后会影响原组件的默认值设置，可以该将改属性删除，需要时再添加
 * @param propertyName
 */
const tryClearProp = (propertyName: String) => {
  // delete props.propertyModel[propertyName]
}
const onSubPropertyUpdate = (name: String, value: any) => {
  // console.log('onSubPropertyUpdate>', name, value)
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
initialized = true
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
