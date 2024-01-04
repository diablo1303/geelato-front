<script lang="ts">
export default {
  name: 'GlChart'
}
</script>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import mixins from '../../components/mixins'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  label: String,
  hideLabel: Boolean,
  // 子标题
  subText: String,
  // 标题高级设置
  titleProps: Object,
  // 图例
  legend: Object,
  dataSource: Object,
  /**
   *  {name:string,type:string,displayName:string}
   */
  dimensions: Object,
  ...mixins.props
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

const glChart = ref()
// 基于准备好的dom，初始化echarts实例
let myChart: EChartsType | undefined = undefined

/**
 *  构建chart的标题配置
 */
const title = computed(() => {
  let result = {
    text: props.label,
    show: props.hideLabel !== true,
    subtext: props.subText,
    triggerEvent: true
  }
  Object.assign(result, props.titleProps)

  return result
})

const getOption = () => {
  return {
    title: title.value,
    legend: props.legend,
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  }
}

watch(
  () => {
    return {title,legend:props.legend}
  },
  () => {
    myChart?.clear()
    myChart?.setOption(getOption(), true)
  },
  { deep: true }
)

const resize = () => {
  console.log('resize')
  myChart?.resize()
}

const divResizeResizeObserver = new ResizeObserver(resize)

const click = (params: any) => {
  console.log('click my chart params:', params)
}

onMounted(() => {
  if (!myChart) {
    myChart = echarts.init(glChart.value)!
    // 绘制图表
    myChart?.setOption(getOption())
    window.addEventListener('resize', resize)
    divResizeResizeObserver.observe(glChart.value)
    myChart.on('click', click)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  myChart?.off('click', click)
  if (glChart.value) {
    // 在设计时直接删除组件时，value为null，该场景需要排除
    divResizeResizeObserver.unobserve(glChart.value)
  }
})

defineExpose({})
</script>

<template>
  <div ref="glChart" style="width: 100%; height: 400px"></div>
</template>

<style scoped></style>
