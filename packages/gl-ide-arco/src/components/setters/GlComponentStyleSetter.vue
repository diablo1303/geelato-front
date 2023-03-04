<template>
  <div class="gl-component-style-setter">
    <a-collapse v-model:activeKey="activeKey" :default-active-key="[1,2,3,4,5]" :bordered="false" @change="changeActiveKey">
      <a-collapse-item key="1" header="布局与大小">
        <div class="gl-table">
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">宽度</div>
            <div class="gl-table-cell"><a-input v-model="componentModel.style.width" placeholder="例如：200px" allowClear></a-input></div>
          </div>
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">高度</div>
            <div class="gl-table-cell"><a-input v-model="componentModel.style.height" placeholder="例如：200px" allowClear></a-input></div>
          </div>
        </div>
      </a-collapse-item>
      <a-collapse-item key="2" header="文字">
        <div class="gl-table">
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">字号</div>
            <div class="gl-table-cell"><a-input v-model="componentModel.style.fontSize" placeholder="例如：14px或1.2em" allowClear></a-input></div>
          </div>
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">行高</div>
            <div class="gl-table-cell"><a-input v-model="componentModel.style.lineHeight" placeholder="例如：14px或1.2em"></a-input></div>
          </div>
        </div>
      </a-collapse-item>
      <a-collapse-item key="3" header="背景">
        待支持
      </a-collapse-item>
      <a-collapse-item key="4" header="位置">
        待支持
      </a-collapse-item>
      <a-collapse-item key="5" header="边框">
        待支持
      </a-collapse-item>
    </a-collapse>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {ComponentSetterMetaImpl} from "@geelato/gl-ui-schema";
import {LooseObject} from "@geelato/gl-ui";

export default defineComponent({
  name: "GlComponentStyleSetter",
  props: {
    /**
     *  属性的配置展示模式
     */
    componentMeta: {
      type: [ComponentSetterMetaImpl, Object],
      required: true
    },
    componentInstance: {
      type: LooseObject
    }
  },
  data(){
    return {
      activeKey:"1",
      // 组件实例值
      componentModel: new LooseObject()
    }
  },
  created() {
    this.setComponentModel()
  },
  updated() {
    // this.setComponentModel()
  },
  watch:{
    'componentModel.style':{
      handler:function (val){
        this.$emit("update", this.componentModel)
      },
      deep:true
    }
  },
  methods:{
    setComponentModel(){
      this.componentModel = this.componentInstance || {style:{}}
      this.componentModel.style = this.componentModel.style || {}
    },
    changeActiveKey(key: string){

    }
  }
})
</script>

<style>

.gl-component-style-setter .gl-table-cell.gl-label{
  width: 7em;
}
.gl-component-style-setter .gl-table-cell{
  line-height: 32px;
}

.gl-component-style-setter .ant-collapse-header{
  padding: 6px !important
}
.gl-component-style-setter .ant-collapse-header > div{
  line-height:1.2em
}
.gl-component-style-setter .ant-collapse-content-box{
  padding: 1px;
}

</style>
