<template>
  <div>
    <span>模式：</span>
    <a-radio-group size="small" v-model="mode">
      <a-radio value='SECRET_COMBOBOX_MODE_DO_NOT_USE'>单选</a-radio>
      <a-radio value="multiple">多选</a-radio>
      <a-radio value="tags">标签</a-radio>
    </a-radio-group>
    <span>&nbsp;&nbsp;可选项：</span>
    <GlOptions v-model="theProps.dataItems"
                        :columns="[{dataIndex: 'label'},{dataIndex: 'value'}]"></GlOptions>
  </div>
</template>

<script lang="ts">
import {reactive} from "vue";
import GlOptions from "../../setters/GlOptions.vue";

export default {
  name: "SelectPropsSetter",
  components:{GlOptions},
  props:{
    mode:String,
    options:Array
  },
  data:{
    theProps:{
      //@ts-ignore
      mode:this.mode,
      //@ts-ignore
      dataItems:this.options || reactive([])
    }
  }
}
</script>

<style scoped>

</style>