<template>
  <table class="gl-table">
    <tr>
      <td class="gl-table-cell gl-label">实体编码</td>
      <td class="gl-table-cell">
        <a-select v-model="mv.entity" @change="onEntityChange" allowSearch>
          <a-option v-for="item in entityStore.entityLiteMetas" :value="item.entityName">{{item.entityTitle}} {{item.entityName}}</a-option>
        </a-select>
      </td>
    </tr>
    <!--========================= 查询列 ===========================-->
    <tr>
      <td class="gl-table-cell gl-label">数据列</td>
      <td class="gl-table-cell">
        <GlFieldsSetter v-model="mv.fields" :entityFieldMetas="entityStore.currentFieldMetas" @changeElement="onUpdate"></GlFieldsSetter>
      </td>
    </tr>
   <!--=========================查询参数===========================-->
    <tr>
      <td class="gl-table-cell gl-label">数据筛选</td>
      <td class="gl-table-cell">
        <GlParamsSetter v-model="mv.params" :entityFieldMetas="entityStore.currentFieldMetas" @changeElement="onUpdate"></GlParamsSetter>
      </td>
    </tr>
    <!--=========================查询参数===========================-->
    <tr>
      <td class="gl-table-cell gl-label">排序字段</td>
      <td class="gl-table-cell">
        <GlOrderSetter v-model="mv.order" :entityFieldMetas="entityStore.currentFieldMetas" @changeElement="onUpdate"></GlOrderSetter>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue'
import GlOptions from "../../GlOptions.vue";
import {useEntityStore} from "@geelato/gl-ide";
import {EntityReader} from "@geelato/gl-ui";
import GlFieldsSetter from "./GlFieldsSetter.vue";
import GlParamsSetter from "./GlParamsSetter.vue";
import GlOrderSetter from "./GlOrderSetter.vue";
export default defineComponent({
  name: "GlEntityReaderSetter",
  components: {GlOptions,GlFieldsSetter,GlParamsSetter,GlOrderSetter},
  props: {
    modelValue: {
      type: Object as PropType<EntityReader>,
      default() {
        return new EntityReader()
      }
    }
  },
  created() {
    this.entityStore.loadEntityLiteMetas('')
  },
  beforeUpdate() {
    // this.mv = this.modelValue
  },
  data() {
    return {
      entityStore: useEntityStore(),
      mv: this.modelValue as EntityReader,
    }
  },
  watch: {
  },
  methods:{
    onEntityChange(entityName:string){
      console.log('onEntityChange',entityName)
      this.entityStore.loadFieldMetas('',entityName)
    },
    onUpdate(){
      console.log('onUpdate')
      this.$emit('update:modelValue', this.mv)
    }
  }
})
</script>

<style scoped>

</style>
