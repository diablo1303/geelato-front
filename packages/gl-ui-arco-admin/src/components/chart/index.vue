<script lang="ts">
export default {
  name: 'GlEcharts',
}
</script>

<script lang="ts" setup>
import {nextTick, ref} from 'vue';
import VCharts from 'vue-echarts';

defineProps({
  options: {
    type: Object,
    default() {
      return {};
    },
  },
  autoResize: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
});

const renderChart = ref(false);
// wait container expand
nextTick(() => {
  renderChart.value = true;
});
</script>

<template>
  <VCharts v-if="renderChart" :autoresize="autoResize" :option="options" :style="{ width, height }"/>
</template>

<style lang="less" scoped></style>
