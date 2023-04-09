<template>
  <div class="gl-block-bar-expression">
    <a-space>
      <span class="gl-block-title">
      设置
    </span>
      <span>
      <a-select v-model="expression.key" :allowClear="false" style="min-width: 6em" size="small">
        <a-select-option v-for="compareOperate in compareOperates" :key="compareOperate.value"
                         :value="compareOperate.value"
                         :title="compareOperate.title">
          {{compareOperate.title}}
        </a-select-option>
      </a-select>
    </span>
      <span style="margin: 0 0.3em">
      等于
    </span>
      <span>
      <a-select v-model="expression.value" :allowClear="true" style="min-width: 6em" size="small">
        <a-select-option v-for="compareOperate in compareOperates" :key="compareOperate.value"
                         :value="compareOperate.value"
                         :title="compareOperate.title">
          {{compareOperate.title}}
        </a-select-option>
      </a-select>
    </span>
    </a-space>
  </div>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: "GlSetValueBlock",
    mixins: [mixin],
    props: {
      blockItems: {
        type: Array,
        required: false
      }
    },
    data() {
      return {
        subBlockItems: [],
        expression: {
          key: '未选择',
          compareOperate: '未选择',
          value: ''
        },
        compareOperates: [{title: '小于等于', value: 'lte'}, {title: '小于', value: 'lt'}]
      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>
