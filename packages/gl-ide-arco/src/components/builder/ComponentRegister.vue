<template>
  <div class="gl-component-register">
    <!--:push-other-panes="false"-->
    <splitpanes class="default-theme gl-bg-white" style="height:695px;background-color:#FFF">
      <pane :size="paneSize.A" :min-size="paneSize.A" :max-size="paneSize.A"
            style="padding-right: 0.5em;overflow-y: auto">
        <div class="gl-title">
          <span>
            <GlIconfont type="gl-info-circle"></GlIconfont>
          组件【基本】元数据
          </span>
        </div>
        <div>
          <table class="gl-table" style="font-weight: normal">
            <tr>
              <td class="gl-table-cell gl-label" style="width: 4em">分组</td>
              <td class="gl-table-cell">
                <a-radio-group size="small" v-model="componentMeta.group"
                               v-if="componentMeta.group=componentMeta.group||'other'">
                  <a-radio value="layout">布局</a-radio>
                  <a-radio value="form">表单</a-radio>
                  <a-radio value="other">其它</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label">标题</td>
              <td class="gl-table-cell">
                <a-input v-model="componentMeta.title" placeholder="title"/>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label">名称</td>
              <td class="gl-table-cell">
                <a-input v-model="componentMeta.componentName" placeholder="组件名，如:AInput" title="componentName"/>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label" title="用于作为id的前缀">别名</td>
              <td class="gl-table-cell">
                <a-input v-model="componentMeta.alias" placeholder="alias"/>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label" title="进属性进行打包">包名</td>
              <td class="gl-table-cell">
                <a-input v-model="componentMeta.propsWrapper"/>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label" title="是否可在设置器中拖放使用">拖放</td>
              <td class="gl-table-cell">
                <!--                <a-input v-model="componentMeta.draggable"/>-->
                <a-radio-group size="small" v-model="componentMeta.draggable" title="是否可在设置器中拖放使用">
                  <a-radio value=true>可以</a-radio>
                  <a-radio value=false>不可以</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label" title="属性面板的显示模式">显示</td>
              <td class="gl-table-cell">
                <template v-if="componentMeta.diplayMode=componentMeta.diplayMode||'Tile'"></template>
                <a-radio-group size="small" v-model="componentMeta.diplayMode">
                  <a-radio value="Collapse">折叠模式</a-radio>
                  <a-radio value="Tile">平铺模式</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="gl-table-cell gl-label">面板</td>
              <td class="gl-table-cell">
                <a-input v-model="componentMeta.panels"/>
              </td>
            </tr>
          </table>
        </div>
        <div class="gl-title">
          <span>
            <GlIconfont type="gl-unorderedlist"></GlIconfont>
          组件【属性】元数据
          </span>
        </div>
        <div>
          <GlOptions v-model="componentMeta.properties" :columns="[{dataIndex: 'name'}]" :allowAddSub="true"
                              @selectedElement="selectProperty"></GlOptions>
        </div>
        <!--<div class="gl-title">-->
        <!--<span>-->
        <!--<GlIconfont type="gl-unorderedlist"></GlIconfont>-->
        <!--组件【子组件】元数据-->
        <!--</span>-->
        <!--</div>-->
        <!--<div>-->
        <!--<GlOptions v-model="componentMeta.children" :columns="[{dataIndex: 'name'}]"-->
        <!--@selectedElement="selectChild"></GlOptions>-->
        <!--</div>-->
        <div class="gl-title">
          <span>
            <GlIconfont type="gl-unorderedlist"></GlIconfont>
          组件【事件】元数据
          </span>
        </div>
        <div>
          <GlOptions v-model="componentMeta.actions" :columns="[{dataIndex: 'name'}]"
                              @selectedElement="selectMethod"></GlOptions>
        </div>
      </pane>
      <!--
       ========================================================================================
       -->
      <pane :size="paneSize.B">
        <splitpanes horizontal class="default-theme gl-bg-white" style="background-color:#FFF">
          <pane size="80" style="padding-right: 0.5em">
            <div class="gl-title">
              <span>
                <GlIconfont type="gl-setting"/>
              组件【属性】元数据设置 ({{ (currentProperty.name || '未设置') }})
              </span>
            </div>
            <template v-if="currentProperty.name">
              <SettingBuilder v-model:modelValue="currentProperty"></SettingBuilder>
            </template>
            <template v-else>
              <div style="text-align: center;padding: 2em;background-color: #fafafa">请先从左边面板添加属性</div>
            </template>
          </pane>
          <pane size="20" style="overflow-y: scroll">
            <div class="gl-title">
              <span>
                <GlIconfont type="gl-json"/>
              组件元数据设置结果
              </span>
            </div>
            <div style="background-color: #fafafa;padding: 0 0.5em;min-height: 4em">
              {{ componentMeta }}
            </div>
          </pane>
        </splitpanes>
      </pane>
      <!--
      ========================================================================================
      -->
      <pane :size="paneSize.C" style="overflow-y: auto">
        <div class="gl-title">
          <span>
             <GlIconfont type="gl-eye"/>
          生成属性设置面板预览（{{ componentMeta.componentName || '未设置' }}）
          </span>
        </div>
        <GlPropertySetter :componentMeta="componentMeta" v-model:propertyInstance="componentInstance.props"
                           v-model:slotsInstance="componentInstance.slots" v-model:childrenInstance="componentInstance.children"></GlPropertySetter>
      </pane>
      <!--
      ========================================================================================
      -->
      <pane :size="100-paneSize.A-paneSize.B-paneSize.C">
        <template v-if="refreshInstanceFlag">
          <splitpanes horizontal class="default-theme gl-bg-white" style="background-color:#FFF">
            <pane size="80">
              <div class="gl-title">
              <span>
                 <GlIconfont type="gl-eye"/>
              生成组件实例预览（{{ componentMeta.componentName || '未设置' }}）
              </span>
                <a-button-group>
                  <a-button style="float: right" @click="refreshInstance">刷新</a-button>
                  <a-button @click="previewEnable=!previewEnable;refreshInstance()">{{
                      previewEnable ? '关闭预览' : '启用预览'
                    }}
                  </a-button>
                </a-button-group>
              </div>
              <div v-if="previewEnable">
                <template v-if="componentInstance.id&&componentInstance.componentName">
                  <gl-component :glComponentInst="componentInstance">
                  </gl-component>
                </template>
              </div>
            </pane>
            <pane size="20" v-if="previewEnable">
              <div class="gl-title">
              <span>
                <GlIconfont type="gl-json"/>
              生成组件实例代码
              </span>
              </div>
              <div style="background-color: #fafafa;padding: 0 0.5em;min-height: 4em">
                {{ componentInstance }}
              </div>
            </pane>
          </splitpanes>
        </template>
      </pane>
    </splitpanes>
  </div>
</template>

<script lang="ts">
import {utils} from "@geelato/gl-ui";
import {Splitpanes, Pane} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import {defineComponent, nextTick} from 'vue'
import SettingBuilder from './SettingBuilder.vue'
// import GlSettingProperty from '../setting/GlPropertySetting.vue'
import GlOptions from "../setters/GlOptions.vue";
import GlPropertySetter from "../../components/setters/GlPropertySetter.vue";

export default defineComponent({
  name: "ComponentRegister",
  components: {GlPropertySetter, SettingBuilder, Splitpanes, Pane,GlOptions},
  props: {
    modelValue: {
      type: Object,
      default() {
        return {
          runtimeMeta: {
            // title: '',
            // componentName: '',
            // alias: '',
            // properties: []
          },
          designMeta: {}
        }
      }
    },
    // create update
    action: String
  },
  data() {
    return {
      previewEnable: false,
      componentMeta: this.modelValue.designMeta,
      currentProperty: {},
      currentIndex: -1,
      paneSize: {
        A: 0,
        B: 30,
        C: 30
      },
      componentInstance: this.modelValue.runtimeMeta || {
        id: '',
        props: {},
        // {name: 'icon', value: 'sdfsdf'}
        slots: {},
        children: {}
      },
      // 该属性需配置的面板
      // panels: []
      refreshInstanceFlag: true
    }
  },
  watch: {
    'componentMeta.componentName': {
      handler: function (val, oval) {
        this.componentInstance.componentName = val
        this.emitUpdate()
      },
      immediate: true
    },
    'componentMeta.alias': {
      handler: function (val, oval) {
        this.componentInstance.id = this.modelValue.runtimeMeta.id || utils.gid(val)
        this.componentInstance.templateId = this.modelValue.runtimeMeta.templateId || utils.gid(val)
        this.emitUpdate()
      },
      immediate: true
    },
    'componentMeta.title': {
      handler: function (val, oval) {
        this.componentInstance.title = val
        this.emitUpdate()
      },
      immediate: true
    },
    'componentMeta.group': {
      handler: function (val, oval) {
        this.componentInstance.group = val
        this.emitUpdate()
      },
      immediate: true
    },
    'componentMeta.propsWrapper': {
      handler: function (val, oval) {
        this.componentInstance.propsWrapper = val
        this.emitUpdate()
      },
      immediate: true
    },
    'componentMeta.draggable': {
      handler: function (val, oval) {
        this.componentInstance.draggable = val
        this.emitUpdate()
      },
      immediate: true
    }
  },
  created() {
    this.componentInstance.id = this.modelValue.runtimeMeta.id
    this.componentInstance.templateId = this.modelValue.runtimeMeta.templateId
  },
  mounted() {
    // this.componentInstance = this.modelValue.runtimeMeta || this.componentInstance
    this.paneSize.A = 15
  },
  methods: {
    addProperty() {
      this.currentProperty = {name: ''}
      this.componentMeta.properties.push(this.currentProperty)
      this.currentIndex = this.componentMeta.properties.length - 1
      this.emitUpdate()
    },
    selectProperty({element, index}) {
      this.currentProperty = element
      this.currentIndex = index
      if (this.currentIndex === -1) {
        this.currentProperty = {}
      }
    },
    selectChild() {

    },
    selectMethod() {

    },
    emitUpdate() {
      this.$emit('update:modelValue', {runtimeMeta: this.componentInstance, designMeta: this.componentMeta})
    },
    refreshInstance() {
      let that = this
      this.refreshInstanceFlag = false
      nextTick(function () {
        that.refreshInstanceFlag = true
      })
    }
  }
})
</script>

<style>

.gl-component-register .gl-title {
  margin: 1em 1em;
  font-weight: bold;
}

.gl-component-register-property-item {
  width: 100%;
  text-align: center;
  padding: 0;
  border-top: 0px;
  /*border-right: 1px solid #178df7;*/
  /*border-bottom: 1px solid #178df7;*/
  /*border-left: 1px solid #178df7;*/
  background-color: #eeeeee;
  margin: 0.5em 0;
  margin-left: 2px
}

.gl-component-register-property-item.gl-selected {
  box-shadow: 0 0 0 2px #178df7;
}

.gl-component-register-property-item > input {
  background-color: #eeeeee;
}

.gl-component-register-property-item.gl-first {
  /*border-top: 1px solid #178df7;*/
}

.splitpanes.gl-bg-white .splitpanes__pane {
  background-color: #FFF;
}
</style>
