<template>
  <table class="gl-entity-reader-setter gl-table">
    <tr>
      <td class="gl-table-cell gl-label">绑定实体</td>
    </tr>
    <tr>
      <td class="gl-table-cell">
        <a-select v-model="mv.entity" @change="onEntityChange" allowSearch>
          <a-option v-for="item in entityStore.entityLiteMetas" :value="item.entityName">{{ item.entityTitle }}
            {{ item.entityName }}
          </a-option>
        </a-select>
      </td>
    </tr>
    <!--========================= 查询列 ===========================-->
    <tr>
      <td class="gl-table-cell gl-label">数据列</td>
    </tr>
    <tr>
      <td class="gl-table-cell">
        <GlFieldsSetter v-model="mv.fields" :entityFieldMetas="entityStore.currentFieldMetas"
                        :aliasOptions="options"
                        @changeElement="onUpdate"></GlFieldsSetter>
      </td>
    </tr>
    <!--=========================查询参数===========================-->
    <tr>
      <td class="gl-table-cell gl-label" title="服务端数据筛选">数据筛选</td>
    </tr>
    <tr>
      <td class="gl-table-cell">
        <GlParamsSetter v-model="mv.params" :entityFieldMetas="entityStore.currentFieldMetas"
                        @changeElement="onUpdate"></GlParamsSetter>
      </td>
    </tr>
    <!--=========================查询参数===========================-->
    <tr>
      <td class="gl-table-cell gl-label">排序字段</td>
    </tr>
    <tr>
      <td class="gl-table-cell">
        <GlOrderSetter v-model="mv.order" :entityFieldMetas="entityStore.currentFieldMetas"
                       @changeElement="onUpdate"></GlOrderSetter>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" title="数据加载的时机，一是组件初始化即加载，一是组件的加载数据方法被调用才加载">
        加载时机？
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell">
        <a-switch v-model="mv.immediate">
          <template #checked>
            初化时
          </template>
          <template #unchecked>
            调用时
          </template>
        </a-switch>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label" title="对于级联加载的数据可以配置懶加载即分层加载">懶加载？</td>
    </tr>
    <tr>
      <td class="gl-table-cell">
        <a-switch v-model="mv.lazyLoad">
          <template #checked>
            分批次触发加载
          </template>
          <template #unchecked>
            一次性加载完毕
          </template>
        </a-switch>
      </td>
    </tr>
    <tr>
      <td class="gl-table-cell gl-label">最大记录数</td>
    </tr>
    <tr>
      <td class="gl-table-cell">
        <a-input-number v-model="mv.pageSize" :min="1" :max="1000" :precision="0"></a-input-number>
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
  components: {GlOptions, GlFieldsSetter, GlParamsSetter, GlOrderSetter},
  props: {
    modelValue: {
      type: Object as PropType<EntityReader>,
      default() {
        return new EntityReader()
      }
    },
    /**
     *  重命名选项，指定实体需要重命名的字段，便于页面操作
     */
    options: {
      type: Array as PropType<Record<"label" | "value", any>[]>,
      default() {
        return []
      }
    }
  },
  created() {
    this.entityStore.loadEntityLiteMetas('')
    if (this.modelValue && this.modelValue.entity) {
      this.onEntityChange(this.modelValue.entity)
    }
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
  watch: {},
  methods: {
    onEntityChange(entityName: string) {
      console.log('onEntityChange', entityName)
      this.entityStore.loadFieldMetas('', entityName)
    },
    onUpdate() {
      console.log('onUpdate')
      this.$emit('update:modelValue', this.mv)
    }
  }
})
</script>

<style>
.gl-entity-reader-setter .gl-label {
  padding-left: 0.5em;
  text-align: left;
  background-color: white;
  font-weight: 550;
}

.gl-entity-reader-setter .gl-drag {
  width: 1.5em;
  text-align: center
}

.gl-entity-reader-setter .gl-extra {
  min-width: 1em;
  text-align: center;
}

.gl-entity-reader-setter .gl-icon-font {
  cursor: pointer;
}
</style>
